const SiteSettings = require("../models/SiteSettings");
const { asyncHandler } = require("../utils/asyncHandler");

async function getOrCreateDefault() {
  let doc = await SiteSettings.findOne({ key: "default" });
  if (!doc) {
    doc = await SiteSettings.create({
      key: "default",
      system: { isBookingOpen: true, maintenanceMessage: "We are currently updating our system. Please try again later." },
      brand: { logoText: "Batino's Garden Farm Resort", tagline: "Private pool resort & event place" },
      home: { 
        heroImages: [], 
        highlightsImages: [], 
        spacesMoments: [], 
        recentEvents: [],
        villa1Images: [],
        villa2Images: [],
        villa3Images: []
      }
    });
  }
  return doc;
}

const publicGetSiteSettings = asyncHandler(async (req, res) => {
  const doc = await getOrCreateDefault();
  res.json({
    system: doc.system,
    brand: doc.brand,
    home: doc.home
  });
});

const adminGetSiteSettings = asyncHandler(async (req, res) => {
  const doc = await getOrCreateDefault();
  res.json(doc);
});

const adminUpdateSiteSettings = asyncHandler(async (req, res) => {
  const { brand, home, system } = req.body || {};
  const doc = await getOrCreateDefault();

  if (system && typeof system === "object") {
    doc.system = {
      isBookingOpen: typeof system.isBookingOpen === "boolean" ? system.isBookingOpen : doc.system?.isBookingOpen ?? true,
      maintenanceMessage:
        typeof system.maintenanceMessage === "string"
          ? system.maintenanceMessage
          : doc.system?.maintenanceMessage || ""
    };
  }

  if (brand && typeof brand === "object") {
    doc.brand = {
      logoText: brand.logoText ?? doc.brand.logoText,
      tagline: brand.tagline ?? doc.brand.tagline
    };
  }

  if (home && typeof home === "object") {
    doc.home = {
      heroImages: Array.isArray(home.heroImages) ? home.heroImages : (doc.home?.heroImages || []),
      highlightsImages: Array.isArray(home.highlightsImages) ? home.highlightsImages : (doc.home?.highlightsImages || []),
      spacesMoments: Array.isArray(home.spacesMoments) ? home.spacesMoments : (doc.home?.spacesMoments || []),
      recentEvents: Array.isArray(home.recentEvents) ? home.recentEvents : (doc.home?.recentEvents || []),
      villa1Images: Array.isArray(home.villa1Images) ? home.villa1Images : (doc.home?.villa1Images || []),
      villa2Images: Array.isArray(home.villa2Images) ? home.villa2Images : (doc.home?.villa2Images || []),
      villa3Images: Array.isArray(home.villa3Images) ? home.villa3Images : (doc.home?.villa3Images || [])
    };
  }

  await doc.save();
  res.json(doc);
});

module.exports = { publicGetSiteSettings, adminGetSiteSettings, adminUpdateSiteSettings };

