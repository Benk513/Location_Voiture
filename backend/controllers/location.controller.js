// getRentalById	Récupérer une location spécifique	GET	/api/rentals/:id
// getUserRentals	Récupérer les locations d’un utilisateur (locataire)	GET	/api/rentals/user/:userId
// getOwnerRentals	Récupérer les locations des véhicules d’un propriétaire	GET	/api/rentals/owner/:ownerId
// updateRentalStatus	Modifier le statut d’une location (en attente, confirmée, terminée, annulée)	PUT	/api/rentals/:id/status
// cancelRental	Annuler une location	PUT	/api/rentals/:id/cancel
// deleteRental	Supprimer une location (admin uniquement)	DELETE	/api/rentals/:id

import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

import { Voiture } from "./../models/voiture.model.js";
import Location from "./../models/location.model.js";

// creer une nouvelle location
export const creerLocation = catchAsync(async (req, res, next) => {
  const {
    voiture: voitureId,
    dateDebut,
    dateFin,
    lieuDepart,
    lieuRetour,
  } = req.body;

  const voiture = await Voiture.findById(voitureId);
  if (!voiture) return next(new AppError("Voiture non trouvé"));

  // Extraire l'ID de l'utilisateur depuis req.user
  const userId = req.user._id;
  console.log(userId);

  // calculer la durée de la location en jours
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const diffTime = Math.abs(fin.getTime() - debut.getTime());

  const nbrJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // calcul du cout total
  let coutTotal = nbrJours * voiture.tarifParJour;

  const location = await Location.create({
    voiture: voiture._id,
    locataire: userId,
    dateDebut: debut,
    dateFin: fin,
    status: "en attente",
    lieuDepart,
    lieuRetour,
    coutTotal,
    proprietaire: voiture.proprietaire,
  });

  res.status(201).json({
    status: "succes",
    data: location,
  });
});

// Liste toutes les locations sur la plateforme
export const listerLocations = catchAsync(async (req, res, next) => {
  // Récupère toutes les locations et « populate » les champs liés (comme véhicule, locataire et propriétaire)
  const locations = await Location.find();

  res.status(200).json({
    status: "succes",
    data: locations,
  });
});

export const detailLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.id);

  if (!location) return next(new AppError("Location non trouvée", 404));
  res.status(200).json({ status: "succes", data: location });
});

// Validation de la reservation par le proprietaire

export const validerLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.id);

  if (!location) return next(new AppError("Location non trouvé", 404));

  if (location.proprietaire.toString() !== req.user._id.toString())
    return next(new AppError("Acces refusé"), 403);

  location.status = "validée";

  await location.save();

  res.status(200).json({ status: "succes", message: "Location validée" });
});

// Marquer la reservation comme payée (apres paiement réussi)

export const marquerCommePayer = catchAsync(async (req, res, next) => {
  const { locationId } = req.body;

  const location = await Location.findById(locationId);
  if (!location) return next(new AppError("Location non trouvée", 404));

  if (location.proprietaire.toString() !== req.user._id.toString())
    return next(new AppError("Acces refusé", 403));

  location.status = "payée";
  await location.save();

  res
    .status(200)
    .json({ status: "succes", message: "Paiement validé, location payée." });
});
