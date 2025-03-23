import express from "express";
import { createCar, getAllCars, getCarById } from "../controllers/car.controller.js"


const router = express.Router()

router.get('/' , getAllCars)
router.post('/' , createCar)

router.get('/:id' , getCarById)

export default router;