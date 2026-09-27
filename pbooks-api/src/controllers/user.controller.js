import path from "path";
import fs from "fs";

import User from "../models/users.model.js";
import handleUpload from "../config/formidable.js";
import { getPage } from "../utils/getPage.js";
import { setProjectRole, setUserActive } from "../services/zitadel.service.js";

//============================== GET =======================================//

// Récupérer tous les utilisateurs
const getAll = async (req, res, next) => {
  const page = getPage(req);
  const search = req.query.q?.trim() || "";
  const limit = 25;

  try {
    const { datas, count } = await User.findAll(search, page, limit);
    const totalPages = Math.ceil(count / limit);
    res.json({ datas, totalPages });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

// Récupérer les informations d'un utilisateur
const getInfos = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const [response] = await User.findOne(userId);
    if (response.length) {
      res.json({
        message: "Utilisateur récupéré.",
        datas: { ...response[0], role: req.user.role },
      });
      return;
    }
    res.status(400).json({
      message: "Utilisateur non trouvé.",
    });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

// Récupérer les utilisateurs par recherche
const getBySearch = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(400)
      .json({ message: "Paramètre de recherche manquant." });
  }

  try {
    const formatted = `%${q}%`;
    const [datas] = await User.findBySearch(formatted);

    return res.status(200).json({ datas });
  } catch (err) {
    console.error("Erreur dans getBySearch :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la recherche." });
  }
};

//============================== PATCH =======================================//

// Mettre à jour les informations d'un utilisateur
const update = async (req, res, next) => {
  return res.status(400).json({
    message: "Le pseudo, l'e-mail et le mot de passe se modifient dans Zitadel.",
  });
};

// Mettre à jour l'avatar d'un utilisateur
const uploadAvatar = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur manquant." });
  }

  const formOptions = {
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads/temp"),
    maxFileSize: 5 * 1024 * 1024,
  };

  handleUpload(
    req,
    res,
    async () => {
      if (!req.files || !req.files.avatar) {
        return res.status(400).json({ message: "Fichier avatar manquant." });
      }

      const avatarFile = req.files.avatar[0];
      const fileExt = path
        .extname(avatarFile.originalFilename || "")
        .toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
      if (!validExtensions.includes(fileExt)) {
        if (avatarFile.filepath) {
          fs.unlink(avatarFile.filepath, (err) => {
            if (err) {
              console.error(
                "Erreur lors de la suppression du fichier invalide :",
                err
              );
            }
          });
        }
        return res
          .status(400)
          .json({ message: "Format de fichier non autorisé." });
      }

      const newFilename = `avatar_${Date.now()}${fileExt}`;
      const outputFilePath = path.join(
        process.cwd(),
        "public/uploads/avatars",
        newFilename
      );

      try {
        // Utiliser copyFileSync puis unlinkSync au lieu de renameSync pour éviter les problèmes cross-device
        fs.copyFileSync(avatarFile.filepath, outputFilePath);
        fs.unlinkSync(avatarFile.filepath);

        const [user] = await User.findOne(userId);
        const oldAvatar = user[0]?.avatar;
        if (oldAvatar && oldAvatar !== "default-avatar.png") {
          try {
            fs.unlinkSync(path.join(process.cwd(), "public/uploads/avatars", oldAvatar));
          } catch (unlinkError) {
            console.error("Erreur lors de la suppression de l'ancien avatar:", unlinkError);
          }
        }

        await User.updateAvatar(newFilename, userId);
        return res.send(newFilename);
      } catch (error) {
        // Nettoyer le fichier temporaire en cas d'erreur
        try {
          if (fs.existsSync(avatarFile.filepath)) {
            fs.unlinkSync(avatarFile.filepath);
          }
        } catch (cleanupError) {
          console.error("Erreur lors du nettoyage du fichier temporaire:", cleanupError);
        }

        return res.status(500).json({
          success: false,
          message: "Erreur lors du traitement de l'image.",
          error: error.message,
        });
      }
    },
    formOptions
  );
};

// Mettre à jour les informations d'un utilisateur par un admin 
const updateByAdmin = async (req, res, next) => {
  const { id, status, role } = req.body;
  if (!id || (!status && !role)) {
    return res.status(400).json({ message: "ID ou données manquantes" });
  }

  try {
    const target = await User.findById(id);
    if (!target?.zitadel_subject) {
      return res.status(404).json({ message: "Compte Zitadel introuvable." });
    }
    if (status) await setUserActive(target.zitadel_subject, status === "actif");
    if (role) await setProjectRole(target.zitadel_subject, role);

    res.json({ success: "Utilisateur mis à jour par l'admin." });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    next(error);
  }
};

// Mettre à jour le thème d'un utilisateur
const updateTheme = async (req, res, next) => {
  const { theme } = req.body;
  const id = req.user.id;
  if (!theme) {
    return res.status(400).json({ message: "Thème manquant." });
  }
  try {
    const result = await User.userTheme(theme, id);
    if (result.error) {
      return res.status(500).json(result);
    }
    res.json({ success: "Thème mis à jour.", theme });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du thème:", error);
    next(error);
  }
};

//============================== DELETE =======================================//

// Supprimer un utilisateur
const remove = async (req, res, next) => {
  const id = req.body.id || req.user.id;

  if (!id) {
    return res.status(400).json({ message: "ID utilisateur manquant." });
  }

  if (req.user.role === "admin" && Number(id) === Number(req.user.id)) {
    return res.status(400).json({
      message: "Un administrateur ne peut pas supprimer son propre compte.",
    });
  }

  try {
    const target = await User.findById(id);
    if (!target?.zitadel_subject) {
      return res.status(400).json({ message: "Ce compte n'existe pas." });
    }
    await setUserActive(target.zitadel_subject, false);
    return res.json({ message: "Compte désactivé." });
  } catch (error) {
    next(error);
  }
};

export {
  getAll,
  getInfos,
  getBySearch,
  update,
  updateByAdmin,
  uploadAvatar,
  updateTheme,
  remove,
};
