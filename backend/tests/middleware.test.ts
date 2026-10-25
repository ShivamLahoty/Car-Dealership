import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { authenticate, requireAdmin } from '../src/middleware/auth';

const app = express();
app.get('/protected', authenticate, (_req, res) => res.json({ ok: true }));
app.get('/admin', authenticate, requireAdmin, (_req, res) => res.json({ ok: true }));

function makeToken(role: string, options = {}) {
  return jwt.sign({ id: 1, role }, process.env.JWT_SECRET as string, options);
}

describe('authenticate', () => {
  it('rejects a request without a token', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });

  it('rejects an expired token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${makeToken('user', { expiresIn: -10 })}`);
    expect(res.status).toBe(401);
  });

  it('allows a valid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${makeToken('user')}`);
    expect(res.status).toBe(200);
  });
});

describe('requireAdmin', () => {
  it('blocks a normal user', async () => {
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${makeToken('user')}`);
    expect(res.status).toBe(403);
  });

  it('allows an admin', async () => {
    const res = await request(app)
      .get('/admin')
      .set('Authorization', `Bearer ${makeToken('admin')}`);
    expect(res.status).toBe(200);
  });
});