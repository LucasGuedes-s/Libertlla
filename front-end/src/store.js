import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    usuario: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.usuario,
    getToken: (state) => state.token,
  },
  actions: {
    setAuthData(user, token) {
      this.usuario = user;
      this.token = token;
      
      // Salvar no localStorage e nos cookies
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(user));

      Cookies.set('token', token, { expires: 1 }); // Expira em 1 dias
      Cookies.set('usuario', JSON.stringify(user), { expires: 7 });
    },
    clearAuthData() {
      this.usuario = null;
      this.token = null;
      // Remover do localStorage e dos cookies
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      Cookies.remove('token');
      Cookies.remove('usuario');
    },
    login(user, token) {
      this.setAuthData(user, token);
    },
    logout() {
      this.clearAuthData();
    },
    loadFromLocalStorage() {
      // Carregar dados do localStorage
      let token = localStorage.getItem('token');
      let user = JSON.parse(localStorage.getItem('usuario'));      
      // Se não encontrar no localStorage, tenta nos cookies
      if (!token || !user) {
        token = Cookies.get('token');
        user = JSON.parse(Cookies.get('usuario') || null);
      }

      if (token && user) {
        this.setAuthData(user, token);
      }
    },
  },
});
