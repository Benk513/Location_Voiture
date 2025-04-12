import { Annonce } from "../models/annonce.model";
import catchAsync from "../utils/catchAsync";

export const creerAnnonce = catchAsync(async (req, res, next) => {
  const annonce = await Annonce.create({
    ...req.body,
    proprietaire: req.user.id,
  });
  res.status(201).json({
    status: "succes",
    data: annonce,
  });
});

export const listerAnnonces = catchAsync(async (req, res, next) => {
  const { lieu, dateDebut, dateFin, prixMin, prixMax } = req.query;
  const filters = { status: "actif" };

  if (lieu) filters.lieu = { $regex: new RegExp(lieu, "i") };
  if (dateDebut && dateFin) {
    filters.dateDebut = { $lte: new Date(dateDebut) };
    filters.dateFin = { $gte: new Date(dateFin) };
  }

  if (prixMin || prixMax) {
    filters.prixJournalier = {};
    if (prixMin) filters.prixJournalier.$gte = parseFloat(prixMin);
    if (prixMax) filters.prixJournalier.$lte = parseFloat(prixMax);
  }

  const annonces = await Annonce.find(filters).populate("voiture");
  res.status(200).json({
    status: "succes",
    data: annonces,
  });
});

// consulter une annonce en detail
export const detailAnnonce = catchAsync(async (req, res, next) => {
  try {
    const annonce = await Annonce.findById(req.params.id).populate("vehicule");
    if (!annonce)
      return res.status(404).json({ message: "Annonce non trouvée" });
    res.status(200).json(annonce);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// mettre a jour
export const mettreAJourAnnonce = catchAsync(async (req, res, next) => {
  const annonce = await Annonce.findOneAndUpdate(
    { _id: req.params.id, proprietaire: req.user._id },
    req.body,
    { new: true }
  );
  if (!annonce)
    return res
      .status(404)
      .json({ message: "Annonce non trouvée ou non autorisée" });
  res.status(200).json(annonce);
});

// supprimer annonce
export const supprimerAnnonce = catchAsync(async (req, res, next) => {
  const deleted = await Annonce.findOneAndDelete({
    _id: req.params.id,
    proprietaire: req.user._id,
  });
  if (!deleted)
    return res
      .status(404)
      .json({ message: "Annonce non trouvée ou non autorisée" });
  res.status(200).json({ message: "Annonce supprimée" });
});
