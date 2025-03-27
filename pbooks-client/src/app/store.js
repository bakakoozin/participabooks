import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import menuReducer from "../features/menuSlice";
import roleReducer from "../features/roleSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        role: roleReducer,
    },
});

export default store;