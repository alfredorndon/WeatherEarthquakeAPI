const EarthquakeReport = require('../models/EarthquakeReport');

exports.createEarthquakeReport = async (reportData) => {
    const newReport = new EarthquakeReport(reportData);
    return await newReport.save();
};

exports.getAllEarthquakeReports = async (options = {}) => {
    const { page = 1, limit = 10, location, minMagnitude, maxMagnitude, sortBy = 'date', sortOrder = 'desc' } = options;
    
    // Construir filtros
    const filters = {};
    if (location) filters.location = new RegExp(location, 'i');
    if (minMagnitude) filters.magnitude = { $gte: parseFloat(minMagnitude) };
    if (maxMagnitude) {
        if (filters.magnitude) {
            filters.magnitude.$lte = parseFloat(maxMagnitude);
        } else {
            filters.magnitude = { $lte: parseFloat(maxMagnitude) };
        }
    }
    
    // Construir ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calcular skip para paginación
    const skip = (page - 1) * limit;
    
    // Obtener datos con paginación
    const data = await EarthquakeReport.find(filters)
        .sort(sort)
        .limit(limit)
        .skip(skip);
    
    // Obtener conteo total
    const totalCount = await EarthquakeReport.countDocuments(filters);
    
    return {
        data,
        totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        limit: parseInt(limit)
    };
};

exports.getEarthquakeHistoryByLocation = async (location) => {
    return await EarthquakeReport.find({ location: new RegExp(location, 'i') }).sort({ date: -1 });
};

exports.updateEarthquakeReport = async (id, updates) => {
    return await EarthquakeReport.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

exports.deleteEarthquakeReport = async (id) => {
    return await EarthquakeReport.findByIdAndDelete(id);
};
// Puedes añadir más funciones para PUT si es necesario 