import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import menuReducer from "../features/menuSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
    },
});

export default store;