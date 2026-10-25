import request from 'supertest';
import app from '../src/app';
import { getToken } from './helpers';

let userToken: string;
let adminToken: string;
let vehicleId: number;

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
  userToken = await getToken('user');
  adminToken = await getToken('admin');

  const res = await request(app)
    .post('/api/vehicles')
    .set(bearer(adminToken))
    .send({ make: 'Skoda', model: 'Slavia', category: 'Sedan', price: 1500000, quantity: 5 });
  vehicleId = res.body.id;
});

describe('GET /api/purchases', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/purchases');
    expect(res.status).toBe(401);
  });

  it('returns an empty list before any purchase', async () => {
    const res = await request(app).get('/api/purchases').set(bearer(userToken));
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('records a purchase', async () => {
    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken))
      .send({ quantity: 2 });

    const res = await request(app).get('/api/purchases').set(bearer(userToken));
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].make).toBe('Skoda');
    expect(res.body[0].quantity).toBe(2);
    expect(res.body[0].price).toBe(1500000);
  });

  it('does not record a failed purchase', async () => {
    await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken))
      .send({ quantity: 99 });

    const res = await request(app).get('/api/purchases').set(bearer(userToken));
    expect(res.body).toHaveLength(1);
  });

  it('only shows the purchases of the logged in user', async () => {
    const res = await request(app).get('/api/purchases').set(bearer(adminToken));
    expect(res.body).toEqual([]);
  });

  it('keeps the purchase after the vehicle is deleted', async () => {
    await request(app).delete(`/api/vehicles/${vehicleId}`).set(bearer(adminToken));

    const res = await request(app).get('/api/purchases').set(bearer(userToken));
    expect(res.body).toHaveLength(1);
    expect(res.body[0].model).toBe('Slavia');
  });
});