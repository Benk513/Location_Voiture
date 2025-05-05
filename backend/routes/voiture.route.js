import express from "express";
import {
  ajouterVoiture,
  detailVoiture,
  listerMesVoitures,
  listerVoitures,
  modifierVoiture,
  supprimerVoiture,
  televerserPhotosVoiture,
} from "./../controllers/voiture.controller.js";
import { proteger, restreindreA } from "../controllers/auth.controller.js";

const router = express.Router();

// router.get("/", listerVoitures);
// router.post("/", ajouterVoiture);

// router.route("/").get(listerVoitures).post(ajouterVoiture);

router.post(
  "/",
  proteger,
  televerserPhotosVoiture,
  restreindreA("proprietaire"),
  ajouterVoiture
);

router.get("/", proteger, listerVoitures);
router.get(
  "/mesVoitures",
  proteger,
  restreindreA("proprietaire"),
  listerMesVoitures
);

router
  .route("/:id")
  .get(proteger, detailVoiture)
  .patch(proteger, restreindreA("proprietaire"), modifierVoiture)
  .delete(proteger, supprimerVoiture);

export default router;
