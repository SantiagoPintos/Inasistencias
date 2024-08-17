import { store } from './store/store'
import { Provider } from 'react-redux'

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <p>Hello!</p>
    </Provider>
  )
}

export default App
