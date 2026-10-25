import request from 'supertest';
import app from '../src/app';

describe('token from login', () => {
  it('works on a protected route', async () => {
    const user = { email: 'flow@example.com', password: 'secret123' };
    await request(app).post('/api/auth/register').send(user);

    const login = await request(app).post('/api/auth/login').send(user);
    expect(login.status).toBe(200);

    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
  });
});