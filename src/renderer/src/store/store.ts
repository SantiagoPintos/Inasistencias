import { configureStore } from '@reduxjs/toolkit'
import { Store } from 'redux'
import listReducer from '../features/listSlice'
import keyReducer from '../features/keySlice'

export const store: Store = configureStore({
  reducer: {
    list: listReducer,
    key: keyReducer
  }
})
