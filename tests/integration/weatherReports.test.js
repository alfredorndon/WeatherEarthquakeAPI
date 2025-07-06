const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');
const WeatherReport = require('../../src/models/WeatherReport');
const User = require('../../src/models/User');

let authToken;

beforeAll(async () => {
    // Conecta a la base de datos de prueba
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/weather_earthquake_test';
    await mongoose.connect(mongoUri);

    // Registra un usuario de prueba y obtén el token de autenticación
    await User.deleteMany({}); // Limpia usuarios antes de registrar
    const user = { email: 'test_auth_user@example.com', password: 'password123' };
    const res = await request(app).post('/api/auth/register').send(user);
    authToken = res.body.token;
});

afterEach(async () => {
    // Limpia los reportes de clima después de cada prueba
    await WeatherReport.deleteMany({});
});

afterAll(async () => {
    // Limpia usuarios y desconecta la DB
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Weather Reports API - Protected Routes', () => {

    it('should create a new weather report (protected)', async () => {
        const newReport = {
            city: "Quito",
            temperature: 20,
            humidity: 60,
            condition: "Nublado",
            date: "2024-07-01T10:00:00Z"
        };
        const res = await request(app)
            .post('/api/weather/reports')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newReport);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('city', 'Quito');
    });

    // --- Pruebas de Actualización (PUT) ---
    it('should update an existing weather report', async () => {
        const createdReport = await WeatherReport.create({
            city: "Medellin",
            temperature: 22,
            humidity: 80,
            condition: "Lluvioso",
            date: "2024-06-30T15:00:00Z"
        });

        const updates = {
            temperature: 25,
            condition: "Soleado"
        };

        const res = await request(app)
            .put(`/api/weather/reports/${createdReport._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updates);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('temperature', 25);
        expect(res.body).toHaveProperty('condition', 'Soleado');
        expect(res.body).toHaveProperty('city', 'Medellin'); // El campo no actualizado debe permanecer igual
    });

    it('should return 404 if report to update is not found', async () => {
        const updates = { temperature: 30 };
        const nonExistentId = new mongoose.Types.ObjectId(); // ID que no existe

        const res = await request(app)
            .put(`/api/weather/reports/${nonExistentId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updates);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Reporte climático no encontrado.');
    });

    // --- Pruebas de Paginación, Filtrado y Ordenamiento ---
    it('should get all weather reports with pagination (limit 2, page 1)', async () => {
        await WeatherReport.insertMany([
            { city: "Caracas", temperature: 25, humidity: 70, condition: "Soleado", date: "2024-01-01T10:00:00Z" },
            { city: "Bogota", temperature: 18, humidity: 75, condition: "Nublado", date: "2024-01-02T10:00:00Z" },
            { city: "Lima", temperature: 20, humidity: 80, condition: "Lluvioso", date: "2024-01-03T10:00:00Z" },
            { city: "Santiago", temperature: 15, humidity: 65, condition: "Soleado", date: "2024-01-04T10:00:00Z" },
            { city: "Buenos Aires", temperature: 28, humidity: 50, condition: "Soleado", date: "2024-01-05T10:00:00Z" },
        ]);

        const res = await request(app)
            .get('/api/weather/reports?limit=2&page=1')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.totalCount).toEqual(5);
        expect(res.body.page).toEqual(1);
        expect(res.body.totalPages).toEqual(3);
    });

    it('should get all weather reports with city filter', async () => {
        await WeatherReport.insertMany([
            { city: "Caracas", temperature: 25, humidity: 70, condition: "Soleado", date: "2024-01-01T10:00:00Z" },
            { city: "Bogota", temperature: 18, humidity: 75, condition: "Nublado", date: "2024-01-02T10:00:00Z" },
            { city: "Caracas", temperature: 26, humidity: 72, condition: "Soleado", date: "2024-01-03T10:00:00Z" },
        ]);

        const res = await request(app)
            .get('/api/weather/reports?city=Caracas')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.totalCount).toEqual(2);
    });

    // --- Pruebas de Eliminación ---
    it('should delete an existing weather report', async () => {
        const createdReport = await WeatherReport.create({
            city: "TestCity",
            temperature: 22,
            humidity: 70,
            condition: "Soleado",
            date: "2024-06-28T12:00:00Z"
        });

        const res = await request(app)
            .delete(`/api/weather/reports/${createdReport._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Reporte eliminado exitosamente.');

        // Verificar que el reporte fue eliminado
        const deletedReport = await WeatherReport.findById(createdReport._id);
        expect(deletedReport).toBeNull();
    });
}); 