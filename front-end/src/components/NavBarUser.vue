<template>
    <div class="container position-absolute top-0 end-0 p-3">
      <div class="row align-items-center justify-content-end">
        <div class="col-md-6 user-info d-flex align-items-center justify-content-end">
          <!-- Foto e Informações do Usuário -->
          <div class="foto me-3">
            <img :src="usuario?.foto" alt="Foto" class="rounded-circle" style="width: 40px; height: 40px;">
          </div>
          <div>
            <div class="user-name fw-bold">{{ usuario?.nome }}</div>
            <div class="user-role text-muted">{{ usuario?.especialidade }}</div>
          </div>
        </div>
      </div>
    </div>
  
  </template>
  <script>
import { useAuthStore } from '@/store.js'
  
  export default {
    name: 'Dashbboard-home',
    setup() {
      const store = useAuthStore();
      const usuario = store.usuario.usuario; // Pega o usuário da store
      console.log(usuario)
      return {
        usuario
      };
    }
  }
  </script>
  <style>
  .btn {
    margin: 10px;
    background-color: #00692b;
    color: rgb(255, 255, 255);
  }
  </style>