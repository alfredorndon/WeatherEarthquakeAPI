const WeatherReport = require('../models/WeatherReport');

exports.createWeatherReport = async (reportData) => {
    const newReport = new WeatherReport(reportData);
    return await newReport.save();
};

exports.getAllWeatherReports = async () => {
    return await WeatherReport.find();
};

exports.getWeatherHistoryByCity = async (city) => {
    return await WeatherReport.find({ city: new RegExp(city, 'i') }).sort({ date: -1 });
};

exports.deleteWeatherReport = async (id) => {
    return await WeatherReport.findByIdAndDelete(id);
};
// Puedes añadir más funciones para PUT si es necesario 