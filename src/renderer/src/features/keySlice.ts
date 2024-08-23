import { createSlice, Slice } from '@reduxjs/toolkit'

interface Key {
  id: string | null
}

const initialState: Key = {
  id: null
}

export const listSlice: Slice<Key> = createSlice({
  name: 'key',
  initialState,
  reducers: {
    setKey: (state, action) => {
      state.id = action.payload
    },
    deleteKey: (state) => {
      state.id = null
    }
  }
})

export const { setKey, deleteKey } = listSlice.actions
export default listSlice.reducer
