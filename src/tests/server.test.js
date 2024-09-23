const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');  // Assuming your server exports the app

describe('Server API Tests', () => {
    beforeAll(async () => {
        // Connect to a test database before running tests
        await mongoose.connect(process.env.TEST_MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        // Disconnect from the test database after tests
        await mongoose.connection.close();
    });

    describe('GET /api/content', () => {
        it('should return content for a given keyword', async () => {
            const res = await request(app)
                .get('/api/content')
                .query({ keyword: 'test' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('keyword', 'test');
            expect(res.body).toHaveProperty('title');
            expect(res.body).toHaveProperty('subtitle');
            expect(res.body).toHaveProperty('mainContent');
            expect(res.body).toHaveProperty('ctaText');
        });
    });

    describe('GET /api/search', () => {
        it('should return search results', async () => {
            const res = await request(app)
                .get('/api/search')
                .query({ query: 'test' });

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
        });
    });

    // Add more test cases as needed
});