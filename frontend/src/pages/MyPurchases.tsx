import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage } from '../api'
import { formatDate, formatPrice } from '../format'
import type { Purchase } from '../types'

export default function MyPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/purchases')
      .then((res) => setPurchases(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const totalSpent = purchases.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My purchases</h1>

      {error && <p className="rounded-lg bg-red-100 px-4 py-2 text-red-700">{error}</p>}

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading your purchases...</p>
      ) : purchases.length === 0 ? (
        <div className="mt-10 text-center text-slate-500">
          <p>You have not bought anything yet.</p>
          <Link to="/" className="mt-2 inline-block text-indigo-600 hover:underline">
            Browse vehicles
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-xl bg-white p-4 shadow">
            <span className="text-slate-500">Total spent</span>
            <p className="text-2xl font-bold text-indigo-700">{formatPrice(totalSpent)}</p>
          </div>

          <div className="space-y-3">
            {purchases.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-4 shadow"
              >
                <div>
                  <h3 className="font-semibold">
                    {p.make} {p.model}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {p.category} · {formatDate(p.purchasedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(p.price * p.quantity)}</p>
                  <p className="text-sm text-slate-500">
                    {p.quantity} × {formatPrice(p.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}