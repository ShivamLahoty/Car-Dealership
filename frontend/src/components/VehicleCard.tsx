import { useState } from 'react'
import type { Vehicle } from '../types'

interface Props {
  vehicle: Vehicle
  isAdmin: boolean
  onPurchase: (id: number) => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
  onRestock: (id: number, amount: number) => void
}

export default function VehicleCard({
  vehicle,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}: Props) {
  const [amount, setAmount] = useState(5)
  const soldOut = vehicle.quantity === 0

  return (
    <div className="flex flex-col rounded-xl bg-white p-5 shadow transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-slate-500">{vehicle.category}</p>
        </div>
        <span
          className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${
            soldOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {soldOut ? 'Out of stock' : `${vehicle.quantity} in stock`}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-indigo-700">${vehicle.price.toLocaleString()}</p>

      <button
        disabled={soldOut}
        onClick={() => onPurchase(vehicle.id)}
        className="mt-4 rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Purchase
      </button>

      {isAdmin && (
        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm"
            />
            <button
              onClick={() => onRestock(vehicle.id, amount)}
              className="flex-1 rounded-lg bg-emerald-600 py-1 text-sm text-white hover:bg-emerald-700"
            >
              Restock
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 rounded-lg border border-slate-300 py-1 text-sm hover:bg-slate-100"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(vehicle)}
              className="flex-1 rounded-lg border border-red-300 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}