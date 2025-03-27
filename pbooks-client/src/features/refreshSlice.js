import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    needsRefresh: false,
};

const refreshSlice = createSlice({
    name: "refresh",
    initialState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        setNeedsRefresh(state) {
            state.needsRefresh = !state.needsRefresh;
        },
    },
});

export const { setToken, refresh } = refreshSlice.actions;
export default refreshSlice.reducer;