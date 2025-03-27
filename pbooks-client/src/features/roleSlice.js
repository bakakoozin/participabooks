import {createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAdmin: false,
    isModerator: false,
};

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        setAdmin(state, action) {
            state.isAdmin = action.payload;
        },
        setModerator(state, action) {
            state.isModerator = action.payload;
        },
    },
});

export const { setAdmin, setModerator } = roleSlice.actions;
export default roleSlice.reducer;