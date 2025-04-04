import mongoose from "mongoose";
import validator from "validator";

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
      minlength: 8,
      select: false,
    },
    confirmationMotDePasse: {
      type: String,
      required: [true, "Veuillez confirmer votre mot de passe"],
      validate: {
        validator: function (val) {
          return val === this.password;
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

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    estVerifie: {
      type: Boolean,
      default: false,
    },

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
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

export const Utilisateur = mongoose.model("Utilisateur", schemaUtilsateur);
