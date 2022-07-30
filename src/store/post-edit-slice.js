import { createSlice } from '@reduxjs/toolkit';

const postEditSlice = createSlice({
    name: 'postEdit',
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

export const postEditActions = postEditSlice.actions;
export default postEditSlice;