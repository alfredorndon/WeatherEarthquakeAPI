const WeatherReport = require('../../src/models/WeatherReport');
const weatherReportService = require('../../src/services/weatherReportService');

// Mock del modelo WeatherReport
jest.mock('../../src/models/WeatherReport');

describe('weatherReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a weather report', async () => {
    const mockData = { city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' };
    const mockReport = { _id: '123', ...mockData };
    
    // Mock del constructor y save
    const mockSave = jest.fn().mockResolvedValue(mockReport);
    WeatherReport.mockImplementation(() => ({
      save: mockSave
    }));

    const result = await weatherReportService.createWeatherReport(mockData);
    
    expect(WeatherReport).toHaveBeenCalledWith(mockData);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockReport);
  });

  it('should get all weather reports with pagination', async () => {
    const mockReports = [
      { _id: '123', city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' }
    ];
    
    // Mock de la cadena de métodos de Mongoose
    const mockSort = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        skip: jest.fn().mockResolvedValue(mockReports)
      })
    });
    
    const mockFind = jest.fn().mockReturnValue({
      sort: mockSort
    });
    
    const mockCountDocuments = jest.fn().mockResolvedValue(1);
    
    WeatherReport.find = mockFind;
    WeatherReport.countDocuments = mockCountDocuments;

    const result = await weatherReportService.getAllWeatherReports({ page: 1, limit: 10 });
    
    expect(mockFind).toHaveBeenCalled();
    expect(mockCountDocuments).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('totalCount');
  });

  it('should get weather history by city', async () => {
    const mockReports = [
      { _id: '123', city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' }
    ];
    
    const mockSort = jest.fn().mockResolvedValue(mockReports);
    const mockFind = jest.fn().mockReturnValue({
      sort: mockSort
    });
    
    WeatherReport.find = mockFind;
    
    const result = await weatherReportService.getWeatherHistoryByCity('Caracas');
    
    expect(mockFind).toHaveBeenCalledWith({ city: new RegExp('Caracas', 'i') });
    expect(result).toEqual(mockReports);
  });

  it('should delete a weather report', async () => {
    const mockDeletedReport = { _id: '123', city: 'Caracas' };
    WeatherReport.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedReport);
    
    const result = await weatherReportService.deleteWeatherReport('123');
    
    expect(WeatherReport.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockDeletedReport);
  });

  it('should update a weather report', async () => {
    const mockUpdatedReport = { _id: '123', city: 'Caracas', temperature: 30, humidity: 70, condition: 'Soleado' };
    WeatherReport.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedReport);
    
    const updates = { temperature: 30 };
    const result = await weatherReportService.updateWeatherReport('123', updates);
    
    expect(WeatherReport.findByIdAndUpdate).toHaveBeenCalledWith('123', updates, { new: true, runValidators: true });
    expect(result).toEqual(mockUpdatedReport);
  });
}); 