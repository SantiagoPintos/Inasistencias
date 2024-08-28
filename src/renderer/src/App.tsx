import { useState, useEffect } from 'react'
import AddData from './components/AddData'
import ShowData from './components/showData'

function App(): JSX.Element {
  const [thereIsData, setThereIsData] = useState<boolean>(true)
  const [dataFromDatabase, setDataFromDatabase] = useState<any>([])

  useEffect(() => {
    console.log('getting data in useEffect')
    const data = async () => {
      const dataFromDb = await window.api.getData()
      console.log(dataFromDb)
      if(dataFromDb) {
        setThereIsData(true)
        setDataFromDatabase(dataFromDb)
      }
    }

    data()
  }, [])

  return (
    <>
      {thereIsData ? (
        <div className='w-100 flex'>
          <div className='w-7/12'>
              <ShowData data={dataFromDatabase}/>
          </div>
          <div className='w-5/12'>
            <p></p>
          </div>
        </div>
      ) : (
        <div className='h-screen flex items-center justify-center'>
            <AddData />
        </div>
      )}
    </>
  )
}

export default App