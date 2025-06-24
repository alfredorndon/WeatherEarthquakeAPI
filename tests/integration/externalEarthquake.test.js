const request = require('supertest');
const app = require('../../src/index');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

let mockAxios;

describe('GET /api/earthquakes - USGS Integration', () => {
    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it('should fetch earthquake data from USGS successfully', async () => {
        const mockUsgsData = {
            type: "FeatureCollection",
            features: [
                {
                    id: "usgs-123",
                    properties: {
                        mag: 6.1,
                        place: "50km NW of Lima, Peru",
                        time: 1678886400000,
                        tz: -300,
                        url: "http://example.com/usgs-123"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [-77.1, -11.9, 40]
                    }
                }
            ]
        };
        mockAxios.onGet('https://earthquake.usgs.gov/fdsnws/event/1/query').reply(200, mockUsgsData);
        const res = await request(app).get('/api/earthquakes?source=usgs&minmagnitude=6&country=Peru');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('source', 'USGS');
        expect(res.body[0]).toHaveProperty('magnitude', 6.1);
        expect(res.body[0]).toHaveProperty('location', '50km NW of Lima, Peru');
        expect(res.body[0]).toHaveProperty('depth', 40);
    });

    it('should filter by country after fetching from USGS', async () => {
        const mockUsgsData = {
            type: "FeatureCollection",
            features: [
                {
                    id: "usgs-1",
                    properties: {
                        mag: 5.0,
                        place: "10km SW of Santiago, Chile",
                        time: 1678886400000,
                        tz: -240,
                        url: "http://example.com/usgs-1"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [-70.6, -33.4, 30]
                    }
                },
                {
                    id: "usgs-2",
                    properties: {
                        mag: 4.8,
                        place: "20km E of Quito, Ecuador",
                        time: 1678886400000,
                        tz: -300,
                        url: "http://example.com/usgs-2"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [-78.5, -0.2, 20]
                    }
                }
            ]
        };
        mockAxios.onGet('https://earthquake.usgs.gov/fdsnws/event/1/query').reply(200, mockUsgsData);
        const res = await request(app).get('/api/earthquakes?source=usgs&country=Chile');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].location).toContain('Chile');
    });

    it('should return 400 if source is missing', async () => {
        const res = await request(app).get('/api/earthquakes?minmagnitude=5');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Fuente sísmica inválida o faltante. Use "usgs".');
    });

    it('should return 502 if USGS API returns error', async () => {
        mockAxios.onGet('https://earthquake.usgs.gov/fdsnws/event/1/query').reply(500, { message: 'Internal Server Error' });
        const res = await request(app).get('/api/earthquakes?source=usgs');
        expect(res.statusCode).toEqual(502);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Error de la API externa');
    });

    it('should return 504 if USGS API does not respond', async () => {
        mockAxios.onGet('https://earthquake.usgs.gov/fdsnws/event/1/query').networkError();
        const res = await request(app).get('/api/earthquakes?source=usgs');
        expect(res.statusCode).toEqual(504);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Tiempo de espera excedido');
    });
}); 