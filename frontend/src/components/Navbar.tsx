import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../context/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-indigo-700 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <Link to="/" className="text-xl font-bold">
            AutoHub
          </Link>
          {user && (
            <div className="flex gap-4 text-sm">
              <Link to="/" className="hover:underline">
                Vehicles
              </Link>
              <Link to="/purchases" className="hover:underline">
                My Purchases
              </Link>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline">{user.email}</span>
            {user.role === 'admin' && (
              <span className="rounded bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
                ADMIN
              </span>
            )}
            <button
              onClick={handleLogout}
              className="rounded bg-white/20 px-3 py-1 hover:bg-white/30"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4 text-sm">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}