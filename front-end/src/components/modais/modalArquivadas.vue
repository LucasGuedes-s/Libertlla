<template>
  <div v-if="visivel" :key="modalKey" class="modal-overlay modal-arquivadas-overlay">
    <div class="modal-content">
      <div class="quadrado">
        <h1 class="titulo mb-4">Denúncias Arquivadas</h1>
      </div>

      <div class="loading-wrapper" v-if="carregando">
        <div class="spinner"></div>
        <p>Carregando ocorrências...</p>
      </div>

      <div v-else-if="!ocorrencias.length && !conversas.length" class="nenhuma-encontrada-wrapper">
        <p class="nenhuma-encontrada">Nenhuma ocorrência ou conversa arquivada encontrada.</p>
      </div>

      <template v-else>
        <div class="ocorrencias-wrapper" v-if="ocorrencias.length">
          <div class="info_arquivadas border rounded p-4 mb-3" :class="{ 'primeira-ocorrencia': index === 0 }"
            v-for="(ocorrencia, index) in ocorrencias" :key="ocorrencia.id">
            <div class="denuncia">
              <h1 class="titulo-ocorrencia">Ocorrência {{ ocorrencia.id }}</h1>
            </div>
            <div class="denuncia">
              <label>Data:</label>
              <p>{{ formatDate(ocorrencia.data_denuncia) }}</p>
            </div>
            <div class="denuncia">
              <label>Tipo de Violência:</label>
              <p>{{ ocorrencia.tipo_violencia }}</p>
            </div>
            <div class="denuncia">
              <label>Descrição:</label>
              <p>{{ ocorrencia.descricao }}</p>
            </div>

            <button class="btn-desarquivar" @click="$emit('desarquivar', ocorrencia.id)">
              Desarquivar
            </button>
          </div>
        </div>
        
        <div v-if="conversas.length">
          <div class="info_arquivadas border rounded p-4 mb-3" :class="{ 'primeira-ocorrencia': index === 0 }"
            v-for="(conversa, index) in conversas" :key="conversa.id">
            <div class="denuncia">
              <h1 class="titulo-ocorrencia">Conversa</h1>
            </div>
            <div class="denuncia">
              <label>ID da Conversa:</label>
              <p>{{ conversa.id }}</p>
            </div>
            <div class="denuncia">
              <label>Tipo de Denúncia:</label>
              <p>Chat</p>
            </div>

            <button class="btn-desarquivar" @click="$emit('desarquivarConversa', conversa.id)">
              Desarquivar
            </button>
          </div>
        </div>
      </template>

      <div class="modal-actions">
        <button class="btn-fecharDesarquivadas" @click="$emit('fechar')">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/dataformatar";

export default {
  props: {
    visivel: Boolean,
    ocorrencias: Array,
    conversas: Array,
    modalKey: Number,
    carregando: Boolean,
  },
  methods: {
    formatDate,
  },
};
</script>

<style scoped>
.modal-arquivadas-overlay {
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.quadrado {
  background-color: #54123F;
  color: white;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.quadrado .titulo {
  margin: 0;
  font-size: 24px;
  color: white;
  font-family: "Montserrat", sans-serif;
  padding-top: 20px;
}

.info_arquivadas {
  border-color: #d3d3d3b6;
  border-style: solid;
  padding: 20px;
}

.primeira-ocorrencia {
  margin-top: 60px;
}

.denuncia {
  margin-bottom: 15px;
}

.denuncia label {
  display: block;
  margin-bottom: 5px;
  color: rgba(152, 152, 152, 255);
  font-family: "Montserrat", sans-serif;
}

.denuncia p {
  margin-top: 5px;
  color: #7E7E7E;
  padding: 5px;
  border: 1px solid #d3d3d3b6;
  border-radius: 4px;
  font-family: "Montserrat", sans-serif;
}

.titulo-ocorrencia {
  color: #9b287b;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 20px;
}

.btn-desarquivar,
.btn-fecharDesarquivadas {
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #7e7e7e;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  font-family: "Montserrat", sans-serif;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  margin-bottom: 30px;
  gap: 10px;
  flex-direction: row;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9B287B;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.nenhuma-encontrada-wrapper {
  text-align: center;
  padding: 40px 20px;
  margin-top: 40px; 
}

.nenhuma-encontrada {
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  color: #7e7e7e;
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

</style>
