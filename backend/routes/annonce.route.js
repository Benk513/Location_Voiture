import express from "express";
import { proteger, restreindreA } from "../controllers/auth.controller.js";
import {
  creerAnnonce,
  detailAnnonce,
  listerAnnonces,
  mettreAJourAnnonce, 
  supprimerAnnonce,
} from "../controllers/annonce.controller.js";

const router = express.Router(); 

// CRUD
router.post("/", proteger, restreindreA("proprietaire"), creerAnnonce);
router.get("/", proteger,listerAnnonces);
router.get("/:id", detailAnnonce);
router.patch("/:id", proteger,restreindreA("proprietaire"), mettreAJourAnnonce);
router.delete("/:id", proteger,restreindreA("proprietaire", "admin"), supprimerAnnonce);

export default router;
