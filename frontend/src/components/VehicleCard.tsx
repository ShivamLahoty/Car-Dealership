import type { Vehicle } from '../types'

interface Props {
  vehicle: Vehicle
  onPurchase: (id: number) => void
}

export default function VehicleCard({ vehicle, onPurchase }: Props) {
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
    </div>
  )
}