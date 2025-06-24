const request = require('supertest');
const app = require('../../src/index');

// Mock de los servicios
jest.mock('../../src/services/weatherReportService', () => ({
  createWeatherReport: jest.fn(),
  getAllWeatherReports: jest.fn()
}));

const weatherReportService = require('../../src/services/weatherReportService');

describe('Weather Reports API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new weather report', async () => {
    const mockReport = {
      _id: '123',
      city: 'Caracas',
      temperature: 25,
      humidity: 70,
      condition: 'Soleado'
    };
    
    weatherReportService.createWeatherReport.mockResolvedValue(mockReport);

    const res = await request(app)
      .post('/api/weather/reports')
      .send({
        city: 'Caracas',
        temperature: 25,
        humidity: 70,
        condition: 'Soleado'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockReport);
  });

  it('should fetch all weather reports', async () => {
    const mockReports = [
      {
        _id: '123',
        city: 'Caracas',
        temperature: 25,
        humidity: 70,
        condition: 'Soleado'
      }
    ];
    
    weatherReportService.getAllWeatherReports.mockResolvedValue(mockReports);

    const res = await request(app).get('/api/weather/reports');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockReports);
  });
}); 