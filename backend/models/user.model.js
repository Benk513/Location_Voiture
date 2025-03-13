import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
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

    password: {
      type: String,
      required: [true, "Veuillez inserer un mot de passe"],
      minlength: 8,
    },
    phone: {
      type: String,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["locataire", "proprietaire", "admin"],
      default: "locataire",
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isverified: {
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

export const User = mongoose.model("User", userSchema);
