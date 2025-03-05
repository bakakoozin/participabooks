import formidable from "formidable";
import path from "path";
import sharp from "sharp";

export const handleUpload = (req, res, next) => {
  const form = formidable({
    multiples: true,
    uploadDir: path.join(process.cwd(), "public/uploads/temp"),
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, 
    allowEmptyFiles: false,
  });

  form.parse =(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Erreur lors de l'upload", error: err.message });
    }

    req.body = fields; // Champs du formulaire
    req.files = files; // Fichiers téléchargés

// Redimensionner les images
try {
    for (const fileKey in files) {
      const file = files[fileKey];
      const outputFilePath = path.join(process.cwd(), "public/uploads", file.newFilename);

      await sharp(file.filepath)
        .resize(300, 300) // Redimensionner à 300x300 pixels
        .toFile(outputFilePath);

      // Mettre à jour le chemin du fichier redimensionné
      file.filepath = outputFilePath;
    }
  } catch (resizeError) {
    return res.status(500).json({ message: "Erreur lors du redimensionnement de l'image", error: resizeError.message });
  }

    next();
  });
};