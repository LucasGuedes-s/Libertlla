import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    usuario: null,
  }),
  getters: {
    getUser: (state) => state.usuario,
    getToken: (state) => state.token,
  },
  actions: {
    setAuthData(user, token) {
      this.usuario = user;
      this.token = token;
    },
    clearAuthData() {
      this.usuario = null;
      this.token = null;
    },
    login(user, token) {
      this.setAuthData(user, token);
    },
    logout() {
      this.clearAuthData();
    },
  },
});
