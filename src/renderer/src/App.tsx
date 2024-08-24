import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddToken from './components/AddToken'

function App(): JSX.Element {
  const dispatch = useDispatch()
  const key = useSelector((state: { key: { id: string } }) => state.key.id)
  const [thereIsKey, setThereIsKey] = useState(false)

  useEffect(() => {
    const getKey = async () => {
      try{
        const getKeyFromDb = await window.api.getToken()
        if(getKeyFromDb){
          dispatch({ type: 'key/setKey', payload: getKeyFromDb })
          setThereIsKey(true)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getKey()
  }, [])

  return (
    <>
      {thereIsKey ? (
        null
      ) : (
        <AddToken />
      )}
    </>
  )
}

export default App
