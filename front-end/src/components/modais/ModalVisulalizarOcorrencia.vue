<template>
  <div v-if="modalVisible" class="modal-overlay" @click.self="fecharModal">
    <div class="modal-content">
      <div class="quadrado">
        <h1 class="titulo mb-4">Ocorrência - {{ ocorrencia.id }}</h1>
      </div>

      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Data:</label>
          <input class="form-control" :value="formatDate(ocorrencia.data_denuncia)" readonly />
        </div>
        <div class="mb-3">
          <label class="form-label">Tipo de violência:</label>
          <input class="form-control" :value="ocorrencia.tipo_violencia" readonly />
        </div>
        <div class="mb-3">
          <label class="form-label">Relação com a Pessoa Denunciada:</label>
          <input class="form-control" :value="ocorrencia.agressor" readonly />
        </div>
        <div class="mb-3">
          <label class="form-label">Local do Ocorrido:</label>
          <input class="form-control" :value="ocorrencia.local" readonly />
        </div>

        <div class="mb-3">
          <label class="form-label">Descrição:</label>
          <textarea class="form-control no-resize" rows="3" readonly>{{ ocorrencia.descricao }}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Provas:</label>
            <input class="form-control" rows="3" v-model="ocorrencia.provas" readonly>
          </div>

        <div class="mb-3">
          <label class="form-label">Endereço da vítima:</label>
          <input class="form-control" :value="ocorrencia.endereco_vitima" readonly />
        </div>
      </div>

      <div class="modal-button">
        <button class="abrirModal" @click="fecharModal">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/dataformatar";

export default {
  name: "ModalOcorrencia",
  props: {
    modalVisible: {
      type: Boolean,
      required: true,
    },
    ocorrencia: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  methods: {
    formatDate
  },
  methods: {
    formatDate(dataString) {
      const data = new Date(dataString);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },
    fecharModal() {
      this.$emit('fechar');
    }
  }
};
</script>

<style scooped>
.titulo {
  margin: 0;
  font-size: 24px;
  color: white;
  text-align: center;
  font-family: "Montserrat", sans-serif;
}


.buttons {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.detalhar-btn,
.aceitar-btn {
  flex: 1;
  padding: 10px 20px;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  color: #7E7E7E;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Montserrat', sans-serif;
  color: #7E7E7E;
}

.modal-content {
  background: white !important;
  padding: 20px;
  border-radius: 8px;
  width: 90vw;
  max-width: 800px;
  height: auto;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 80px;
}

.modal-content form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 60px;
}

.card-body .form-control {
  font-family: 'Montserrat', sans-serif;
  color: rgba(152, 152, 152, 255);
}

.abrirModal {
  flex: 1;
  padding: 10px 20px;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  color: #7E7E7E;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
}

.modal-button {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.quadrado {
  background-color: #54123F;
  color: white;
  width: 100%;
  height: 60px;
  top: 0px;
  left: 0px;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
}

.quadrado .titulo {
  margin: 0;
  font-size: 24px;
  color: white;
  padding: 0;
  text-align: center;
  padding-top: 20px;
  font-family: "Montserrat", sans-serif;
}
.no-resize {
  resize: none;
}
</style>