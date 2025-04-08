import { Voiture } from "./../models/voiture.model.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
// to get rid of try catch block we wrap around a catchAsync function , retunr anonymupouis function wjhich will be to create tour

export const ajouterVoiture = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (req.user.role !== "proprietaire")
    return next(
      new AppError(
        "Acces refusé : seul un proprietaire peut ajouter un vehicule!",
        403
      )
    );

  if (!data)
    return res.status(404).json({
      status: "echec",
      message: "Il y a aucune donnée",
    });
  const voiture = await Voiture.create({ ...data, proprietaire: req.user.id });
  res.status(201).json({
    status: "succes",
    message: "Voiture ajouté avec succes!",
    data: voiture,
  });
});

// lister toutes les voitures du systeme (public)
export const listerVoitures = catchAsync(async (req, res, next) => {
  const voitures = await Voiture.find().sort("-createdAt");
  res.status(200).json({
    status: "succes",
    resulats: voitures.length,
    data: voitures,
  });
});

// consulter les details d'une voiture

export const detailVoiture = catchAsync(async (req, res, next) => {
  const voiture = await Voiture.findById(req.params.id);

  if (!voiture)
    return next(new AppError("Aucune voiture trouvée", 404));

  res.status(200).json({
    status: "succes",
    data: voiture,
  });
});

// supprimer une voiture du systeme
export const supprimerVoiture = catchAsync(async (req, res, next) => {
  const voiture = await Voiture.findByIdAndDelete(req.params.id);

  if (!voiture)
    return next(new AppError("Aucune voiture trouvée avec cet ID", 404));

  res.status(204).json({
    status: "succes",
    data: null,
  });
});
