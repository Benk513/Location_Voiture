import mongoose from "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    voiture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voiture",
      required: true,
    },
    proprietaire: {
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
    lieu: {
      type: String,
    },

    statut: {
      type: String,
      enum: ["reserve", "disponible"],
      default: "disponible",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Annonce = mongoose.model("Annonce", annonceSchema);
