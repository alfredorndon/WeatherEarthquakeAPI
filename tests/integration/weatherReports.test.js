const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');
const WeatherReport = require('../../src/models/WeatherReport');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterEach(async () => {
  await WeatherReport.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Weather Reports API', () => {
  it('should create a new weather report', async () => {
    const res = await request(app)
      .post('/api/weather/reports')
      .send({
        city: 'Caracas',
        temperature: 25,
        humidity: 70,
        condition: 'Soleado'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.city).toEqual('Caracas');
  });

  it('should fetch all weather reports', async () => {
    await new WeatherReport({
      city: 'Caracas', temperature: 25, humidity: 70, condition: 'Soleado'
    }).save();
    const res = await request(app).get('/api/weather/reports');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].city).toEqual('Caracas');
  });
}); 