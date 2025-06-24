const express = require('express');
const router = express.Router();
const WeatherReport = require('../models/WeatherReport');

// POST para crear un reporte de clima personalizado
router.post('/', async (req, res) => {
  try {
    const newReport = new WeatherReport(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET para obtener todos los reportes de clima personalizados
router.get('/', async (req, res) => {
  try {
    const reports = await WeatherReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Puedes añadir rutas para GET por ID, PUT, DELETE aquí

module.exports = router; 