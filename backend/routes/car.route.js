import express from "express";
import { createCar, deleteCarById, getAllCars, getCarById } from "../controllers/car.controller.js"


const router = express.Router()

router.get('/' , getAllCars)
router.post('/' , createCar)

router.get('/:id' , getCarById)
router.delete('/:id' , deleteCarById)

export default router;