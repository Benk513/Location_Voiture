import mongoose from "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: { type: String, required: true },
    lieu: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    prixJournalier: { type: Number, required: true },
    voiture: {
      type: mongoose.Schema.ObjectId,
      ref: "Voiture",
      required: true,
    },
    proprietaire: {
      type: mongoose.Schema.ObjectId,
      ref: "Utilisateur",
      required: true,
    },
    status: { type: String, enum: ["actif", "inactif"], default: "actif" },
  },
  { timestamps: true }
);

export const Annonce = mongoose.model("Annonce" ,annonceSchema )