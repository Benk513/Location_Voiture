import express from "express";
import {
  ajouterVoiture,
  detailVoiture,
  listerVoitures,
  modifierVoiture,
  supprimerVoiture,
} from "./../controllers/voiture.controller.js";
import { proteger, restreindreA } from "../controllers/auth.controller.js";

const router = express.Router();

// router.get("/", listerVoitures);
// router.post("/", ajouterVoiture);

router.route("/").get(listerVoitures).post(ajouterVoiture);

router
  .route("/:id")
  .get(detailVoiture)
  .patch(proteger, restreindreA("proprietaire"), modifierVoiture)
  .delete(supprimerVoiture);

export default router;
