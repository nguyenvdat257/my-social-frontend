import { configureStore } from "@reduxjs/toolkit";
import pageSlice from "./page-slice";
import authSlice from "./auth-slice";
import signupSlice from "./signup-slice";
import profileSlice from "./profile-slice"
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "redux";

const persistConfig = {
    key: 'root',
    whitelist: ['auth'],
    storage
};

const reducers = combineReducers({
    page: pageSlice.reducer,
    auth: authSlice.reducer,
    signup: signupSlice.reducer,
    profile: profileSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});

export default store