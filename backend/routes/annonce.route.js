import express from "express";
import { proteger } from "../controllers/auth.controller";
import {
  creerAnnonce,
  detailAnnonce,
  listerAnnonces,
  mettreAJourAnnonce,
  supprimerAnnonce,
} from "../controllers/annonce.controller";

const router = express.Router();

// CRUD
router.post("/", proteger, creerAnnonce);
router.get("/", listerAnnonces);
router.get("/:id", detailAnnonce);
router.patch("/:id", proteger, mettreAJourAnnonce);
router.delete("/:id", proteger, supprimerAnnonce);

export default router;
