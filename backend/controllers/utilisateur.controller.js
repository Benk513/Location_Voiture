import { Utilisateur } from "../models/utilisateur.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
// to get rid of try catch block we wrap around a catchAsync function , retunr anonymupouis function wjhich will be to create tour

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

// lister toutes les voitures du systeme
export const listerUtilisateurs = catchAsync(async (req, res, next) => {
  const utilisateurs = await Utilisateur.find();
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
