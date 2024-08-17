import { createSlice, Slice } from "@reduxjs/toolkit";

interface Item {
    id: number;
}

interface ListState {
    items: Item[];
}

const initialState: ListState = {
    items: [],
}

export const listSlice: Slice<ListState> = createSlice({
    name: "list",
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item: Item) => item.id !== action.payload);
        },
        clear : (state) => {
            state.items = [];
        }
    },
});

export const { addItem, removeItem, clear } = listSlice.actions
export default listSlice.reducer
