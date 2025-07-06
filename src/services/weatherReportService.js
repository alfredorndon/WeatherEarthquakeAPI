const WeatherReport = require('../models/WeatherReport');

exports.createWeatherReport = async (reportData) => {
    const newReport = new WeatherReport(reportData);
    return await newReport.save();
};

exports.getAllWeatherReports = async (options = {}) => {
    const { page = 1, limit = 10, city, condition, sortBy = 'date', sortOrder = 'desc' } = options;
    
    // Construir filtros
    const filters = {};
    if (city) filters.city = new RegExp(city, 'i');
    if (condition) filters.condition = new RegExp(condition, 'i');
    
    // Construir ordenamiento
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calcular skip para paginación
    const skip = (page - 1) * limit;
    
    // Obtener datos con paginación
    const data = await WeatherReport.find(filters)
        .sort(sort)
        .limit(limit)
        .skip(skip);
    
    // Obtener conteo total
    const totalCount = await WeatherReport.countDocuments(filters);
    
    return {
        data,
        totalCount,
        page: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        limit: parseInt(limit)
    };
};

exports.getWeatherHistoryByCity = async (city) => {
    return await WeatherReport.find({ city: new RegExp(city, 'i') }).sort({ date: -1 });
};

exports.updateWeatherReport = async (id, updates) => {
    return await WeatherReport.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

exports.deleteWeatherReport = async (id) => {
    return await WeatherReport.findByIdAndDelete(id);
};
// Puedes añadir más funciones para PUT si es necesario 