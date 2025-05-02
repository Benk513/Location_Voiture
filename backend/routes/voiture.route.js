import express from "express";
import {
  ajouterVoiture,
  detailVoiture,
  listerVoitures,
  modifierVoiture,
  supprimerVoiture,
  televerserPhotoVoiture,
} from "./../controllers/voiture.controller.js";
import { proteger, restreindreA } from "../controllers/auth.controller.js";

const router = express.Router();

// router.get("/", listerVoitures);
// router.post("/", ajouterVoiture);

// router.route("/").get(listerVoitures).post(ajouterVoiture);

router.post("/", proteger,  televerserPhotoVoiture, ajouterVoiture);
router.get("/", proteger, listerVoitures);

router
  .route("/:id")
  .get(proteger, detailVoiture)
  .patch(proteger, restreindreA("proprietaire"), modifierVoiture)
  .delete(proteger, supprimerVoiture);

export default router;
