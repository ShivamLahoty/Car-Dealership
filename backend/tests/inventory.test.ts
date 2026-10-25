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
    .set(bearer(userToken))
    .send({ make: 'Ford', model: 'Focus', category: 'Hatchback', price: 18000, quantity: 2 });
  vehicleId = res.body.id;
});

describe('POST /api/vehicles/:id/purchase', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).post(`/api/vehicles/${vehicleId}/purchase`);
    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown vehicle', async () => {
    const res = await request(app).post('/api/vehicles/9999/purchase').set(bearer(userToken));
    expect(res.status).toBe(404);
  });

  it('rejects an invalid quantity', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken))
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('rejects buying more than the stock', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken))
      .send({ quantity: 5 });

    expect(res.status).toBe(400);
  });

  it('decreases the quantity by 1 by default', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken));

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(1);
  });

  it('decreases the quantity by the given amount', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken))
      .send({ quantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(0);
  });

  it('rejects a purchase when out of stock', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/purchase`)
      .set(bearer(userToken));

    expect(res.status).toBe(400);
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  it('blocks a normal user', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set(bearer(userToken))
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
  });

  it('returns 404 for an unknown vehicle', async () => {
    const res = await request(app)
      .post('/api/vehicles/9999/restock')
      .set(bearer(adminToken))
      .send({ quantity: 5 });

    expect(res.status).toBe(404);
  });

  it('rejects an invalid quantity', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set(bearer(adminToken))
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('lets an admin increase the quantity', async () => {
    const res = await request(app)
      .post(`/api/vehicles/${vehicleId}/restock`)
      .set(bearer(adminToken))
      .send({ quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(10);
  });
});