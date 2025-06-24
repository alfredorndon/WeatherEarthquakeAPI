const EarthquakeReport = require('../models/EarthquakeReport');

exports.createEarthquakeReport = async (reportData) => {
    const newReport = new EarthquakeReport(reportData);
    return await newReport.save();
};

exports.getAllEarthquakeReports = async () => {
    return await EarthquakeReport.find();
};

exports.getEarthquakeHistoryByLocation = async (location) => {
    return await EarthquakeReport.find({ location: new RegExp(location, 'i') }).sort({ date: -1 });
};

exports.deleteEarthquakeReport = async (id) => {
    return await EarthquakeReport.findByIdAndDelete(id);
};
// Puedes añadir más funciones para PUT si es necesario 