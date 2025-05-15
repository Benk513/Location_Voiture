import express from "express";
import {
  creerDemandeLocation,
  listerDemandesProprio,
  listerLocations,
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

router.patch(
  "/traiterDemandeLocation/:id",
  proteger,
  restreindreA("proprietaire"),
  traiterDemandeLocation
);
export default router;
