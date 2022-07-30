import { createSlice } from '@reduxjs/toolkit';

const optionSlice = createSlice({
    name: 'option',
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

export const optionActions = optionSlice.actions;
export default optionSlice;