import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

export function findUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
}

export function registerUser(email: string, password: string, role: string) {
  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
    .run(email, hash, role);

  return { id: Number(result.lastInsertRowid), email, role };
}

export function checkPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function createToken(user: { id: number; role: string }) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );
}