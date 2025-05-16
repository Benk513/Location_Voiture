import express from "express";
import { proteger, restreindreA } from "../controllers/auth.controller.js";
import {
  creerAnnonce,
  detailAnnonce,
  listerAnnonces,
  listerAnnoncesProprio,
  listerRecentAnnonces,
  mettreAJourAnnonce,
  rechecherAnnonces,
  supprimerAnnonce,
} from "../controllers/annonce.controller.js";

const router = express.Router();

// CRUD
router.post("/rechercherAnnonces", rechecherAnnonces);
router.post("/", proteger, restreindreA("proprietaire"), creerAnnonce);
router.get("/", listerAnnonces);
router.get(
  "/listerMesAnnonces",
  proteger,
  restreindreA("proprietaire"),
  listerAnnoncesProprio
);



router.get("/recentes", listerRecentAnnonces);
router.get("/:id", detailAnnonce);
router.patch(
  "/:id",
  proteger,
  restreindreA("proprietaire"),
  mettreAJourAnnonce
);
router.delete(
  "/:id",
  proteger,
  restreindreA("proprietaire", "admin"),
  supprimerAnnonce
);

export default router;
