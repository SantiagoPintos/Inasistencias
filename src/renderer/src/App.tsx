import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import AddData from './components/AddData'
import Settings from './components/Settings';
import Home from './components/Home'

function App(): JSX.Element {
  const navigate = useNavigate()

  useEffect(() => {
    window.api.openSettings(() => {
      navigate('/settings')
    })

  }, [])

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard data={undefined} />} />
        <Route path="/add-data" element={<AddData />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
  )
}

export default App