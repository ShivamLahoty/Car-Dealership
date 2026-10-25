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