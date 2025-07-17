import formidable from "formidable";
import path from "path";

// Middleware pour gérer l'upload de fichiers avec la bibliothèque "formidable"
const handleUpload = (req, res, next, options) => {
  const form = formidable({
    multiples: options.multiples || false,
    uploadDir:
      options.uploadDir || path.join(process.cwd(), "public/uploads/avatars"),
    keepExtensions: true,
    maxFileSize: options.maxFileSize || 5 * 1024 * 1024,
    allowEmptyFiles:
      options.allowEmptyFiles !== undefined ? options.allowEmptyFiles : false,
  });

  // Analyse la requête pour extraire les fichiers et les champs
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erreur lors de l'upload", err);
      return res
        .status(400)
        .json({ message: "Erreur lors de l'upload", error: err.message });
    }

    req.body = fields;
    req.files = files;
    next();
  });
};

export default handleUpload;
