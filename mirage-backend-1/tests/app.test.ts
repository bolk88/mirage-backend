import request from 'supertest';
import app from '../src/app'; // Adjust the path if necessary

describe('User API', () => {
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
    });

    it('should get a user by username', async () => {
        const response = await request(app)
            .get('/api/users/testuser');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
    });

    it('should update a user', async () => {
        const response = await request(app)
            .put('/api/users/testuser')
            .send({
                email: 'newemail@example.com'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
    });

    it('should delete a user', async () => {
        const response = await request(app)
            .delete('/api/users/testuser');
        expect(response.status).toBe(204);
    });
});