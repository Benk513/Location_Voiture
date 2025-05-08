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
import { Annonce } from "../models/annonce.model.js";

// creer une nouvelle location
// export const creerLocation = catchAsync(async (req, res, next) => {
//   const {
//     voiture: voitureId,
//     dateDebut,
//     dateFin,
//     lieuDepart,
//     lieuRetour,
//   } = req.body;

//   const voiture = await Voiture.findById(voitureId);
//   if (!voiture) return next(new AppError("Voiture non trouvé"));

//   // Extraire l'ID de l'utilisateur depuis req.user
//   const userId = req.user._id;
//   console.log(userId);

//   // calculer la durée de la location en jours
//   const debut = new Date(dateDebut);
//   const fin = new Date(dateFin);
//   const diffTime = Math.abs(fin.getTime() - debut.getTime());

//   const nbrJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//   // calcul du cout total
//   let coutTotal = nbrJours * voiture.tarifParJour;

//   const location = await Location.create({
//     voiture: voiture._id,
//     locataire: userId,
//     dateDebut: debut,
//     dateFin: fin,
//     status: "en attente",
//     lieuDepart,
//     lieuRetour,
//     coutTotal,
//     proprietaire: voiture.proprietaire,
//   });

//   res.status(201).json({
//     status: "succes",
//     data: location,
//   });
// });

// POST /api/locations
// export const creerDemandeLocation = catchAsync(async (req, res, next) => {
//   const { annonceId, dateDebut, dateFin } = req.body;
//   const annonce = await Annonce.findById(annonceId).populate("voiture");

//   if (!annonce || annonce.statut !== "actif") {
//     return next(new AppError("Annonce invalide ou désactivée", 400));
//   }

//   const montant = calculerMontantTotal(
//     annonce.voiture.tarifParJour,
//     new Date(dateDebut),
//     new Date(dateFin)
//   );

//   const location = await Location.create({
//     annonce: annonceId,
//     locataire: req.user._id,
//     dateDebut: new Date(dateDebut),
//     dateFin: new Date(dateFin),

//     montantTotal: montant,
//   });

//   res.status(201).json({
//     status: "succès",
//     data: location,
//   });
// });

import { isValid, parseISO } from "date-fns";

export const creerDemandeLocation = catchAsync(async (req, res, next) => {
  const { annonceId, dateDebut, dateFin, adresseDepot, adresseRetrait } =
    req.body;

  const annonce = await Annonce.findById(annonceId).populate("voiture");

  if (!annonce || annonce.statut !== "disponible") {
    return next(new AppError("Annonce invalide ou désactivée", 400));
  }

  // 🔒 Parse et valide les dates
  const parsedStart = new Date(dateDebut);
  const parsedEnd = new Date(dateFin);

  if (isNaN(parsedStart) || isNaN(parsedEnd)) {
    return next(
      new AppError("Dates invalides. Format attendu : YYYY-MM-DD", 400)
    );
  }

  // ⛔ Début après fin
  if (parsedStart >= parsedEnd) {
    return next(
      new AppError("La date de début doit être avant la date de fin", 400)
    );
  }

  // ✅ Vérifie si la réservation est dans la période de l'annonce
  if (parsedStart < annonce.dateDebut || parsedEnd > annonce.dateFin) {
    return next(
      new AppError(
        "Les dates de réservation doivent être dans la période de l'annonce",
        400
      )
    );
  }

  const montant = calculerMontantTotal(
    annonce.voiture.tarifParJour,
    parsedStart,
    parsedEnd
  );

  const location = await Location.create({
    annonce: annonceId,
    locataire: req.user._id,
    dateDebut: parsedStart,
    dateFin: parsedEnd,
    montantTotal: montant,
    adresseDepot,
    adresseRetrait,
  });

  annonce.statut = "reserve";
  await annonce.save();

  res.status(201).json({
    status: "succès",
    data: location,
  });
});

function calculerMontantTotal(tarif, debut, fin) {
  const nbJours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
  return nbJours * tarif;
}

// GET /api/locations/mes-demandes
export const listerDemandesProprio = catchAsync(async (req, res, next) => {
  const annonces = await Annonce.find({ proprietaire: req.user._id });
  const ids = annonces.map((a) => a._id);

  const demandes = await Location.find({ annonce: { $in: ids } })
    .populate("locataire")
    .populate({
      path: "annonce",
      populate: { path: "voiture" },
    });

  res.status(200).json({
    status: "ok",
    resultats: demandes.length,
    data: demandes,
  });
});

// PATCH /api/locations/:id
export const traiterDemandeLocation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.id).populate("annonce");

  if (
    !location ||
    location.annonce.proprietaire.toString() !== req.user._id.toString()
  ) {
    return next(new AppError("Accès non autorisé", 403));
  }

  location.statut = req.body.action === "accepter" ? "acceptee" : "refusee";
  await location.save();

  res.status(200).json({ status: "succès", data: location });
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

// // PATCH /api/locations/:id/decision
// export const traiterDemandeLocation = catchAsync(async (req, res, next) => {
//   const { action } = req.body;

//   if (!["accepter", "refuser"].includes(action)) {
//     return next(new AppError("Action invalide (accepter/refuser)", 400));
//   }

//   const location = await Location.findById(req.params.id).populate({
//     path: "annonce",
//     select: "proprietaire dateDebut dateFin",
//   });

//   if (!location) return next(new AppError("Location introuvable", 404));
//   if (location.annonce.proprietaire.toString() !== req.user._id.toString()) {
//     return next(new AppError("Non autorisé", 403));
//   }

//   if (location.statut !== "en_attente") {
//     return next(new AppError("Cette demande a déjà été traitée.", 400));
//   }

//   if (action === "accepter") {
//     // ✅ Vérifier les conflits avant de l'accepter
//     const conflits = await Location.find({
//       annonce: location.annonce._id,
//       statut: "acceptee",
//       $or: [
//         {
//           dateDebut: { $lte: location.dateFin },
//           dateFin: { $gte: location.dateDebut },
//         },
//       ],
//     });

//     if (conflits.length > 0) {
//       return next(new AppError("Conflit de dates avec une autre location.", 409));
//     }

//     location.statut = "acceptee";
//   } else {
//     location.statut = "refusee";
//   }

//   await location.save();

//   res.status(200).json({
//     status: "succès",
//     data: location,
//   });
// });

// GET /api/locations/mes-reservations
export const listerMesReservations = catchAsync(async (req, res, next) => {
  const locations = await Location.find({ locataire: req.user._id })
    .populate({
      path: "annonce",
      populate: {
        path: "voiture",
      },
    })
    .sort({ dateDebut: -1 });

  res.status(200).json({
    status: "succès",
    résultats: locations.length,
    data: locations,
  });
});

// DELETE /api/locations/:id/annuler
export const annulerReservation = catchAsync(async (req, res, next) => {
  const location = await Location.findById(req.params.id).populate("annonce");

  if (!location) {
    return next(new AppError("Réservation non trouvée", 404));
  }

  // Vérifie que c’est bien le locataire
  if (location.locataire.toString() !== req.user._id.toString()) {
    return next(
      new AppError("Vous n'avez pas le droit d'annuler cette réservation", 403)
    );
  }

  // (Optionnel) Ne pas annuler si déjà validée
  if (location.statut === "acceptée") {
    return next(
      new AppError("Impossible d'annuler une réservation déjà acceptée", 400)
    );
  }

  await location.deleteOne();

  res.status(200).json({
    status: "succès",
    message: "Réservation annulée",
  });
});

// GET /api/locations/mes-demandes
export const listerDemandesSurMesAnnonces = catchAsync(
  async (req, res, next) => {
    // On cherche les annonces de ce propriétaire
    const mesAnnonces = await Annonce.find(
      { proprietaire: req.user._id },
      "_id"
    );
    const mesAnnonceIds = mesAnnonces.map((a) => a._id);

    // On récupère toutes les réservations liées
    const demandes = await Location.find({ annonce: { $in: mesAnnonceIds } })
      .populate("locataire", "nom email")
      .populate({
        path: "annonce",
        populate: {
          path: "voiture",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "succès",
      résultats: demandes.length,
      data: demandes,
    });
  }
);
