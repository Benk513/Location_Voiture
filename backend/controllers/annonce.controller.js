import { Annonce } from "../models/annonce.model.js";
import { Voiture } from "../models/voiture.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const creerAnnonce = catchAsync(async (req, res, next) => {
  const {
    voiture: voitureId,
    dateDebut,
    dateFin,
    description,
    lieu,
  } = req.body;

  const voiture = await Voiture.findById(voitureId);
  if (!voiture) {
    return next(new AppError("La voiture spécifiée n'existe pas.", 404));
  }

  if (voiture.proprietaire.toString() !== req.user.id) {
    return next(
      new AppError(
        "Vous ne pouvez créer une annonce que pour votre propre voiture.",
        403
      )
    );
  }

  if (new Date(dateDebut) >= new Date(dateFin)) {
    return next(
      new AppError(
        "La date de début doit être antérieure à la date de fin.",
        400
      )
    );
  }

  // Optionnel : vérifier les doublons
  const existing = await Annonce.findOne({
    voiture: voitureId,
    dateDebut,
    dateFin,
  });
  if (existing) {
    return next(
      new AppError(
        "Une annonce existe déjà pour cette voiture à ces dates.",
        400
      )
    );
  }

  const annonce = await Annonce.create({
    voiture: voitureId,
    proprietaire: req.user.id,
    dateDebut,
    dateFin,
    description,
    lieu,
  });

  res.status(201).json({
    status: "succes",
    data: annonce,
  });
});

//  lister toutes les annonces
export const listerAnnonces = catchAsync(async (req, res, next) => {
  const { lieu, dateDebut, dateFin, prixMin, prixMax, sieges, carburant } =
    req.query;

  // Pipeline MongoDB
  const pipeline = [
    // 1. On ne prend que les annonces actives
    {
      $match: { statut: "disponible" },
    },
    // 2. On joint les voitures
    {
      $lookup: {
        from: "voitures",
        localField: "voiture",
        foreignField: "_id",
        as: "voiture",
      },
    },
    {
      $unwind: "$voiture",
    },
  ];

  // 3. Filtres dynamiques sur les voitures
  const voitureFilters = {};

  if (lieu) {
    voitureFilters["voiture.adresse"] = { $regex: new RegExp(lieu, "i") };
  }

  if (prixMin || prixMax) {
    voitureFilters["voiture.tarifParJour"] = {};
    if (prixMin)
      voitureFilters["voiture.tarifParJour"].$gte = parseFloat(prixMin);
    if (prixMax)
      voitureFilters["voiture.tarifParJour"].$lte = parseFloat(prixMax);
  }

  if (sieges) {
    // Support de valeurs multiples : ?sieges=4,5
    const siegeArray = sieges.split(",").map(Number);
    voitureFilters["voiture.nombreDeSieges"] = { $in: siegeArray };
  }

  if (carburant) {
    voitureFilters["voiture.carburant"] = carburant;
  }

  // Dates (éviter les conflits)
  if (dateDebut && dateFin) {
    const dStart = new Date(dateDebut);
    const dEnd = new Date(dateFin);

    // On s'assure que l'annonce couvre les dates demandées
    pipeline.push({
      $match: {
        dateDebut: { $lte: dStart },
        dateFin: { $gte: dEnd },
      },
    });
  }

  // Appliquer les filtres sur voiture
  if (Object.keys(voitureFilters).length > 0) {
    pipeline.push({
      $match: voitureFilters,
    });
  }

  // Résultat final
  const annonces = await Annonce.aggregate(pipeline);

  res.status(200).json({
    status: "succes",
    resultats: annonces.length,
    data: annonces,
  });
});

//  lister les annoonces du proprio
export const listerAnnoncesProprio = catchAsync(async (req, res, next) => {
  // const proprioId = req.params.id;

  const proprioId = req.user._id;

  const annonces = await Annonce.find({ proprietaire: proprioId }).populate(
    "voiture"
  );
  res.status(200).json({
    status: "succes",
    resultats: annonces.length,
    data: annonces,
  });
});

// consulter une annonce par le proprietaire
export const consulterAnnonceParProprietaire = catchAsync(
  async (req, res, next) => {
    const annonceId = req.params.id;

    const annonce = await Annonce.findOne({
      _id: annonceId,
      proprietaire: req.user.id,
    }).populate("voiture");

    if (!annonce) {
      return next(new AppError("Annonce introuvable", 404));
    }

    res.status(200).json({
      status: "succes",
      data: annonce,
    });
  }
);

//lister les 6 recentes annonces
// controllers/annonceController.js

export const listerRecentAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find({ statut: "disponible" })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("voiture"); // pour avoir accès à voiture.nom, voiture.images, etc.

    res.status(200).json(annonces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const detailAnnonce = catchAsync(async (req, res, next) => {
  try {
    const annonce = await Annonce.findById(req.params.id).populate("voiture");
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

export const rechecherAnnonces = catchAsync(async (req, res) => {
  try {
    const { lieu, dateDebut, dateFin } = req.body;

    // Convertir les dates en objets Date
    const startDate = new Date(dateDebut);
    const endDate = new Date(dateFin);

    // Construire la requête de recherche
    const query = {
      statut: "disponible",
      dateDebut: { $lte: startDate },
      dateFin: { $gte: endDate },
    };

    if (lieu) {
      query.lieu = new RegExp(lieu, "i");
    }

    const annonces = await Annonce.find(query)
      .populate("voiture")
      .populate("proprietaire", "nom email");

    res.status(200).json({
      status: "success",
      results: annonces.length,
      data: annonces,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});
// GET /api/annonces?lieu=sousse&prixMin=200&prixMax=500&sieges=4,5&carburant=essence&dateDebut=2025-05-10&dateFin=2025-05-15

// ajouter la logique d'empecher la publication d'une annonce si elle est dans le futur
// ajouter la logique de validation des dates de début et de fin
// ajouter la logique de
