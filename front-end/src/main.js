import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia, setActivePinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useAuthStore } from './store';


const pinia = createPinia();
setActivePinia(pinia); // 🔹 Ativa o Pinia antes de usá-lo!

Vue.config.productionTip = false;

const app = new Vue({
  router,
  pinia, // 🔹 Agora o Pinia está registrado corretamente
  render: (h) => h(App),
}).$mount('#app');

// 🔹 Agora chamamos a store APÓS a inicialização do Vue!
const authStore = useAuthStore();
authStore.loadFromLocalStorage();
