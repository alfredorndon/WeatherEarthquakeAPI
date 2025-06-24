const mongoose = require('mongoose');
const EarthquakeReport = require('../../src/models/EarthquakeReport');
const earthquakeReportService = require('../../src/services/earthquakeReportService');

describe('earthquakeReportService', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  });

  afterEach(async () => {
    await EarthquakeReport.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create an earthquake report', async () => {
    const data = { magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() };
    const report = await earthquakeReportService.createEarthquakeReport(data);
    expect(report).toHaveProperty('_id');
    expect(report.location).toBe('Los Andes');
  });

  it('should get all earthquake reports', async () => {
    await earthquakeReportService.createEarthquakeReport({ magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() });
    const reports = await earthquakeReportService.getAllEarthquakeReports();
    expect(reports.length).toBe(1);
    expect(reports[0].location).toBe('Los Andes');
  });

  it('should get earthquake history by location', async () => {
    await earthquakeReportService.createEarthquakeReport({ magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() });
    await earthquakeReportService.createEarthquakeReport({ magnitude: 4.8, depth: 8, location: 'Caracas', date: new Date() });
    const reports = await earthquakeReportService.getEarthquakeHistoryByLocation('Los Andes');
    expect(reports.length).toBe(1);
    expect(reports[0].location).toBe('Los Andes');
  });

  it('should delete an earthquake report', async () => {
    const report = await earthquakeReportService.createEarthquakeReport({ magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() });
    const deleted = await earthquakeReportService.deleteEarthquakeReport(report._id);
    expect(deleted).not.toBeNull();
    const found = await EarthquakeReport.findById(report._id);
    expect(found).toBeNull();
  });
}); 