const request = require('supertest');
const app = require('../../src/index');

// Mock de los servicios
jest.mock('../../src/services/earthquakeReportService', () => ({
  createEarthquakeReport: jest.fn(),
  getAllEarthquakeReports: jest.fn()
}));

const earthquakeReportService = require('../../src/services/earthquakeReportService');

jest.mock('../../src/middleware/authMiddleware', () => ({
  protect: (req, res, next) => next()
}));

describe('Earthquake Reports API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new earthquake report', async () => {
    const mockReport = {
      _id: '123',
      magnitude: 5.2,
      depth: 10,
      location: 'Los Andes',
      date: new Date().toISOString()
    };
    
    earthquakeReportService.createEarthquakeReport.mockResolvedValue(mockReport);

    const res = await request(app)
      .post('/api/earthquakes/reports')
      .send({
        magnitude: 5.2,
        depth: 10,
        location: 'Los Andes',
        date: new Date().toISOString()
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockReport);
  });

  it('should fetch all earthquake reports', async () => {
    const mockReports = [
      {
        _id: '123',
        magnitude: 5.2,
        depth: 10,
        location: 'Los Andes',
        date: new Date().toISOString()
      }
    ];
    
    earthquakeReportService.getAllEarthquakeReports.mockResolvedValue(mockReports);

    const res = await request(app).get('/api/earthquakes/reports');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockReports);
  });
}); 