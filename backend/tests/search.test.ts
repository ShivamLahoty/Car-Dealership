import request from 'supertest';
import app from '../src/app';
import { getToken } from './helpers';

let token: string;

const cars = [
  { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 20000, quantity: 5 },
  { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 30000, quantity: 2 },
  { make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 0 },
];

beforeAll(async () => {
  token = await getToken('user');
  for (const car of cars) {
    await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send(car);
  }
});

function search(query: string) {
  return request(app)
    .get(`/api/vehicles/search?${query}`)
    .set('Authorization', `Bearer ${token}`);
}

describe('GET /api/vehicles/search', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/api/vehicles/search?make=Toyota');
    expect(res.status).toBe(401);
  });

  it('searches by make', async () => {
    const res = await search('make=Toyota');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('searches by model ignoring case', async () => {
    const res = await search('model=civic');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].make).toBe('Honda');
  });

  it('searches by category', async () => {
    const res = await search('category=Sedan');
    expect(res.body).toHaveLength(2);
  });

  it('searches by price range', async () => {
    const res = await search('minPrice=21000&maxPrice=31000');
    expect(res.body).toHaveLength(2);
  });

  it('combines filters', async () => {
    const res = await search('make=Toyota&category=SUV');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].model).toBe('RAV4');
  });

  it('returns an empty list when nothing matches', async () => {
    const res = await search('make=Tesla');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a price that is not a number', async () => {
    const res = await search('minPrice=abc');
    expect(res.status).toBe(400);
  });
});