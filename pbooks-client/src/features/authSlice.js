import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: false,
    infos: {pseudo: "non connecté", avatar: "", email: ""},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action) {
            state.isLogged = true;
            state.infos.pseudo = action.payload.pseudo;
            state.infos.avatar = action.payload.avatar;
            state.infos.email = action.payload.email;
            state.infos.id = action.payload.id;
        },
        logout() {
            return initialState;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;