import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    annonce: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Annonce",
      required: true,
    },
    locataire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur",
      required: true,
    },
    dateDebut: {
      type: Date,
      required: true,
    },
    dateFin: {
      type: Date,
      required: true,
    },
    adresseRetrait: {
      type: String,
      required: true,
    },
    adresseDepot: {
      type: String,
      required: true,
    },
    statut: {
      type: String,
      enum: ["en_attente", "acceptee", "refusee", "terminee", "annulee"],
      default: "en_attente",
    },
    montantTotal: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Location", locationSchema);
