import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../api'
import SearchBar from '../components/SearchBar'
import VehicleCard from '../components/VehicleCard'
import { emptyFilters, type Filters, type Vehicle } from '../types'

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Available vehicles</h1>

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
            <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={handlePurchase} />
          ))}
        </div>
      )}
    </div>
  )
}