import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import urlRoutes from "./routes/urlRoutes.js";
import corsOptions from "./config/corsOptions.js";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(console.error);

app.use("/api", urlRoutes);
app.use("/", urlRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on ${PORT}`)
  );
}

export default app;
