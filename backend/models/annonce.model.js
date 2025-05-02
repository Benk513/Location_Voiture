import mongoose  from "mongoose";

const annonceSchema = new mongoose.Schema(
  {
    voiture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voiture",
      required: true,
    },
    proprietaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prixJournalier: {
      type: Number,
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
    statut: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Annonce = mongoose.model("Annonce", annonceSchema);
