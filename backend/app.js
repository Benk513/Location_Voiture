import express from "express";
// importer les routes
import utilisateurRouter from "./routes/utilisateur.route.js";
import voitureRouter from "./routes/voiture.route.js";
import locationRouter from "./routes/location.route.js";
import annonceRouter from "./routes/annonce.route.js";
import morgan from "morgan";
import AppError from "./utils/appError.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser"

// Recréation de __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Autoriser l'origine du frontend
app.use(cors({
  origin: 'http://127.0.0.1:5500', // ton frontend
  credentials: true
}));

// Parser les cookies
app.use(cookieParser());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Permettre le JSON
app.use(express.json());

// Servir les fichiers statiques (images uploadées)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// export const app = express();

// // pour recevoir les données du frontend en json
// app.use(express.json());
// app.use(morgan("dev"));

// const corsOptions = {
//   origin: "http://localhost:3000", // Allow only your frontend origin
//   credentials: true, // Allow credentials (cookies, headers, etc.)
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", "true"); // Add this header

//   if (req.method === "OPTIONS") {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(
//   "/images",
//   cors(corsOptions),
//   express.static(path.join(__dirname, "public/images"))
// );


// Routes
app.use("/api/utilisateurs", utilisateurRouter);

app.use("/api/voitures", voitureRouter);
app.use("/api/locations", locationRouter);
app.use("/api/annonces", annonceRouter);

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
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
