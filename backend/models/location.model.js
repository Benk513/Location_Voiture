import mongoose from "mongoose";

const schemaLocation = new mongoose.Schema({
  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voiture",
    required: [true, "Une location doit avoir une voiture selectionnée."],
  },
  locataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",
    required: [true, "Une location doit etre loué a un locataire."],
  },
  proprietaire: {
    type: String,
  },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },

  status: {
    type: String,
    enum: ["en attente", "validée", "payée", "annulée", "en cours", "termine"],
    default: "en attente",
  },

  coutTotal: { type: Number },

  //   "en attente"	Locataire crée la location
  // "validée"	Propriétaire valide
  // "payée"	Paiement validé
  // "annulée"	Par locataire ou propriétaire
  // "en cours"	Dès que la date commence
  // "terminée"

  lieuDepart: { type: String, required: true }, // Lieu de restitution
  lieuRetour: { type: String, required: true }, // Lieu de prise en charge
});

const Location = mongoose.model("Location", schemaLocation);

export default Location;
