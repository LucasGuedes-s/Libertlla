import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import FormularioDenunciaView from '@/views/FormularioDenunciaView.vue'
import MinhasOcorrenciasView from '@/views/MinhasOcorrencias.vue'
import DashboardView from '@/views/DashboardView.vue'
import RedifinirSenhaView from '@/views/RedifinirSenhaView.vue'
import RedifinirSenhaProfissionalView from '@/views/RedifinirSenhaProfissionalView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/chat',
    name: 'chat',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/ChatView.vue')
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/senha',
    name: 'senha',
    component: RedifinirSenhaView
  },
  {
    path: '/profissional_senha',
    name: 'profissional_senha',
    component: RedifinirSenhaProfissionalView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/formulariodedenuncia',
    name: 'formulariodedenuncia',
    component: FormularioDenunciaView,
  },
  {
    path: '/loginprofissional',
    name: 'loginprofissional',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/cadastrarprofissional',
    name: 'cadastrarprofissional',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/CadastrarProfissionalView.vue')
  },
  {
    path: '/imagem',
    name: 'imagem',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/uploadImg.vue')
  },
  {
    path: '/minhasocorrencias',
    name: 'minhasocorrencias',
     // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: MinhasOcorrenciasView
  },
  {
    path: '/ocorrencia/:id',
    name: 'ocorrencia',
    props: true, // Passa o ID como prop para o componente
     // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/OcorrenciaView.vue')
  },
  {
    path: '/conversa/:id',
    name: 'conversa',
    props: true, // Passa o ID como prop para o componente
     // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/conversaView.vue')
  },
  {
    path: '/nao-autorizado',
    name: 'nao-autorizado',
     // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/NaoAutorizadoView.vue')
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/RelatoriosView.vue')
  },
  {
    path: '/denunciasbotaodepanico',
    name: 'denunciasbotaodepanico',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/DenunciasBotaodePanicoView.vue')
  },
    {
    path: '/cadastrar-vitima',
    name: 'cadastrar-vitima',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/CadastrarVitimaView.vue')
  },

];


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router;
