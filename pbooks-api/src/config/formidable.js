import formidable from "formidable";
import path from "path";
import fs from "fs";

export const handleUpload = (req, res, next) => {
  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads/temp"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 Mo max
    allowEmptyFiles: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur lors de l'upload", err);
      return res.status(400).json({ message: "Erreur lors de l'upload", error: err.message });
    }

    req.body = fields;
    req.files = files;

    if (!files.avatar || !files.avatar[0]) {
      return res.status(400).json({ message: "Fichier avatar manquant." });
    }

    const avatarFile = files.avatar[0];

    if (!avatarFile.filepath) {
      return res.status(400).json({ message: "Chemin du fichier temporaire manquant." });
    }

    // Définition du chemin final du fichier
    const fileExt = path.extname(avatarFile.originalFilename || "").toLowerCase();
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    if (!validExtensions.includes(fileExt)) {
      fs.unlink(avatarFile.filepath, () => {}); // Supprime le fichier temporaire
      return res.status(400).json({ message: "Extension de fichier invalide." });
    }

    const newFileName = `avatar_${Date.now()}${fileExt}`;
    const outputFilePath = path.join(process.cwd(), "public/uploads/avatars", newFileName);

    try {
      fs.renameSync(avatarFile.filepath, outputFilePath);
      req.avatarUrl = newFileName;
      next();
    } catch (error) {
      console.error("Erreur lors du déplacement du fichier:", error);
      return res.status(500).json({ message: "Erreur lors du traitement de l'image", error: error.message });
    }
  });
};