import { Router } from 'express';
import { findUserByEmail, registerUser } from '../services/authService';

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

export default router;