import { Car } from "../models/car.model.js";
import AppError from "../utils/appError.js";

// createVehicle	Ajouter un nouveau véhicule à la plateforme	POST	/api/vehicles
export const createCar = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data) return next(new AppError("no data in body", 400));

    const car = await Car.create(data);
    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: car,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// getVehicleById	Récupérer les détails d'un véhicule spécifique	GET	/api/vehicles/:id
export const getCarById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const car = await Car.findById(id);

    if (!car) return next(new AppError("La voiture n'existe pas", 404));

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      data: car,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
// getAllVehicles	Récupérer la liste de tous les véhicules disponibles	GET	/api/vehicles
export const getAllCars = async (req, res, next) => {
  const cars = await Car.find();

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: cars.length,
    data: {
      cars,
    },
  });
};


// updateVehicle	Modifier les informations d'un véhicule (propriétaire)	PUT	/api/vehicles/:id
// deleteVehicle	Supprimer un véhicule (propriétaire ou admin)	DELETE	/api/vehicles/:id
// searchVehicles	Rechercher des véhicules selon des filtres (ville, modèle, prix, etc.)	GET	/api/vehicles/search
// uploadVehicleImages	Ajouter des images d'un véhicule	POST	/api/vehicles/:id/upload
// getUserVehicles	Récupérer tous les véhicules d'un propriétaire	GET	/api/vehicles/user/:userId
// setVehicleAvailability	Changer l'état de disponibilité d'un véhicule	PUT	/api/vehicles/:id/availability
