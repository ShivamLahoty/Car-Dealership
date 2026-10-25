import { Router } from 'express';
import { AuthRequest, authenticate, requireAdmin } from '../middleware/auth';
import { validateVehicle } from '../validators/vehicleValidator';
import { recordPurchase } from '../services/purchaseService';
import {
  Vehicle,
  addVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicleById,
  purchaseVehicle,
  restockVehicle,
  searchVehicles,
  updateVehicle,
} from '../services/vehicleService';

const router = Router();

router.use(authenticate);

router.get('/', (_req, res) => {
  res.json(getAllVehicles());
});

router.get('/search', (req, res) => {
  const { make, model, category, minPrice, maxPrice } = req.query;

  if ((minPrice && isNaN(Number(minPrice))) || (maxPrice && isNaN(Number(maxPrice)))) {
    return res.status(400).json({ message: 'Price filters must be numbers' });
  }

  const vehicles = searchVehicles({
    make: make as string,
    model: model as string,
    category: category as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });
  res.json(vehicles);
});

router.post('/', (req, res) => {
  const error = validateVehicle(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { make, model, category, price, quantity } = req.body;
  const vehicle = addVehicle({ make, model, category, price, quantity });
  res.status(201).json(vehicle);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!getVehicleById(id)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  const error = validateVehicle(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { make, model, category, price, quantity } = req.body;
  res.json(updateVehicle(id, { make, model, category, price, quantity }));
});

router.delete('/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);

  if (!getVehicleById(id)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  deleteVehicle(id);
  res.status(204).send();
});

router.post('/:id/purchase', (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const quantity = req.body?.quantity ?? 1;

  if (!getVehicleById(id)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be a whole number, 1 or more' });
  }
  if (!purchaseVehicle(id, quantity)) {
    return res.status(400).json({ message: 'Not enough stock' });
  }

  const vehicle = getVehicleById(id) as Vehicle;
  recordPurchase(req.user!.id, vehicle, quantity);
  res.json(vehicle);
});

router.post('/:id/restock', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const quantity = req.body?.quantity;

  if (!getVehicleById(id)) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be a whole number, 1 or more' });
  }

  restockVehicle(id, quantity);
  res.json(getVehicleById(id));
});

export default router;