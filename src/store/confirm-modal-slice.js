import { createSlice } from '@reduxjs/toolkit';

const confirmSlice = createSlice({
    name: 'confirm',
    initialState: {
        name: '',
        props: {},
    },
    reducers: {
        setName(state, action) {
            state.name = action.payload;
        },
        setProps(state, action) {
            state.props = action.payload;
        },
    }
})

export const confirmActions = confirmSlice.actions;
export default confirmSlice;