import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  infos: { pseudo: "non connecté", avatar: "", email: "", role: "" },
  isSessionChecked: false,
  roles: { isAdmin: false, isModerator: false },
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
    setSessionChecked(state, action) {
      state.isSessionChecked = action.payload;
    },
    updateAvatar(state, action) {
      state.infos.avatar = action.payload;
    },
    setAdmin(state, action) {
      state.roles.isAdmin = action.payload
    },
    setModerator(state, action) {
      state.roles.isModerator = action.payload
    },
  },
});

export const { login, logout, setSessionChecked, updateAvatar, setAdmin, setModerator } = userSlice.actions;

export default userSlice.reducer;
