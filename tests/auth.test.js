const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test_db_weather_earthquake_api';
        await mongoose.connect(mongoUri);
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    const testUser = {
        email: 'test@example.com',
        password: 'password123',
    };

    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('email', testUser.email);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'El usuario ya existe con este correo electrónico.');
    });

    it('should not register a user with an invalid email format', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'invalid-email', password: 'password123' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toHaveProperty('msg', 'Por favor, introduce un correo electrónico válido.');
    });

    it('should not register a user with a password less than 6 characters', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test2@example.com', password: '123' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0]).toHaveProperty('msg', 'La contraseña debe tener al menos 6 caracteres.');
    });

    it('should login an existing user successfully', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('email', testUser.email);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with invalid credentials (wrong password)', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: 'wrongpassword' });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Credenciales inválidas (correo o contraseña incorrectos).');
    });

    it('should not login with invalid credentials (non-existent email)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'nonexistent@example.com', password: 'anypassword' });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Credenciales inválidas (correo o contraseña incorrectos).');
    });

    it('should protect a route with valid token', async () => {
        const registerRes = await request(app).post('/api/auth/register').send(testUser);
        const token = registerRes.body.token;
        const protectedReportRes = await request(app)
            .post('/api/weather/reports')
            .set('Authorization', `Bearer ${token}`)
            .send({ city: "Caracas", temperature: 28, humidity: 75, condition: "Soleado" });
        expect([201, 400]).toContain(protectedReportRes.statusCode); // 201 si éxito, 400 si falta validación
    });

    it('should deny access to a protected route without token', async () => {
        const res = await request(app)
            .post('/api/weather/reports')
            .send({ city: "Caracas", temperature: 28, humidity: 75, condition: "Soleado" });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'No autorizado, no hay token.');
    });

    it('should deny access to a protected route with an invalid token', async () => {
        const res = await request(app)
            .post('/api/weather/reports')
            .set('Authorization', 'Bearer invalidtoken123')
            .send({ city: "Caracas", temperature: 28, humidity: 75, condition: "Soleado" });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'No autorizado, token fallido.');
    });

    it('should deny access to a protected route with an expired token', async () => {
        const expiredToken = jwt.sign({ id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, { expiresIn: '1ms' });
        await new Promise(resolve => setTimeout(resolve, 10));
        const res = await request(app)
            .post('/api/weather/reports')
            .set('Authorization', `Bearer ${expiredToken}`)
            .send({ city: "Caracas", temperature: 28, humidity: 75, condition: "Soleado" });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Token expirado, por favor inicie sesión de nuevo.');
    });
}); 