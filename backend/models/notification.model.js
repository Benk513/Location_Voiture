import mongoose from "mongoose";

const schemaNotification = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  estLue: {
    type: Boolean,
    default: false,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
  destinataire: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    required: true,
  },
});

const Notification = mongoose.model("Notification", schemaNotification);

export default Notification;
