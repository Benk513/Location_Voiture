import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const schemaUtilsateur = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "default.jpg",
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Inserez une adresse mail valide svp!"],
    },

    motDePasse: {
      type: String,
      required: [true, "Veuillez inserer un mot de passe"],
      minlength:[6,"le mot de passe doit contenir au minimum 6 characteres"],
      
    },
    confirmationMotDePasse: {
      type: String,
      required: [true, "Veuillez confirmer votre mot de passe"],
      validate: {
        validator: function (val) {
          return val === this.motDePasse;
        },
        message: "Les Mots de passe ne correspondent pas!",
      },
    },
    telephone: {
      type: String,
      validate: [validator.isNumeric, "Only number allowed"],
    },

    nom: {
      type: String,
      trim: true,
      required: [true, "Veuillez inserez votre nom"],
    },
    role: {
      type: String,
      enum: ["locataire", "proprietaire", "admin"],
      default: "locataire",
    },
    biographie: {
      type: String,
      default: "-",
    },
    adresse:{
      type:String
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    estVerifie: {
      type: Boolean,
      default: false,
    },
    motDePasseChangeLe: { type: String },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationTOken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

// ********* MIDDLEWARE to rnu b4 save ********* //

schemaUtilsateur.pre("save", async function (next) {
  //execute si et seulement si le mot de passe a ete modifié
  if (!this.isModified("motDePasse")) return next();

  //crypte le mot de passe
  this.motDePasse = await bcrypt.hash(this.motDePasse, 12);
  // supprime le champ confirmation de mot de passe
  this.confirmationMotDePasse = undefined;
});
 
schemaUtilsateur.methods.correctMotDePasse = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

schemaUtilsateur.methods.motDePasseChangeApres = function (JWTTimestamp) {
  if (this.motDePasseChangeLe) {
    const passwordChangedTimestamp = parseInt(
      this.motDePasseChangeLe.getTime() / 1000,
      10
    );

    return JWTTimestamp < passwordChangedTimestamp;
  }
  return false;
};
export const Utilisateur = mongoose.model("Utilisateur", schemaUtilsateur);
