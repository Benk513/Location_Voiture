import { Voiture } from "./../models/voiture.model.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import multer from "multer";
// to get rid of try catch block we wrap around a catchAsync function , retunr anonymupouis function wjhich will be to create tour

//configure the file location and filetype
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/voitures/");
  },
  filename: (req, file, cb) => {
    // const extName = file.mimetype.split('/')[1]
    const fileName = file.originalname;
    cb(null, `${fileName.toLowerCase()}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only images are allowed", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10000000 },
});

// export const televerserPhotoVoiture= upload.single('images')

export const televerserPhotosVoiture = upload.array("images", 5); // ou plus selon ton besoin


//  ajouter une nouvelle voiture 🟦
export const ajouterVoiture = catchAsync(async (req, res, next) => {
  const data = req.body;
  // tableau des chemins

  console.log("Fichiers reçus :", req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: "echec",
      message: "Veuillez téléverser au moins une image.",
    });
  }

  if (!data)
    return res.status(404).json({
      status: "echec",
      message: "Il y a aucune donnée",
    });

  const imagePaths = req.files.map((file) => file.filename);

  const voiture = await Voiture.create({
    ...data,
    proprietaire: req.user.id,
    images: imagePaths,
  });

  res.status(201).json({
    status: "succes",
    message: "Voiture ajoutée avec succès!",
    data: voiture,
  });
});

// lister toutes les voitures du systeme (public) 🟦
export const listerVoitures = catchAsync(async (req, res, next) => {
  const voitures = await Voiture.find()
    .sort("-createdAt")
    .populate("proprietaire", "photo email nom ");
  res.status(200).json({
    status: "succes",
    resulats: voitures.length,
    data: voitures,
  });
});

// consulter les details d'une voiture 🟦
export const detailVoiture = catchAsync(async (req, res, next) => {
  const voiture = await Voiture.findById(req.params.id);

  if (!voiture) return next(new AppError("Aucune voiture trouvée", 404));

  res.status(200).json({
    status: "succes",
    data: voiture,
  });
});



export const modifierVoiture = catchAsync(async (req, res, next) => {
  const voiture = await Voiture.findById(req.params.id);

  if (!voiture) return next(new AppError("Voiture non trouvée ", 404));

  if (voiture.proprietaire.toString() !== req.user.id.toString())
    return next(new AppError("Acces refusé", 403));

  const nouvelleVoiture = await Voiture.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "succes",
    message: "Voiture mise a jour",
    data: nouvelleVoiture,
  });
});

// supprimer une voiture du systeme
export const supprimerVoiture = catchAsync(async (req, res, next) => {
  const voiture = await Voiture.findById(req.params.id);

  if (!voiture)
    return next(new AppError("Aucune voiture trouvée avec cet ID", 404));

  if (voiture.proprietaire.toString() !== req.user.id.toString()) {
    return next(new AppError("Accès refusé", 403));
  }

  await voiture.deleteOne();

  res.status(204).json({
    message: "voiture supprimé avec succes",
    status: "succes",
    data: null,
  });
});



// -----------------------------POUR PROPRIO ----------------------------------

export const listerMesVoitures = catchAsync(async (req, res, next) => {


  const voitures = await Voiture.find({ proprietaire: req.user._id })
    .sort("-createdAt")
    .populate("proprietaire", "photo email nom ");
  res.status(200).json({
    status: "succes",
    resulats: voitures.length,
    data: voitures,
  });
});