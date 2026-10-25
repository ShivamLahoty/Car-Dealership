import { Router } from 'express';
import {
  checkPassword,
  createToken,
  findUserByEmail,
  registerUser,
} from '../services/authService';

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = registerUser(email, password, role === 'admin' ? 'admin' : 'user');
  res.status(201).json(user);
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = findUserByEmail(email);
  if (!user || !checkPassword(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    token: createToken(user),
    user: { id: user.id, email: user.email, role: user.role },
  });
});

export default router;