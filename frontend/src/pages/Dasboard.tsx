import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../api'
import SearchBar from '../components/SearchBar'
import VehicleCard from '../components/VehicleCard'
import VehicleForm from '../components/VehicleForm'
import useAuth from '../context/useAuth'
import { emptyFilters, type Filters, type Vehicle, type VehicleInput } from '../types'

export default function Dashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const hasFilters = Object.values(filters).some((value) => value !== '')
        const res = hasFilters
          ? await api.get('/vehicles/search', { params: filters })
          : await api.get('/vehicles')
        setVehicles(res.data)
        setError('')
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  function openForm(vehicle: Vehicle | null) {
    setEditing(vehicle)
    setFormOpen(true)
  }

  function closeForm() {
    setEditing(null)
    setFormOpen(false)
  }

  async function handlePurchase(id: number) {
    setMessage('')
    setError('')
    try {
      const res = await api.post(`/vehicles/${id}/purchase`)
      setVehicles((list) => list.map((v) => (v.id === id ? res.data : v)))
      setMessage(`You purchased a ${res.data.make} ${res.data.model}!`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleSave(data: VehicleInput) {
    setMessage('')
    setError('')
    if (editing) {
      const res = await api.put(`/vehicles/${editing.id}`, data)
      setVehicles((list) => list.map((v) => (v.id === editing.id ? res.data : v)))
      setMessage('Vehicle updated')
    } else {
      const res = await api.post('/vehicles', data)
      setVehicles((list) => [res.data, ...list])
      setMessage('Vehicle added')
    }
    closeForm()
  }

  async function handleDelete(vehicle: Vehicle) {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return

    setMessage('')
    setError('')
    try {
      await api.delete(`/vehicles/${vehicle.id}`)
      setVehicles((list) => list.filter((v) => v.id !== vehicle.id))
      setMessage('Vehicle deleted')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleRestock(id: number, amount: number) {
    setMessage('')
    setError('')
    try {
      const res = await api.post(`/vehicles/${id}/restock`, { quantity: amount })
      setVehicles((list) => list.map((v) => (v.id === id ? res.data : v)))
      setMessage(`Restocked ${res.data.make} ${res.data.model}`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available vehicles</h1>
        {isAdmin && (
          <button
            onClick={() => openForm(null)}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
          >
            + Add vehicle
          </button>
        )}
      </div>

      <SearchBar filters={filters} onChange={setFilters} />

      {message && (
        <p className="mt-4 rounded-lg bg-green-100 px-4 py-2 text-green-800">{message}</p>
      )}
      {error && <p className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-red-700">{error}</p>}

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <p className="mt-10 text-center text-slate-500">No vehicles found.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isAdmin={isAdmin}
              onPurchase={handlePurchase}
              onEdit={openForm}
              onDelete={handleDelete}
              onRestock={handleRestock}
            />
          ))}
        </div>
      )}

      {formOpen && <VehicleForm vehicle={editing} onSave={handleSave} onClose={closeForm} />}
    </div>
  )
}