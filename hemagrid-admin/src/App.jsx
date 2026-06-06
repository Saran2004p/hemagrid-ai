import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar   from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Donors    from './pages/Donors'
import Requests  from './pages/Requests'
import Pulse     from './pages/Pulse'
import Login     from './pages/Login'

export default function App() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('bb_admin_auth') === 'true'
  )

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-56 p-8 min-h-screen">
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/donors"   element={<Donors />}    />
          <Route path="/requests" element={<Requests />}  />
          <Route path="/pulse"    element={<Pulse />}     />
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
