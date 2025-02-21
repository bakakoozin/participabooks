import formidable from "formidable";
import path from "path";
import fs from "fs";
import User from "../models/users.model.js";
import sendResponse from "../helpers.sendResponse.js";

//============================== GET =======================================//

const getAll = async (req, res, next) => {
  try {
    const [users] = await User.findAll();
    req.json({ datas: users });
  } catch (error) {
    next(error);
  }
};

const getInfos = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const [response] = await User.findOne(userId);
    if (response.length) {
      res.json({ message: "Utilisateur récupéré.", datas: response[0] });
      return;
    }
    res.status(400).json({
      message: "Utilisateur non trouvé.",
    });
  } catch (error) {
    next(error);
  }
};

const getBySearch = async (req, res, next) => {
  const formattedSearch = `%${req.query.q.trim() || ""}%`;
  try {
    const [response] = await User.findBySearch(formattedSearch);

    if (response.length) {
      sendResponse(res, "Utilisateurs récupérés.", 200, response);
    }
    sendResponse(res, "Aucun utilisateur trouvé.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

//============================== PATCH =======================================//

const update = async (req, res, next) => {
  const { id, email, pseudo, password } = req.body;

  const userInfos = {};
  if (email) userInfos.email = email;
  if (pseudo) userInfos.pseudo = pseudo;
  if (password) userInfos.password = password;

  if (Object.keys(userInfos).length === 0) {
    return res.status(400).json({ message: "Aucune mise à jour à effectuer." });
  }

  const fields = Object.keys(userInfos)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(userInfos);
  values.push(id);

  const UPDATE_USER = `UPDATE users SET ${fields} WHERE id = ?`;

  try {
    const result = await User.update(UPDATE_USER, values);

    if (result.error) {
      return res.status(500).json(result);
    }

    res.json({ success: "Utilisateur mis à jour." });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res) => {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur formidable :", err);
      return res.status(500).json({ message: "Erreur lors de l'upload." });
    }

    const userId = fields.userId?.[0];
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur manquant." });
    }

    const avatarFile = files.avatar;
    if (!avatarFile) {
      return res.status(400).json({ message: "Aucun fichier reçu." });
    }

    const oldPath = files.avatar.filepath;
    const fileExt = path.extname(avatarFile.originalFilename);
    const newFileName = `avatar_${userId}${fileExt}`;
    const newPath = path.join(uploadDir, newFileName);

    fs.rename(oldPath, newPath, async (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors du déplacement du fichier" });
      }

      const avatarUrl = `/uploads/avatars/${newFileName}`;

      try {
        await User.updateAvatar(avatarUrl, userId);

        return res.json({
          message: "Avatar mis à jour avec succès !",
          avatarUrl,
        });
      } catch (dbError) {
        console.error("Erreur lors de la mise à jour de l'avatar:", dbError);
        return res
          .status(500)
          .json({ message: "Erreur de mise à jour en base" });
      }
    });
  });
};

const updateByAdmin = async (req, res, next) => {
  const { id, status, role } = req.body;

  const userInfos = {};
  if (status !== undefined) userInfos.status = status;
  if (role !== undefined) userInfos.role = role;

  if (Object.keys(userInfos).length === 0) {
    return res.status(400).json({ message: "Aucune mise à jour à effectuer." });
  }

  const fields = Object.keys(userInfos)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(userInfos);
  values.push(id);

  const UPDATE_BY_ADMIN = `UPDATE users SET ${fields} WHERE id = ?`;

  try {
    const result = await User.update(UPDATE_BY_ADMIN, values);

    if (result.error) {
      return res.status(500).json(result);
    }

    res.status(200).json({ success: "Utilisateur mis à jour par l'admin." });
  } catch (error) {
    next(error);
  }
};

//============================== DELETE =======================================//

const remove = async (req, res, next) => {
  try {
    const [response] = await User.delete(req.user.userId);
    if (response.affectedRows) {
      res.json({ message: "Compte supprimé." });
      return;
    }
    res.status(400).json({ message: "Ce compte n'existe pas." });
    return;
  } catch (error) {
    next(error);
  }
};

export {
  update,
  updateByAdmin,
  getAll,
  getInfos,
  getBySearch,
  remove,
  uploadAvatar,
};
