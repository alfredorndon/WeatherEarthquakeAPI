const mongoose = require('mongoose');

const weatherReportSchema = new mongoose.Schema({
  city: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  condition: { type: String, enum: ['Soleado', 'Nublado', 'Lluvioso', 'Tormenta'], required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('WeatherReport', weatherReportSchema); 