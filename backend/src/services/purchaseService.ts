import db from '../db';
import { Vehicle } from './vehicleService';

export interface Purchase {
  id: number;
  vehicleId: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  purchasedAt: string;
}

export function recordPurchase(userId: number, vehicle: Vehicle, quantity: number) {
  db.prepare(
    'INSERT INTO purchases (user_id, vehicle_id, make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(userId, vehicle.id, vehicle.make, vehicle.model, vehicle.category, vehicle.price, quantity);
}

export function getPurchasesByUser(userId: number) {
  return db
    .prepare(
      `SELECT id, vehicle_id AS vehicleId, make, model, category, price, quantity,
              purchased_at AS purchasedAt
       FROM purchases WHERE user_id = ? ORDER BY id DESC`
    )
    .all(userId) as Purchase[];
}