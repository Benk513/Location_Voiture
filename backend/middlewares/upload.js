import multer from "multer";
import path from "path";

// Dossier de destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/voitures"); // dossier où stocker les images
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Filtrer les fichiers (images uniquement)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non supporté"), false);
  }
};

// Limites : max 5 images
const upload = multer({
  storage,
  fileFilter,
  limits: { files: 5 },
});

export default upload;
