import { useState } from 'react'
import type { FormEvent } from 'react'
import { getErrorMessage } from '../api'
import type { Vehicle, VehicleInput } from '../types'

interface Props {
  vehicle: Vehicle | null
  onSave: (data: VehicleInput) => Promise<void>
  onClose: () => void
}

const fields = [
  { name: 'make', label: 'Make', type: 'text' },
  { name: 'model', label: 'Model', type: 'text' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'price', label: 'Price (₹)', type: 'number' },
  { name: 'quantity', label: 'Quantity in stock', type: 'number' },
] as const

export default function VehicleForm({ vehicle, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    category: vehicle?.category ?? '',
    price: vehicle ? String(vehicle.price) : '',
    quantity: vehicle ? String(vehicle.quantity) : '',
  })
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        make: form.make,
        model: form.model,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      })
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3 rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">{vehicle ? 'Edit vehicle' : 'Add a vehicle'}</h2>

        {error && <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        {fields.map((field) => (
          <label key={field.name} className="block text-sm font-medium">
            {field.label}
            <input
              type={field.type}
              required
              min={field.type === 'number' ? 0 : undefined}
              value={form[field.name]}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal focus:border-indigo-500 focus:outline-none"
            />
          </label>
        ))}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}