import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "",
    isLogged: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action) {
            state.username = action.payload;
            state.isLogged = true;
        },
    },
});

export const { login, logout, updateUsername } = authSlice.actions;

export default authSlice.reducer;