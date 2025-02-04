import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const pinia = createPinia();

Vue.config.productionTip = false;

new Vue({
  router,
  pinia, // Usa o Pinia no Vue 2
  render: (h) => h(App),
}).$mount('#app');
