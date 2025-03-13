import express from "express";

// importer les routes
import { userRouter } from "./routes/userRoutes.js";
export const app = express();
app.get("/", (req, res) => res.send("Hello world oh  "));

// Routes

app.use("/api/users", userRouter);



app.all("*", (req, res, next) => {
  const error = new Error(
    `impossible de trouver la route :${req.originalUrl} `
  );
  error.statusCode = 404;
  error.status = "fail";
  next(error);
});
