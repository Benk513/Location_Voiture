import express from "express";
import {
  ajouterVoiture,
  detailVoiture,
  listerVoitures,
  supprimerVoiture,
} from "./../controllers/voiture.controller.js";

const router = express.Router();

// router.get("/", listerVoitures);
// router.post("/", ajouterVoiture);

router.route('/').get(listerVoitures).post(ajouterVoiture)

router
.route("/:id")
.get(detailVoiture)
.delete(supprimerVoiture)

export default router;
