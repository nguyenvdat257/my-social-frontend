import { configureStore } from "@reduxjs/toolkit";
import pageSlice from "./page-slice";
import authSlice from "./auth-slice";
import signupSlice from "./signup-slice";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {combineReducers} from "redux"; 

const persistConfig = {
    key: 'root',
    storage
};

const reducers =  combineReducers({
    page: pageSlice.reducer,
    auth: authSlice.reducer,
    signup: signupSlice.reducer
})

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer
});

export default store