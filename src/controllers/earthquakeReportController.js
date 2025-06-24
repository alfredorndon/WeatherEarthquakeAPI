const earthquakeReportService = require('../services/earthquakeReportService');

exports.createReport = async (req, res) => {
    try {
        const report = await earthquakeReportService.createEarthquakeReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllReports = async (req, res) => {
    try {
        const reports = await earthquakeReportService.getAllEarthquakeReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHistoryByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const reports = await earthquakeReportService.getEarthquakeHistoryByLocation(location);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await earthquakeReportService.deleteEarthquakeReport(id);
        if (!deletedReport) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 