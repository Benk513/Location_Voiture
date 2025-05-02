import express from "express";
import {
  connexion,
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
} from "../controllers/utilisateur.controller.js";

const router = express.Router();

// Authentification
router.post("/inscription", inscription);
router.post("/connexion", connexion);

// Gestion de profil utilisateur

router.patch(
  "/miseAJourProfile",
  proteger,
  televerserPhotoProfil,
  redimensionerPhotoUtilisateur,
  miseAJourProfile
);
router.get("/obtenirMonProfil", proteger, obtenirMonProfil);

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
