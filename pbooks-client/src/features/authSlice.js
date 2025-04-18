import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  infos: { pseudo: "non connecté", avatar: "", email: "", role: "" },
  isSessionLogin: true,
  roles: { isAdmin: false, isModerator: false },
  // login: false,
  loading: false,
  noSession: false,
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
      state.infos.role = action.payload.role;
      state.infos.theme = action.payload.theme;
      state.infos.id = action.payload.id;
      state.noSession = false;
    },
    logout(state) {
      state = initialState;
      return state;
    },
    setLoader(state, action) {
      state.loading = action.payload;
    },
    setNoSession(state, action) {
      state.noSession = action.payload;
    },
    updateAvatar(state, action) {
      state.infos.avatar = action.payload;
    },
    setAdmin(state, action) {
      state.roles.isAdmin = action.payload;
    },
    setModerator(state, action) {
      state.roles.isModerator = action.payload;
    },
    setTheme(state, action) {
      state.infos.theme = action.payload;
    }
  },
});

export const {
  login,
  logout,
  updateAvatar,
  setAdmin,
  setModerator,
  setLoader,
  setNoSession,
  setTheme,
} = userSlice.actions;

export default userSlice.reducer;
