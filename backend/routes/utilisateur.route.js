import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { listerUtilisateurs } from "../controllers/utilisateur.controller.js";

const router = express.Router();

router.post("/signup", signup);





// CRUD

router.route('/').get(listerUtilisateurs).post(creerUtilisateur)

export default router;
