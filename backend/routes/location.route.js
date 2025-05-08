import express from "express";
import { creerDemandeLocation, listerLocations } from "../controllers/location.controller.js";
import { proteger, restreindreA } from "../controllers/auth.controller.js";

const router = express.Router();
// router.route('/').post(proteger,restreindreA("locataire"),creerLocation).get(listerLocations)


router.post('/creerReservation',proteger,restreindreA('locataire'),creerDemandeLocation)
export default router;
