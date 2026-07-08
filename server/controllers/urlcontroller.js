import Url from "../models/Url.js";
import generateCode from "../utils/generateCode.js";
import validator from "validator";

const MAX_CODE_ATTEMPTS = 10;

function buildShortUrl(req, shortCode) {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

  return `${baseUrl.replace(/\/$/, "")}/${shortCode}`;
}

async function createUrlWithUniqueCode(originalUrl) {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const shortCode = generateCode();

    try {
      return await Url.create({
        originalUrl,
        shortCode,
      });
    } catch (err) {
      if (err?.code === 11000 && err?.keyPattern?.shortCode) {
        continue;
      }

      throw err;
    }
  }

  throw new Error("Unable to generate a unique short code. Please try again.");
}

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const trimmedUrl = typeof originalUrl === "string" ? originalUrl.trim() : "";

    if (!trimmedUrl) {
      return res.status(400).json({
        success: false,
        message: "Please enter a URL to shorten.",
      });
    }

    if (
      !validator.isURL(trimmedUrl, {
        require_protocol: true,
        protocols: ["http", "https"],
      })
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid URL that starts with http:// or https://.",
      });
    }

    const url = await createUrlWithUniqueCode(trimmedUrl);

    res.status(201).json({
      success: true,
      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: buildShortUrl(req, url.shortCode),
        clicks: url.clicks,
        createdAt: url.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create short URL. Please try again.",
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
