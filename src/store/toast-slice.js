import { createSlice } from '@reduxjs/toolkit';

const toastSlice = createSlice({
    name: 'toast',
    initialState: {
        isShow: false,
        message: ''
    },
    reducers: {
        setIsShow(state, action) {
            state.isShow = true;
            state.message = action.payload;
        },
        setNotShow(state, action) {
            state.isShow = false;
            state.message = '';
        },
    }
})

export const toastActions = toastSlice.actions;
export default toastSlice;