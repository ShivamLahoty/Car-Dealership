export interface User {
  id: number
  email: string
  role: 'user' | 'admin'
}

export interface Vehicle {
  id: number
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

export type VehicleInput = Omit<Vehicle, 'id'>

export interface Filters {
  make: string
  model: string
  category: string
  minPrice: string
  maxPrice: string
}

export const emptyFilters: Filters = {
  make: '',
  model: '',
  category: '',
  minPrice: '',
  maxPrice: '',
}
export interface Purchase {
  id: number
  vehicleId: number
  make: string
  model: string
  category: string
  price: number
  quantity: number
  purchasedAt: string
}