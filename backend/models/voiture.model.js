import mongoose, { model } from "mongoose";
import validator from "validator";
const schemaVoiture = new mongoose.Schema(
  {
    // images: {
    //   type: Array,
    //   required: [true, "Une voiture doit avoir au moins une image"],
    // },
    images: [{ type: String }],

    marque: {
      type: String,
      required: true,
    },

    modele: {
      type: String,
    },

    nom: {
      type: String,
      required: [true, "Une voiture doit avoir un nom"],
      unique: true,
      trim: true,
      maxlength: [40, "Une voiture doit avoir au plus 40 characteres"],
      minlength: [4, "Une voiture doit avoir au moins 40 characteres"],
      // validate: [
      //   validator.isAlphanumeric,
      //   "Une voiture ne doit contenir que des characteres ",
      // ],
    },

    numeroImmatriculation: {
      type: String,
    },
    annee: {
      type: Number,
    },
    kilometrage: {
      type: Number,
      required: [true, "Veuillez inscrire le kilometrage de votrre vehicule"],
    },
    adresse: {
      type: String,
    },
    tarifParJour: {
      type: Number,
      required: [true, "Une voiture doit avoir un tarif journalier"],
    },
    transmission: {
      type: String,
    },
    carburant: {
      type: String,
      enum: ["essence", "gazoile", "electrique"],
      default: "essence",
    },
    estDisponible: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    proprietaire: {
      type: mongoose.Schema.ObjectId,
      ref: "Utilisateur",
      required: [true, "Une voiture doit appartenir a un Proprietaire"],
    },
    nombreDeSieges: {
      type: Number,
      default: 3,
      required: true,
    },
   
    nombreAvis: {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Voiture = mongoose.model("Voiture", schemaVoiture);
