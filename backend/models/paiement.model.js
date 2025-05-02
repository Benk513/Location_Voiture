import mongoose from "mongoose";

const schemaPaiement = new mongoose.Schema({
  montant: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "en attente",
  },

  methodeDePaiement: {
    type: String,
    enum: ["stripe", "paypal", "mobile money"],
    default: "stripe",
  },
  transactionId: {
    type: String,
  },
  datePaiement: { type: Date },
  location: {
    type: mongoose.Schema.ObjectId,
    ref: "Location",
    required: true,
  },
  utilisateur: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
});

const Paiement = mongoose.model("");
