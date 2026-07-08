import express from "express";
import {
    shortenUrl,
    getUrls,
    getDashboard,
    deleteUrl,
    redirectUrl
} from "../controllers/urlcontroller.js";

const router = express.Router();

router.post("/shorten", shortenUrl);

router.get("/dashboard", getDashboard);

router.get("/", getUrls);

router.delete("/:id", deleteUrl);

router.get("/:code", redirectUrl);

export default router;