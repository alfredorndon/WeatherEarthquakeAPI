const mongoose = require('mongoose');
const WeatherReport = require('../../src/models/WeatherReport');
const weatherReportService = require('../../src/services/weatherReportService');

describe('weatherReportService', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  });

  afterEach(async () => {
    await WeatherReport.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a weather report', async () => {
    const data = { city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' };
    const report = await weatherReportService.createWeatherReport(data);
    expect(report).toHaveProperty('_id');
    expect(report.city).toBe('Caracas');
  });

  it('should get all weather reports', async () => {
    await weatherReportService.createWeatherReport({ city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' });
    const reports = await weatherReportService.getAllWeatherReports();
    expect(reports.length).toBe(1);
    expect(reports[0].city).toBe('Caracas');
  });

  it('should get weather history by city', async () => {
    await weatherReportService.createWeatherReport({ city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' });
    await weatherReportService.createWeatherReport({ city: 'Maracay', temperature: 28, humidity: 60, condition: 'Nublado' });
    const reports = await weatherReportService.getWeatherHistoryByCity('Caracas');
    expect(reports.length).toBe(1);
    expect(reports[0].city).toBe('Caracas');
  });

  it('should delete a weather report', async () => {
    const report = await weatherReportService.createWeatherReport({ city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' });
    const deleted = await weatherReportService.deleteWeatherReport(report._id);
    expect(deleted).not.toBeNull();
    const found = await WeatherReport.findById(report._id);
    expect(found).toBeNull();
  });
}); 