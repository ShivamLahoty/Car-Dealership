import jwt from 'jsonwebtoken';

export async function getToken(role: 'user' | 'admin' = 'user') {
  const id = role === 'admin' ? 2 : 1;
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}