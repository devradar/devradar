import { useEffect, useState } from 'react'

type User = { id: number; name: string; email: string }

function App() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Tracer Bullet Test</h1>
      <h2 className="text-xl">Users from Postgres:</h2>
      <ul className="list-disc pl-5">
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  )
}

export default App