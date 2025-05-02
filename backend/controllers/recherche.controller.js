import { Voiture } from "../models/voiture.model";

import catchAsync from "../utils/catchAsync";

export const rechercherVoiture = catchAsync(async (req, res, next) => {
  const { dateDebut, dateFin, lieu, marque, modele, prixMin, prixMax } =
    req.query;
  const filtre = {};

  // Filtrage par lieu (utilisation d'un regex pour insensibilité à la casse)
  if (lieu) filtre.localisation = { $regex: new RegExp(lieu, "i") };
  if (marque) filtre.marque = { $regex: new RegExp(marque, "i") };
  if (modele) filtre.modele = { $regex: new RegExp(modele, "i") };
  if (prixMin || prixMax) {
    filtre.prixJournalier = {};
    if (prixMin) filtre.tarifParJour.$gte = Number(prixMin);
    if (prixMax) filtre.tarifParJour.$lte = Number(prixMax);
  }

  // Pour les dates, la logique peut être plus complexe pour vérifier la disponibilité des véhicules
  // Ici, on suppose qu'un véhicule est disponible si aucune réservation ne couvre la période demandée.
  // Cette partie nécessite une jointure avec le modèle Reservation (non inclus ici pour simplifier).

  const vehicles = await Voiture.find(filtre);
  res.status(200).json({
    status: "success",
    total: vehicles.length,
    data: vehicles,
  });
});
