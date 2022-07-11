import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import signupSlice from "./signup-slice";
import profileSlice from "./profile-slice"
import privacySlice from "./privacy-slice"; 
import toastSlice from "./toast-slice";
import storyBoardSlice from "./story-board-slice";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from "redux";

const persistConfig = {
    key: 'root',
    whitelist: ['auth'],
    storage
};

const reducers = combineReducers({
    auth: authSlice.reducer,
    signup: signupSlice.reducer,
    profile: profileSlice.reducer,
    privacy: privacySlice.reducer,
    toast: toastSlice.reducer,
    storyBoard: storyBoardSlice.reducer,
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