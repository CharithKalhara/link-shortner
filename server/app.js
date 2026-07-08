import express from "express";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import { redirectUrl } from "./controllers/urlcontroller.js";
import corsOptions from "./config/corsOptions.js";

const app = express();

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "URL Shortener API Running",
  });
});

app.use("/api", urlRoutes);
app.get("/:code", redirectUrl);

export default app;
