import { useState, useEffect } from 'react'
import AddToken from './components/AddToken'
import ShowData from './components/showData'

function App(): JSX.Element {
  const [data, setData] = useState<[]>([])

  useEffect(() => {
    const data = async () => {
      const data = await window.api.getData()
      setData(data)
    }

    data()
  }, [])

  return (
    <>
      {data ? (
        <ShowData data={data.values}/>
      ) : (
        <AddToken />
      )}
    </>
  )
}

export default App
