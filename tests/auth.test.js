const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

describe('Auth Integration & User Model', () => {
    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/weather_earthquake_test';
        await mongoose.connect(mongoUri);
    }, 30000);

    beforeEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    const testUser = { email: 'test@example.com', password: 'password123' };

    it('registers a new user', async () => {
        const res = await request(app).post('/api/auth/register').send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('email', testUser.email);
        expect(res.body).toHaveProperty('token');
    });

    it('prevents duplicate registration', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app).post('/api/auth/register').send(testUser);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('validates email format', async () => {
        const res = await request(app).post('/api/auth/register').send({ email: 'bad', password: 'password123' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('validates password length', async () => {
        const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: '123' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });

    it('logs in a registered user', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app).post('/api/auth/login').send(testUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('rejects login with wrong password', async () => {
        await request(app).post('/api/auth/register').send(testUser);
        const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrong' });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('rejects login with non-existent email', async () => {
        const res = await request(app).post('/api/auth/login').send({ email: 'no@no.com', password: 'password123' });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    // User model: password hashing and matchPassword
    it('hashes password before saving', async () => {
        const user = new User({ email: 'hash@test.com', password: 'plainpass' });
        await user.save();
        expect(user.password).not.toBe('plainpass');
        expect(user.password.length).toBeGreaterThan(10);
    });

    it('matchPassword returns true for correct password', async () => {
        const user = new User({ email: 'match@test.com', password: 'mypassword' });
        await user.save();
        const isMatch = await user.matchPassword('mypassword');
        expect(isMatch).toBe(true);
    });

    it('matchPassword returns false for wrong password', async () => {
        const user = new User({ email: 'match2@test.com', password: 'mypassword' });
        await user.save();
        const isMatch = await user.matchPassword('wrongpassword');
        expect(isMatch).toBe(false);
    });
}); 