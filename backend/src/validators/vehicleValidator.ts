export function validateVehicle(body: any) {
  const { make, model, category, price, quantity } = body;

  if (!make || !model || !category) {
    return 'Make, model and category are required';
  }
  if (typeof price !== 'number' || price <= 0) {
    return 'Price must be a positive number';
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return 'Quantity must be a whole number, 0 or more';
  }
  return null;
}