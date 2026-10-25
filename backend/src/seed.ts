import bcrypt from 'bcryptjs';
import db from './db';

const adminHash = bcrypt.hashSync('admin123', 10);
db.prepare("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, 'admin')").run(
  'admin@dealership.com',
  adminHash
);

db.prepare('DELETE FROM vehicles').run();

const insert = db.prepare(
  'INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)'
);

const cars: [string, string, string, number, number][] = [
  ['Toyota', 'Corolla', 'Sedan', 1800000, 5],
  ['Toyota', 'RAV4', 'SUV', 2800000, 3],
  ['Honda', 'Civic', 'Sedan', 2000000, 4],
  ['Honda', 'CR-V', 'SUV', 3000000, 0],
  ['Ford', 'Mustang', 'Coupe', 7500000, 2],
  ['Ford', 'F-150', 'Truck', 6000000, 6],
  ['BMW', '3 Series', 'Sedan', 6000000, 1],
  ['Tesla', 'Model 3', 'Electric', 4000000, 7],
];

cars.forEach(([make, model, category, price, quantity]) => {
  insert.run(make, model, category, price, quantity);
});

console.log('Seed done. Admin login: admin@dealership.com / admin123');