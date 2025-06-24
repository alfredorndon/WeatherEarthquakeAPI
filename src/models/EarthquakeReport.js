const mongoose = require('mongoose');

const earthquakeReportSchema = new mongoose.Schema({
  magnitude: { type: Number, required: true },
  depth: { type: Number, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true }
  // Podrías añadir un campo para el usuario que lo reportó si ya tienes autenticación
});

module.exports = mongoose.model('EarthquakeReport', earthquakeReportSchema); 