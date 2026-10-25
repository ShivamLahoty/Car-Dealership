import request from 'supertest';
import app from '../src/app';

const user = { email: 'john@example.com', password: 'secret123' };

describe('POST /api/auth/register', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(user.email);
    expect(res.body.role).toBe('user');
    expect(res.body.password).toBeUndefined();
  });

  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'a@example.com' });

    expect(res.status).toBe(400);
  });

  it('rejects a short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'b@example.com', password: '123' });

    expect(res.status).toBe(400);
  });

  it('rejects a duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(user);

    expect(res.status).toBe(409);
  });

  it('creates an admin when role is admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@example.com', password: 'secret123', role: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('admin');
  });
});