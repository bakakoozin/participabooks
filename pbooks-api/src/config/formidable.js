import formidable from "formidable";
import path from "path";
import sharp from "sharp";
import fs from "fs";

export const handleUpload = (req, res, next) => {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(process.cwd(), "public/uploads/temp"), // Répertoire temporaire
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // Limite de 5 Mo
    allowEmptyFiles: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur lors de l'upload", err);
      return res.status(400).json({ message: "Erreur lors de l'upload", error: err.message });
    }

    // Ajout des logs pour vérifier la structure des fichiers
    console.log("Champs reçus:", fields);
    console.log("Fichiers reçus:", files);

    req.body = fields;  // Champs du formulaire
    req.files = files;  // Fichiers téléchargés

    // Vérification si un fichier avatar est présent
    if (!files.avatar || !files.avatar[0]) {
      return res.status(400).json({ message: "Fichier avatar manquant." });
    }

    const avatarFile = files.avatar[0];  // Accéder au premier fichier dans le tableau

    // Vérification de la présence du chemin du fichier
    if (!avatarFile || !avatarFile.filepath) {
      return res.status(400).json({ message: "Chemin du fichier temporaire manquant." });
    }

    // Redimensionnement et déplacement du fichier
    const outputFilePath = path.join(process.cwd(), "public/uploads/avatars", avatarFile.newFilename);
    try {
      console.log("Tentative de redimensionnement du fichier:", avatarFile.filepath);
      
      await sharp(avatarFile.filepath)
        .resize(200, 200)
        .toFile(outputFilePath);
      
      console.log('Fichier redimensionné et sauvegardé à :', outputFilePath);
      
      // Mise à jour de la propriété filepath après le redimensionnement
      avatarFile.filepath = outputFilePath;
      
      // Envoyer la réponse de succès
      res.json({
        message: "Avatar mis à jour avec succès !",
        avatarUrl: `/uploads/avatars/${avatarFile.newFilename}`,
      });
    } catch (error) {
      console.error("Erreur lors du redimensionnement:", error);
      return res.status(500).json({ message: "Erreur lors du redimensionnement", error: error.message });
    }
  });
};
