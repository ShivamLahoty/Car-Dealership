import useAuth from '../context/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return <div className="mx-auto max-w-6xl p-4">Logged in as {user?.email}</div>
}