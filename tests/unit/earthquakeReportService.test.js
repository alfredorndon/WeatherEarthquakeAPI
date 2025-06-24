const EarthquakeReport = require('../../src/models/EarthquakeReport');
const earthquakeReportService = require('../../src/services/earthquakeReportService');

describe('earthquakeReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an earthquake report', async () => {
    const mockData = { magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() };
    const mockReport = { _id: '123', ...mockData };
    jest.spyOn(EarthquakeReport.prototype, 'save').mockResolvedValue(mockReport);
    const result = await earthquakeReportService.createEarthquakeReport(mockData);
    expect(result).toEqual(mockReport);
  });

  it('should get all earthquake reports', async () => {
    const mockReports = [
      { _id: '123', magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() }
    ];
    EarthquakeReport.find = jest.fn().mockResolvedValue(mockReports);
    const result = await earthquakeReportService.getAllEarthquakeReports();
    expect(result).toEqual(mockReports);
    expect(EarthquakeReport.find).toHaveBeenCalled();
  });

  it('should get earthquake history by location', async () => {
    const mockReports = [
      { _id: '123', magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date() }
    ];
    const sortMock = jest.fn().mockResolvedValue(mockReports);
    EarthquakeReport.find = jest.fn().mockReturnValue({ sort: sortMock });
    const result = await earthquakeReportService.getEarthquakeHistoryByLocation('Los Andes');
    expect(result).toEqual(mockReports);
    expect(EarthquakeReport.find).toHaveBeenCalledWith({ location: new RegExp('Los Andes', 'i') });
    expect(sortMock).toHaveBeenCalledWith({ date: -1 });
  });

  it('should delete an earthquake report', async () => {
    const mockDeletedReport = { _id: '123', location: 'Los Andes' };
    EarthquakeReport.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedReport);
    const result = await earthquakeReportService.deleteEarthquakeReport('123');
    expect(result).toEqual(mockDeletedReport);
    expect(EarthquakeReport.findByIdAndDelete).toHaveBeenCalledWith('123');
  });
}); 