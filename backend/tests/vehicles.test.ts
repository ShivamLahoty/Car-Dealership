import request from 'supertest';
import app from '../src/app';
import { getToken } from './helpers';

const car = {
  make: 'Toyota',
  model: 'Corolla',
  category: 'Sedan',
  price: 20000,
  quantity: 5,
};

let token: string;

beforeAll(async () => {
  token = await getToken('user');
});

describe('POST /api/vehicles', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).post('/api/vehicles').send(car);
    expect(res.status).toBe(401);
  });

  it('adds a new vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(car);

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.make).toBe('Toyota');
    expect(res.body.quantity).toBe(5);
  });

  it('rejects a vehicle with no make', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...car, make: '' });

    expect(res.status).toBe(400);
  });

  it('rejects a negative price', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...car, price: -100 });

    expect(res.status).toBe(400);
  });

  it('rejects a negative quantity', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...car, quantity: -1 });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/vehicles', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.status).toBe(401);
  });

  it('returns the list of vehicles', async () => {
    const res = await request(app)
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].make).toBe('Toyota');
  });
});