import { configureStore } from '@reduxjs/toolkit'
import { Store } from 'redux'
import listReducer from '../features/listSlice'

export const store: Store = configureStore({
  reducer: {
    list: listReducer
  }
})
