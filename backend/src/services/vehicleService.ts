import db from '../db';

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export type VehicleInput = Omit<Vehicle, 'id'>;

export interface SearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function getVehicleById(id: number) {
  if (!Number.isInteger(id)) return undefined;
  return db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id) as Vehicle | undefined;
}

export function getAllVehicles() {
  return db.prepare('SELECT * FROM vehicles ORDER BY id DESC').all() as Vehicle[];
}

export function addVehicle(data: VehicleInput) {
  const result = db
    .prepare(
      'INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)'
    )
    .run(data.make, data.model, data.category, data.price, data.quantity);

  return getVehicleById(Number(result.lastInsertRowid));
}

export function searchVehicles(filters: SearchFilters) {
  let sql = 'SELECT * FROM vehicles WHERE 1 = 1';
  const params: (string | number)[] = [];

  if (filters.make) {
    sql += ' AND make LIKE ?';
    params.push(`%${filters.make}%`);
  }
  if (filters.model) {
    sql += ' AND model LIKE ?';
    params.push(`%${filters.model}%`);
  }
  if (filters.category) {
    sql += ' AND category LIKE ?';
    params.push(`%${filters.category}%`);
  }
  if (filters.minPrice !== undefined) {
    sql += ' AND price >= ?';
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    sql += ' AND price <= ?';
    params.push(filters.maxPrice);
  }

  return db.prepare(sql + ' ORDER BY id DESC').all(...params) as Vehicle[];
}

export function updateVehicle(id: number, data: VehicleInput) {
  db.prepare(
    'UPDATE vehicles SET make = ?, model = ?, category = ?, price = ?, quantity = ? WHERE id = ?'
  ).run(data.make, data.model, data.category, data.price, data.quantity, id);

  return getVehicleById(id);
}

export function deleteVehicle(id: number) {
  db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);
}

export function purchaseVehicle(id: number, quantity: number) {
  const result = db
    .prepare('UPDATE vehicles SET quantity = quantity - ? WHERE id = ? AND quantity >= ?')
    .run(quantity, id, quantity);

  return result.changes > 0;
}

export function restockVehicle(id: number, quantity: number) {
  db.prepare('UPDATE vehicles SET quantity = quantity + ? WHERE id = ?').run(quantity, id);
}