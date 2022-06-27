import { configureStore } from "@reduxjs/toolkit";
import pageSlice from "./page-slice";
import authSlice from "./auth-slice";

const store = configureStore({
    reducer: {
        page: pageSlice.reducer,
        auth: authSlice.reducer,
    }
});

export default store