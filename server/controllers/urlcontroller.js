import Url from "../models/Url.js";
import generateCode from "../utils/generateCode.js";
import validator from "validator";

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate URL
    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({
        message: "Invalid URL",
      });
    }

    const shortCode = generateCode();

    const url = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json(url);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getUrls = async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });

    res.json(urls);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const urls = await Url.find().sort({ clicks: -1, createdAt: -1 });
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

    res.json({
      totalUrls,
      totalClicks,
      averageClicks: totalUrls ? Math.round(totalClicks / totalUrls) : 0,
      mostPopular: urls[0]?.shortCode || null,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const deletedUrl = await Url.findByIdAndDelete(req.params.id);

    if (!deletedUrl) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    return res.json({
      message: "URL deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.code,
    });

    if (!url) {
      return res.status(404).send("URL not found");
    }

    url.clicks++;

    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};  
