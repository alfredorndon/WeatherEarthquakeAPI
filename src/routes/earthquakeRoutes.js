const express = require('express');
const router = express.Router();
const EarthquakeReport = require('../models/EarthquakeReport');

// POST para crear un reporte de sismo personalizado
router.post('/', async (req, res) => {
  try {
    const newReport = new EarthquakeReport(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET para obtener todos los reportes de sismos personalizados
router.get('/', async (req, res) => {
  try {
    const reports = await EarthquakeReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Puedes añadir rutas para GET por ID, PUT, DELETE aquí

module.exports = router; 