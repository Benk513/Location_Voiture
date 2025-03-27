import mongoose, { model } from "mongoose";
import validator from "validator";
const carSchema = new mongoose.Schema(
  {
    images: {
      type: Array,
      required: [true, "Une voiture doit avoir au moins une image"],
    },

    marque: {
      type: String,
      required: true,
    },

    modele: {
      type: String,
    },

    name: {
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
    prixParJour: {
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
      ref: "User",
      // required: [true, "Une voiture doit appartenir a un Proprietaire"],
    },
    nombreDeSieges: {
      type: Number,
      default: 3,
      required: true,
    },
    avis: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
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

export const Car = mongoose.model("Car", carSchema);
