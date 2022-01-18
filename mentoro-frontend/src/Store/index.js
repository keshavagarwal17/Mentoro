import { configureStore } from "@reduxjs/toolkit";
import auth from "./Reducers/auth";

export const store = configureStore({
    reducer: {
        auth: auth
    },
});