import { createSlice } from '@reduxjs/toolkit';

const clickSlice = createSlice({
    name: 'click',
    initialState: {
        isClickable: true,
    },
    reducers: {
        setIsClickable(state, action) {
            state.isClickable = action.payload;
        }
    }
})

export const clickActions = clickSlice.actions;
export default clickSlice;