import express from "express";
import {
  connexion,
  deconnexion,
  inscription,
  proteger,
  restreindreA,
} from "../controllers/auth.controller.js";
import {
  creerUtilisateur,
  detailUtilisateur,
  listerUtilisateurs,
  obtenirMonProfil,
  supprimerUtilisateur,
  miseAJourProfile,
  televerserPhotoProfil,
  redimensionerPhotoUtilisateur,
  getStatistiquesProprietaire,
} from "../controllers/utilisateur.controller.js";
import { uploadPhoto } from "../middlewares/uploadPhoto.js";

const router = express.Router();

// inscription 🟦
router.post("/inscription", inscription);
// login 🟦
router.post("/connexion", connexion);

router.post("/deconnexion", deconnexion);
// Gestion de profil utilisateur


router.patch(
  "/miseAJourProfile",
  proteger,
  televerserPhotoProfil,
  redimensionerPhotoUtilisateur,
  miseAJourProfile
);
router.get("/obtenirMonProfil", proteger, obtenirMonProfil);
router.patch("/mettreAjourMonProfil", proteger, uploadPhoto, miseAJourProfile);



router.get("/statistiquesProprietaire", proteger, restreindreA("proprietaire"), getStatistiquesProprietaire);

// administrer les utlisateurs par admin
router
  .route("/")
  .get(proteger, restreindreA("admin", "proprietaire"), listerUtilisateurs)
  .post(proteger, creerUtilisateur);

router
  .route("/:id")
  .get(proteger, detailUtilisateur)
  .delete(proteger, supprimerUtilisateur);

export default router;
