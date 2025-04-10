import express from "express";

// importer les routes
import utilisateurRouter from "./routes/utilisateur.route.js";
import voitureRouter from "./routes/voiture.route.js";
import locationRouter from "./routes/location.route.js"
import morgan from "morgan";
import AppError from "./utils/appError.js";
export const app = express();

// pour recevoir les données du frontend en json
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/utilisateurs", utilisateurRouter);

app.use("/api/voitures", voitureRouter);
app.use("/api/locations", locationRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Impossible de trouver la route ${req.originalUrl} sur ce serveur!`,
      404
    )
  );
});

 

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err)
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
