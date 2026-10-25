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

describe('POST /api/auth/login', () => {
  const loginUser = { email: 'login@example.com', password: 'secret123' };

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send(loginUser);
  });

  it('returns a token for correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send(loginUser);

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(loginUser.email);
  });

  it('rejects a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: loginUser.email, password: 'wrongpass' });

    expect(res.status).toBe(401);
  });

  it('rejects an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'secret123' });

    expect(res.status).toBe(401);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
  });
});