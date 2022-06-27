import { createSlice } from '@reduxjs/toolkit';

const pageSlice = createSlice({
    name: 'page',
    initialState: { page: 'home' },
    reducers: {
        switchPage(state, action) {
            state.page = action.payload.page;
        }
    }
})

export const pageActions = pageSlice.actions;

export default pageSlice;