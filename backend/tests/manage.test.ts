import request from 'supertest';
import app from '../src/app';
import { getToken } from './helpers';

let userToken: string;
let adminToken: string;
let vehicleId: number;

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

const car = { make: 'Mazda', model: 'CX-5', category: 'SUV', price: 28000, quantity: 3 };

beforeAll(async () => {
  userToken = await getToken('user');
  adminToken = await getToken('admin');

  const res = await request(app).post('/api/vehicles').set(bearer(userToken)).send(car);
  vehicleId = res.body.id;
});

describe('PUT /api/vehicles/:id', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).put(`/api/vehicles/${vehicleId}`).send(car);
    expect(res.status).toBe(401);
  });

  it('updates a vehicle', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set(bearer(userToken))
      .send({ ...car, price: 26500 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(26500);
    expect(res.body.make).toBe('Mazda');
  });

  it('returns 404 for an unknown vehicle', async () => {
    const res = await request(app).put('/api/vehicles/9999').set(bearer(userToken)).send(car);
    expect(res.status).toBe(404);
  });

  it('rejects invalid data', async () => {
    const res = await request(app)
      .put(`/api/vehicles/${vehicleId}`)
      .set(bearer(userToken))
      .send({ ...car, price: -5 });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/vehicles/:id', () => {
  it('blocks a normal user', async () => {
    const res = await request(app).delete(`/api/vehicles/${vehicleId}`).set(bearer(userToken));
    expect(res.status).toBe(403);
  });

  it('returns 404 for an unknown vehicle', async () => {
    const res = await request(app).delete('/api/vehicles/9999').set(bearer(adminToken));
    expect(res.status).toBe(404);
  });

  it('lets an admin delete a vehicle', async () => {
    const res = await request(app).delete(`/api/vehicles/${vehicleId}`).set(bearer(adminToken));
    expect(res.status).toBe(204);

    const list = await request(app).get('/api/vehicles').set(bearer(adminToken));
    expect(list.body.find((v: any) => v.id === vehicleId)).toBeUndefined();
  });
}); 