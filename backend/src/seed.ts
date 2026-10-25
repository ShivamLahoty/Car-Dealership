import bcrypt from 'bcryptjs';
import db from './db';

const adminHash = bcrypt.hashSync('admin123', 10);
db.prepare("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, 'admin')").run(
  'admin@dealership.com',
  adminHash
);

const { total } = db.prepare('SELECT COUNT(*) AS total FROM vehicles').get() as { total: number };

if (total === 0) {
  const insert = db.prepare(
    'INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)'
  );

  const cars: [string, string, string, number, number][] = [
    ['Toyota', 'Corolla', 'Sedan', 20000, 5],
    ['Toyota', 'RAV4', 'SUV', 30000, 3],
    ['Honda', 'Civic', 'Sedan', 22000, 4],
    ['Honda', 'CR-V', 'SUV', 32000, 0],
    ['Ford', 'Mustang', 'Coupe', 45000, 2],
    ['Ford', 'F-150', 'Truck', 38000, 6],
    ['BMW', '3 Series', 'Sedan', 42000, 1],
    ['Tesla', 'Model 3', 'Electric', 40000, 7],
  ];

  cars.forEach(([make, model, category, price, quantity]) => {
    insert.run(make, model, category, price, quantity);
  });
}

console.log('Seed done. Admin login: admin@dealership.com / admin123');