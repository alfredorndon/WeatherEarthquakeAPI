const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');
const EarthquakeReport = require('../../src/models/EarthquakeReport');

describe('Earthquake Reports API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  });

  afterEach(async () => {
    await EarthquakeReport.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new earthquake report', async () => {
    const res = await request(app)
      .post('/api/earthquakes')
      .send({
        magnitude: 5.2,
        depth: 10,
        location: 'Los Andes',
        date: new Date().toISOString()
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.location).toEqual('Los Andes');
  });

  it('should fetch all earthquake reports', async () => {
    await new EarthquakeReport({
      magnitude: 5.2, depth: 10, location: 'Los Andes', date: new Date()
    }).save();
    const res = await request(app).get('/api/earthquakes');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].location).toEqual('Los Andes');
  });
}); 