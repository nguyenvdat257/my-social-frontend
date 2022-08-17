import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode'
import { myConfig } from '../config';

const headerSlice = createSlice({
    name: 'header',
    initialState: {
        page: 'home',
    },
    reducers: {
        setPage(state, action) {
            state.page = action.payload;
        }
    }
})

export const headerActions = headerSlice.actions;


export default headerSlice;