import { useState, useEffect } from 'react'
import AddData from './components/AddData'
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
        <div className='w-100 flex'>
          <div className='w-7/12'>
              <ShowData data={data.values}/>
          </div>
          <div className='w-5/12'>
            <p></p>
          </div>
        </div>
      ) : (
        <div className='h-screenflex items-center justify-center'>
            <AddData />
        </div>
      )}
    </>
  )
}

export default App