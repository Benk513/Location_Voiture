import mongoose from "mongoose";

const schemaRevue = new mongoose.Schema({
  commentaire: {
    type: String,
    trim: true,
  },
  avis: {
    type: Number,
    min: [1, "l'avis doit etre au minimum 1"],
    max: [5, "l'avis doit etre au maximum 5"],
  },
  dateCreation: {
    type: Date,
    default: Date.now(),
  },
  dateMiseAJour: {
    type: Date,
  },
  proprietaire: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    required: [
      true,
      "La Revue doit etre fait sur les services du proprietaire",
    ],
  },
  locataire: {
    type: mongoose.Schema.ObjectId,
    ref: "Utilisateur",
    required: [true, "La Revue doit avoir un auteur"],
  },
});

const Revue = mongoose.model('Revue',schemaRevue)
export default Revue