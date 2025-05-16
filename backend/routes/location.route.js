import express from "express";
import {
  creerDemandeLocation,
  listerDemandesProprio,
  listerLocations,
  listerMesReservations,
  mettreAJourStatutLocation,
  traiterDemandeLocation,
} from "../controllers/location.controller.js";
import { proteger, restreindreA } from "../controllers/auth.controller.js";

const router = express.Router();
// router.route('/').post(proteger,restreindreA("locataire"),creerLocation).get(listerLocations)

router.post(
  "/creerReservation",
  proteger,
  restreindreA("locataire"),
  creerDemandeLocation
);

router.get(
  "/mesDemandesDeLocations",
  proteger,
  restreindreA("proprietaire"),
  listerDemandesProprio
);
router.get(
  "/mesReservations",
  proteger,
  restreindreA("locataire"),
  listerMesReservations
);

router.patch(
  "/traiterDemandeLocation/:id",
  proteger,
  restreindreA("proprietaire"),
  traiterDemandeLocation
);


router.patch(
  "/mettreAJourStatutLocation/:id",
  proteger,
  restreindreA("locataire"),
  mettreAJourStatutLocation
);

export default router;
