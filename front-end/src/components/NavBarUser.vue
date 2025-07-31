<template>
  <div class="container position-absolute top-0 end-0 p-3">
    <div class="row align-items-center justify-content-end">
      <div
        class="col-md-6 user-info d-flex align-items-center justify-content-end"
        style="cursor: pointer;"
        @click="mostrarModal = true"
      >
        <div class="foto me-3">
          <img
            :src="usuario?.foto"
            alt="Foto"
            class="rounded-circle"
            style="width: 40px; height: 40px;"
          />
        </div>
        <div>
          <div class="user-name fw-bold">{{ usuario?.nome }}</div>
          <div class="user-role text-muted">{{ usuario?.especialidade }}</div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="mostrarModal = false">
      <div class="modal-content modal-direita">
        <h2>Suas Informações</h2>

        <div class="detalhe-foto-centralizada">
          <img :src="usuario?.foto" alt="Foto do usuário" />
        </div>

        <div class="campo">
          <strong>Nome:</strong>
          <div class="detalhe">{{ usuario?.nome }}</div>
        </div>
        <div class="campo">
          <strong>Email:</strong>
          <div class="detalhe">{{ usuario?.email }}</div>
        </div>
        <div class="campo">
          <strong>Especialidade:</strong>
          <div class="detalhe">{{ usuario?.especialidade }}</div>
        </div>

        <button class="btn-fechar" @click="mostrarModal = false">Fechar</button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useAuthStore } from '@/store.js';

export default {
  name: 'Dashbboard-home',
  setup() {
    const store = useAuthStore();
    const usuario = store.usuario.usuario;
    const mostrarModal = ref(false);

    return {
      usuario,
      mostrarModal,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.0);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  z-index: 1000;
  padding-top: 20px;
}

.modal-content {
  background: white;
  padding: 24px 32px;
  border-radius: 10px;
  width: 380px;
  max-height: 90vh;
  max-width: 90%;
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  overflow-y: auto;
  border: 2px solid #9B287B; /* ✅ Borda roxa adicionada */
}

.modal-content h2 {
  margin-bottom: 16px;
  color: #9B287B;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.detalhe-foto-centralizada {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.detalhe-foto-centralizada img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #9B287B;
}

.campo {
  width: 100%;
  margin-bottom: 10px;
}

.campo strong {
  color: #2d3748;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.detalhe {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 15px;
  color: #333;
}

.btn-fechar {
  margin-top: 16px;
  background-color: #9B287B;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 20px;
    margin-right: 0;
  }
}
</style>
