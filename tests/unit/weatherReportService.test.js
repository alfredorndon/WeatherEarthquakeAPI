const WeatherReport = require('../../src/models/WeatherReport');
const weatherReportService = require('../../src/services/weatherReportService');

describe('weatherReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a weather report', async () => {
    const mockData = { city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' };
    const mockReport = { _id: '123', ...mockData };
    jest.spyOn(WeatherReport.prototype, 'save').mockResolvedValue(mockReport);
    const result = await weatherReportService.createWeatherReport(mockData);
    expect(result).toEqual(mockReport);
  });

  it('should get all weather reports', async () => {
    const mockReports = [
      { _id: '123', city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' }
    ];
    WeatherReport.find = jest.fn().mockResolvedValue(mockReports);
    const result = await weatherReportService.getAllWeatherReports();
    expect(result).toEqual(mockReports);
    expect(WeatherReport.find).toHaveBeenCalled();
  });

  it('should get weather history by city', async () => {
    const mockReports = [
      { _id: '123', city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado' }
    ];
    const sortMock = jest.fn().mockResolvedValue(mockReports);
    WeatherReport.find = jest.fn().mockReturnValue({ sort: sortMock });
    const result = await weatherReportService.getWeatherHistoryByCity('Caracas');
    expect(result).toEqual(mockReports);
    expect(WeatherReport.find).toHaveBeenCalledWith({ city: new RegExp('Caracas', 'i') });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
  });

  it('should delete a weather report', async () => {
    const mockDeletedReport = { _id: '123', city: 'Caracas' };
    WeatherReport.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedReport);
    const result = await weatherReportService.deleteWeatherReport('123');
    expect(result).toEqual(mockDeletedReport);
    expect(WeatherReport.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
}); 