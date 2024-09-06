import  { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoadingSpinner } from './ui/Loading-spinner';

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const data: DataFromApi = await window.api.getData()
    if(data){
      setLoading(false)
      navigate('/dashboard', { state: data })
    } else {
      setLoading(false)
      navigate('/add-data')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return null
}

export default Home
