const EarthquakeReport = require('../../src/models/EarthquakeReport');
const earthquakeReportService = require('../../src/services/earthquakeReportService');

// Mock del modelo EarthquakeReport
jest.mock('../../src/models/EarthquakeReport');

describe('earthquakeReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an earthquake report', async () => {
    const mockData = { magnitude: 5.5, depth: 10, location: 'Chile', date: new Date() };
    const mockReport = { _id: '123', ...mockData };
    
    // Mock del constructor y save
    const mockSave = jest.fn().mockResolvedValue(mockReport);
    EarthquakeReport.mockImplementation(() => ({
      save: mockSave
    }));

    const result = await earthquakeReportService.createEarthquakeReport(mockData);
    
    expect(EarthquakeReport).toHaveBeenCalledWith(mockData);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockReport);
  });

  it('should get all earthquake reports with pagination', async () => {
    const mockReports = [
      { _id: '123', magnitude: 5.5, depth: 10, location: 'Chile', date: new Date() }
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
    
    EarthquakeReport.find = mockFind;
    EarthquakeReport.countDocuments = mockCountDocuments;

    const result = await earthquakeReportService.getAllEarthquakeReports({ page: 1, limit: 10 });
    
    expect(mockFind).toHaveBeenCalled();
    expect(mockCountDocuments).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('totalCount');
  });

  it('should get earthquake history by location', async () => {
    const mockReports = [
      { _id: '123', magnitude: 5.5, depth: 10, location: 'Chile', date: new Date() }
    ];
    
    const mockSort = jest.fn().mockResolvedValue(mockReports);
    const mockFind = jest.fn().mockReturnValue({
      sort: mockSort
    });
    
    EarthquakeReport.find = mockFind;
    
    const result = await earthquakeReportService.getEarthquakeHistoryByLocation('Chile');
    
    expect(mockFind).toHaveBeenCalledWith({ location: new RegExp('Chile', 'i') });
    expect(result).toEqual(mockReports);
  });

  it('should delete an earthquake report', async () => {
    const mockDeletedReport = { _id: '123', magnitude: 5.5, location: 'Chile' };
    EarthquakeReport.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedReport);
    
    const result = await earthquakeReportService.deleteEarthquakeReport('123');
    
    expect(EarthquakeReport.findByIdAndDelete).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockDeletedReport);
  });

  it('should update an earthquake report', async () => {
    const mockUpdatedReport = { _id: '123', magnitude: 6.0, depth: 15, location: 'Chile', date: new Date() };
    EarthquakeReport.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedReport);
    
    const updates = { magnitude: 6.0, depth: 15 };
    const result = await earthquakeReportService.updateEarthquakeReport('123', updates);
    
    expect(EarthquakeReport.findByIdAndUpdate).toHaveBeenCalledWith('123', updates, { new: true, runValidators: true });
    expect(result).toEqual(mockUpdatedReport);
  });
}); 