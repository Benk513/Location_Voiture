import { Utilisateur } from "../models/utilisateur.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { APIFiltres } from "../utils/apiFiltres.js";

import multer from "multer";
import sharp from "sharp";

const multerStockage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Veuillez televerser une image svp! ceci n'est pas une image",
        400
      ),
      false
    );
  }
};

const televerser = multer({
  storage: multerStockage,
  fileFilter: multerFilter,
});

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

export const televerserPhotoProfil = televerser.single("photo");

export const redimensionerPhotoUtilisateur = (req, res, next) => {
  if (!req.file) return next();
  const ext = req.file.mimetype.split("/")[1];
  req.file.filename = `user-${req.user.id}-${Date.now()}.${ext}`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat()
    .toFile(`./public/images/users/${req.file.filename}`);
  next();
};

export const mettreAJourPhotoProfile = catchAsync(async (req, res, next) => {
  const utilisateur = await Utilisateur.findByIdAndUpdate(
    req.params.id,
    { photo: req.file.filename },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "succes",
    data: utilisateur,
  });
});

export const creerUtilisateur = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data)
    return res.status(404).json({
      status: "echec",
      message: "Il y a aucune donnée",
    });
  const utilisateur = await Utilisateur.create(data);
  res.status(201).json({
    status: "succes",
    data: utilisateur,
  });
});

// lister toutes les utilisateur du systeme
export const listerUtilisateurs = catchAsync(async (req, res, next) => {
  const apiFiltres = new APIFiltres(Utilisateur.find(), req.query)
    .filtrer()
    .trier()
    .limiterChamps()
    .pagination();

  const utilisateurs = await apiFiltres.query;

  res.status(200).json({
    status: "succes",
    resulats: utilisateurs.length,
    data: utilisateurs,
  });
});

// consulter les details d'une voiture

export const detailUtilisateur = catchAsync(async (req, res, next) => {
  const utilisateur = await Utilisateur.findById(req.params.id);

  if (!utilisateur)
    return next(new AppError("Aucun utilisateur trouvée avec cet ID", 404));

  res.status(200).json({
    status: "succes",
    data: utilisateur,
  });
});

// supprimer une voiture du systeme
export const supprimerUtilisateur = catchAsync(async (req, res, next) => {
  const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);

  if (!utilisateur)
    return next(new AppError("Aucun Utilisateur trouvé avec cet ID", 404));

  res.status(204).json({
    status: "succes",
    data: null,
  });
});

export const obtenirMonProfil = catchAsync(async (req, res, next) => {
  const user = await Utilisateur.findById(req.user.id);

  console.log(" le user req id :", req.user.id);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

// updateUserProfile	Modifier les informations du profil	PUT	/api/users/profile/:id
export const miseAJourProfile = catchAsync(async (req, res, next) => {
  if (req.body.motDePasse || req.body.confirmationMotDePasse)
    return next(
      new AppError(
        "La modification des mots de passe n'est pas autorisée sur cette route !"
      )
    );

  const filteredBody = filteredObj(
    req.body,
    "nom",
    "email",
    "biographie",
    "telephone",
    "adresse"
  );

  if (req.file) filteredBody.photo = req.file.filename;

  //3 update user doc
  const updatedUser = await Utilisateur.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true, // new means will create a new document and kill the previous one
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "succes",
    message: "Profil mis a jour avec succes",
    data: updatedUser,
  });
});
