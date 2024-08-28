import { useState, useEffect } from 'react'
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import AddData from './components/AddData'

function App(): JSX.Element {
  const [thereIsData, setThereIsData] = useState<boolean>(true)
  const [dataFromDatabase, setDataFromDatabase] = useState<any>([])

  useEffect(() => {
    const data = async () => {
      const dataFromDb = await window.api.getData()
      if(dataFromDb) {
        setThereIsData(true)
        setDataFromDatabase(dataFromDb)
      }
    }

    data()
  }, [])

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={thereIsData ? <Dashboard data={dataFromDatabase} /> : <Navigate to="/add-data" />} 
        />
        <Route path="/add-data" element={<AddData />} />
      </Routes>
    </Router>
  )
}

export default App