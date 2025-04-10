import express from "express"
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
dotenv.config({path:'./config.env'});


import { app } from "./app.js";

const port = process.env.PORT || 5001

// Ecoute du serveur 
app.listen(port, ()=>{

    //connexion base de donée
    connectDB();
    console.log(`Le serveur tourne sur le port ${port}`)
     
})