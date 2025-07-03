const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');
const EarthquakeReport = require('../../src/models/EarthquakeReport');
const User = require('../../src/models/User');

let authToken;

beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/weather_earthquake_test';
    await mongoose.connect(mongoUri);

    await User.deleteMany({});
    const user = { email: 'test_earthquake_user@example.com', password: 'password123' };
    const res = await request(app).post('/api/auth/register').send(user);
    authToken = res.body.token;
});

afterEach(async () => {
    await EarthquakeReport.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

describe('Earthquake Reports API - Protected Routes', () => {

    it('should create a new earthquake report (protected)', async () => {
        const newReport = {
            magnitude: 6.5,
            depth: 50.2,
            location: "Chile, Coquimbo",
            date: "2024-07-01T12:00:00Z"
        };
        const res = await request(app)
            .post('/api/earthquakes/reports')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newReport);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('location', 'Chile, Coquimbo');
    });

    // --- Pruebas de Actualización (PUT) ---
    it('should update an existing earthquake report', async () => {
        const createdReport = await EarthquakeReport.create({
            magnitude: 7.0,
            depth: 30,
            location: "Japan, Tokyo",
            date: "2024-06-28T05:00:00Z"
        });

        const updates = {
            magnitude: 7.2,
            location: "Japan, Near Tokyo"
        };

        const res = await request(app)
            .put(`/api/earthquakes/reports/${createdReport._id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updates);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('magnitude', 7.2);
        expect(res.body).toHaveProperty('location', 'Japan, Near Tokyo');
    });

    it('should return 404 if earthquake report to update is not found', async () => {
        const updates = { magnitude: 8.0 };
        const nonExistentId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/api/earthquakes/reports/${nonExistentId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updates);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Reporte sísmico no encontrado.');
    });

    // --- Pruebas de Paginación, Filtrado y Ordenamiento ---
    it('should get all earthquake reports with pagination (limit 2, page 1)', async () => {
        await EarthquakeReport.insertMany([
            { magnitude: 5.0, depth: 10, location: "Chile", date: "2024-01-01T10:00:00Z" },
            { magnitude: 6.0, depth: 20, location: "Peru", date: "2024-01-02T10:00:00Z" },
            { magnitude: 7.0, depth: 30, location: "Ecuador", date: "2024-01-03T10:00:00Z" },
            { magnitude: 5.5, depth: 15, location: "Colombia", date: "2024-01-04T10:00:00Z" },
            { magnitude: 6.2, depth: 25, location: "Mexico", date: "2024-01-05T10:00:00Z" },
        ]);

        const res = await request(app)
            .get('/api/earthquakes/reports?limit=2&page=1')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.totalCount).toEqual(5);
        expect(res.body.page).toEqual(1);
        expect(res.body.totalPages).toEqual(3);
    });

    it('should get all earthquake reports with minMagnitude filter', async () => {
        await EarthquakeReport.insertMany([
            { magnitude: 4.0, depth: 10, location: "USA", date: "2024-01-01T10:00:00Z" },
            { magnitude: 5.5, depth: 20, location: "Canada", date: "2024-01-02T10:00:00Z" },
            { magnitude: 6.0, depth: 30, location: "Greenland", date: "2024-01-03T10:00:00Z" },
        ]);

        const res = await request(app)
            .get('/api/earthquakes/reports?minMagnitude=5.0')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.totalCount).toEqual(2);
    });

    // --- Pruebas de Eliminación ---
    it('should delete an existing earthquake report', async () => {
        const createdReport = await EarthquakeReport.create({
            magnitude: 6.0,
            depth: 25,
            location: "TestLocation",
            date: "2024-06-28T12:00:00Z"
        });

        const res = await request(app)
            .delete(`/api/earthquakes/reports/${createdReport._id}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Reporte eliminado exitosamente.');

        // Verificar que el reporte fue eliminado
        const deletedReport = await EarthquakeReport.findById(createdReport._id);
        expect(deletedReport).toBeNull();
    });

    it('should return 404 when trying to delete non-existent earthquake report', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/earthquakes/reports/${nonExistentId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Reporte sísmico no encontrado.');
    });
}); 