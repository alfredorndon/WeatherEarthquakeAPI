const weatherReportService = require('../services/weatherReportService');

exports.createReport = async (req, res) => {
    try {
        const report = await weatherReportService.createWeatherReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await weatherReportService.getAllWeatherReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHistoryByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const reports = await weatherReportService.getWeatherHistoryByCity(city);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await weatherReportService.deleteWeatherReport(id);
        if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 