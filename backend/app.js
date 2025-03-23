import express from "express";

// importer les routes
import { userRouter } from "./routes/userRoutes.js";
import authRouter from "./routes/auth.route.js";
import carRouter from "./routes/car.route.js";

export const app = express();


// to receice data in json format from req body
app.use(express.json());
app.get("/", (req, res) => res.send("Hello world oh  "));


// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cars",carRouter);

app.all("*", (req, res, next) => {
  const error = new Error(
    `impossible de trouver la route :${req.originalUrl} `
  );
  error.statusCode = 404;
  error.status = "fail";
  next(error);
});
