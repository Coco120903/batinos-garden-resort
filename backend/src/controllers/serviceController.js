const { asyncHandler } = require("../utils/asyncHandler");
const Service = require("../models/Service");

const listPublicServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true })
    .sort({ category: 1, name: 1 })
    .select("name description category durationMinutes price images options extras isActive createdAt updatedAt");
  res.json({ services });
});

const createService = asyncHandler(async (req, res) => {
  const created = await Service.create(req.body || {});
  res.status(201).json({ service: created });
});

const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Service.findByIdAndUpdate(id, req.body || {}, {
    new: true,
    runValidators: true
  });
  if (!updated) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.json({ service: updated });
});

module.exports = { listPublicServices, createService, updateService };

