
const express = require("express");
const router = express.Router();

const simulationController = require("../controllers/simulationController");

// Home
router.get("/", simulationController.home);

// Form simulasi
router.get("/form", simulationController.form);

// Proses simulasi
router.post("/simulate", simulationController.calculate);

// Riwayat
router.get("/history", simulationController.history);

module.exports = router;
