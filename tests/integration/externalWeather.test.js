const request = require('supertest');
const app = require('../../src/index');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

let mockAxios;

beforeEach(() => {
    mockAxios = new MockAdapter(axios);
});

afterEach(() => {
    mockAxios.restore();
});

describe('GET /api/weather - External Weather Data', () => {
    it('should fetch weather data from OpenWeatherMap successfully', async () => {
        const mockOpenWeatherData = {
            name: 'London',
            sys: { country: 'GB' },
            main: { temp: 10.5, feels_like: 9.0, temp_min: 8.0, temp_max: 12.0, humidity: 75, pressure: 1012 },
            wind: { speed: 5.5 },
            weather: [{ description: 'light rain', icon: '10d' }],
            dt: 1678886400
        };
        mockAxios.onGet('https://api.openweathermap.org/data/2.5/weather').reply(200, mockOpenWeatherData);
        const res = await request(app).get('/api/weather?source=openweathermap&city=London');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('source', 'OpenWeatherMap');
        expect(res.body).toHaveProperty('city', 'London');
        expect(res.body).toHaveProperty('temperature', 10.5);
        expect(res.body).toHaveProperty('condition', 'light rain');
    });

    it('should return 404 if city not found in OpenWeatherMap', async () => {
        mockAxios.onGet('https://api.openweathermap.org/data/2.5/weather').reply(404, { cod: '404', message: 'city not found' });
        const res = await request(app).get('/api/weather?source=openweathermap&city=NonExistentCity');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Ciudad no encontrada en la fuente "openweathermap".');
    });

    it('should fetch weather data from WeatherAPI successfully', async () => {
        const mockWeatherApiData = {
            location: { name: 'Paris', country: 'France' },
            current: { temp_c: 18.2, feelslike_c: 17.0, humidity: 60, pressure_mb: 1015, wind_kph: 15.0, condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' }, last_updated_epoch: 1678886400 }
        };
        mockAxios.onGet('http://api.weatherapi.com/v1/current.json').reply(200, mockWeatherApiData);
        const res = await request(app).get('/api/weather?source=weatherapi&city=Paris');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('source', 'WeatherAPI');
        expect(res.body).toHaveProperty('city', 'Paris');
        expect(res.body).toHaveProperty('temperature', 18.2);
        expect(res.body).toHaveProperty('condition', 'Partly cloudy');
    });

    it('should return 400 if source is missing', async () => {
        const res = await request(app).get('/api/weather?city=London');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Fuente climática inválida o faltante. Use "openweathermap" o "weatherapi".');
    });

    it('should return 400 if city is missing', async () => {
        const res = await request(app).get('/api/weather?source=openweathermap');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'El parámetro "city" es requerido.');
    });
});

describe('GET /api/earthquakes - External Earthquake Data', () => {
    it('should fetch earthquake data from USGS successfully', async () => {
        const mockUsgsData = {
            type: "FeatureCollection",
            features: [
                {
                    id: "usgs-123",
                    properties: {
                        mag: 5.5,
                        place: "10km SW of Santiago, Chile",
                        time: 1678886400000,
                        tz: -240,
                        url: "http://example.com/usgs-123"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [-70.6, -33.4, 30]
                    }
                }
            ]
        };
        mockAxios.onGet('https://earthquake.usgs.gov/fdsnws/event/1/query').reply(200, mockUsgsData);
        const res = await request(app).get('/api/earthquakes?source=usgs&minmagnitude=5&country=Chile');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('source', 'USGS');
        expect(res.body[0]).toHaveProperty('magnitude', 5.5);
        expect(res.body[0]).toHaveProperty('location', '10km SW of Santiago, Chile');
        expect(res.body[0]).toHaveProperty('depth', 30);
    });

    it('should return 400 if source is missing for earthquakes', async () => {
        const res = await request(app).get('/api/earthquakes?minmagnitude=5');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Fuente sísmica inválida o faltante. Use "usgs".');
    });
}); 