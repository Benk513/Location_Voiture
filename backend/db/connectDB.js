import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DB = process.env.MONGO_URI.replace(
      "<password>",
      process.env.MONGO_PASSWORD
    );
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB connectée :${conn.connection.host}`);
  } catch (error) {
    console.log("Erreur de connexion a MongoDB :", error.message);
    process.exit(1); // arret avec echec

    console.log(error);
  }
};
