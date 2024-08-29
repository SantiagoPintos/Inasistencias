import { useState, useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import AddData from './components/AddData'
import Settings from './components/Settings';
import { LoadingSpinner } from './components/ui/Loading-spinner';

function App(): JSX.Element {
  const navigate = useNavigate()
  const [thereIsData, setThereIsData] = useState<boolean | null>(null)
  const [dataFromDatabase, setDataFromDatabase] = useState<any>([])

  useEffect(() => {
    window.api.openSettings(() => {
      navigate('/settings')
    })

    const data = async () => {
      const dataFromDb = await window.api.getData()
      if(dataFromDb) {
        setThereIsData(true)
        setDataFromDatabase(dataFromDb)
      } else {
        setThereIsData(false)
      }
    }

    data()
  }, [])

  if (thereIsData === null) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
      <Routes>
        <Route 
          path="/" 
          element={thereIsData ? <Dashboard data={dataFromDatabase} /> : <Navigate to="/add-data" />} 
        />
        <Route path="/add-data" element={<AddData />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
  )
}

export default App