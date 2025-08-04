<template>
  <div v-if="visivel" :key="modalKey" class="modal-overlay modal-arquivadas-overlay">
    <div class="modal-content">
      <div class="quadrado">
        <h1 class="titulo mb-4">Denúncias Arquivadas</h1>
      </div>

      <!-- FILTROS -->
      <div class="filtros-wrapper d-flex justify-content-between align-items-end flex-wrap mb-4 conteudo-modal">
        <div class="filtro-item">
          <label class="form-label">Tipo:</label>
          <select v-model="filtro.tipo" class="form-select">
            <option value="">Todos</option>
            <option value="conversa">Conversa</option>
            <option value="ocorrencia">Ocorrência</option>
          </select>
        </div>
        <div class="filtro-item">
          <label class="form-label">Mês:</label>
          <select v-model="filtro.mes" class="form-select">
            <option value="">Todos</option>
            <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div class="filtro-item">
          <label class="form-label">Ano:</label>
          <select v-model="filtro.ano" class="form-select">
            <option value="">Todos</option>
            <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">{{ ano }}</option>
          </select>
        </div>
        <div class="filtro-item">
          <label class="form-label">⠀</label>
          <button class="botaolimpar" @click="limparFiltros">Limpar Filtros</button>
        </div>
      </div>

      <div class="conteudo-modal">
        <div class="loading-wrapper" v-if="carregando">
          <div class="spinner"></div>
          <p>Carregando ocorrências...</p>
        </div>

        <div v-else-if="!ocorrencias.length && !conversas.length" class="nenhuma-encontrada-wrapper">
          <p class="nenhuma-encontrada">Nenhuma ocorrência ou conversa arquivada encontrada.</p>
        </div>

        <template v-else>
          <!-- Ocorrências -->
          <div class="ocorrencias-wrapper" v-if="ocorrenciasFiltradas.length">
            <div class="info_arquivadas" v-for="ocorrencia in ocorrenciasFiltradas" :key="ocorrencia.id">
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

          <!-- Conversas -->
          <div v-if="conversasFiltradas.length">
            <div class="info_arquivadas" v-for="conversa in conversasFiltradas" :key="conversa.id">
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

          <div v-if="!ocorrenciasFiltradas.length && !conversasFiltradas.length">
            <p class="nenhuma-encontrada">Nenhuma conversa ou ocorrência encontrada com os filtros aplicados.</p>
          </div>
        </template>
      </div>

      <button class="btn-fecharDesarquivadas" @click="$emit('fechar')">Fechar</button>
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
  data() {
    return {
      filtro: {
        tipo: '',
        mes: '',
        ano: '',
      },
    };
  },
  computed: {
    conversasFiltradas() {
      return this.conversas.filter(registro => {
        const data = new Date(registro.data);
        const condTipo = this.filtro.tipo === '' || this.filtro.tipo === 'conversa';
        const condMes = this.filtro.mes === '' || (data.getMonth() + 1) === Number(this.filtro.mes);
        const condAno = this.filtro.ano === '' || data.getFullYear() === Number(this.filtro.ano);
        return condTipo && condMes && condAno;
      });
    },
    ocorrenciasFiltradas() {
      return this.ocorrencias.filter(registro => {
        const data = new Date(registro.data_denuncia);
        const condTipo = this.filtro.tipo === '' || this.filtro.tipo === 'ocorrencia';
        const condMes = this.filtro.mes === '' || (data.getMonth() + 1) === Number(this.filtro.mes);
        const condAno = this.filtro.ano === '' || data.getFullYear() === Number(this.filtro.ano);
        return condTipo && condMes && condAno;
      });
    },
    anosDisponiveis() {
      const anosConversas = this.conversas.map(r => new Date(r.data)).filter(d => !isNaN(d)).map(d => d.getFullYear());
      const anosOcorrencias = this.ocorrencias.map(r => new Date(r.data_denuncia)).filter(d => !isNaN(d)).map(d => d.getFullYear());
      return [...new Set([...anosConversas, ...anosOcorrencias])].sort();
    },
  },
  methods: {
    formatDate,
    limparFiltros() {
      this.filtro.tipo = '';
      this.filtro.mes = '';
      this.filtro.ano = '';
    },
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
  padding: 0;
  border-radius: 8px;
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.conteudo-modal {
  padding: 20px;
  box-sizing: border-box;
}

.quadrado {
  background-color: #54123F;
  color: white;
  width: 100%;
  padding: 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
}

.quadrado .titulo {
  margin: 0;
  font-size: 24px;
  color: white;
  font-family: "Montserrat", sans-serif;
}

.ocorrencias-wrapper {
  position: relative;
  z-index: 1;
}

.info_arquivadas {
  border: 1px solid #d3d3d3b6;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fefefe;
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

.btn-desarquivar {
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #7e7e7e;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  font-family: "Montserrat", sans-serif;
}

.btn-fecharDesarquivadas {
  margin: -10px 20px 20px 20px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #7e7e7e;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  font-family: "Montserrat", sans-serif;
  box-sizing: border-box;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
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

.filtros-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
}

.filtro-item {
  flex: 1 1 250px;
  min-width: 180px;
}

.form-label {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  margin-bottom: 5px;
  display: block;
  color: #333;
}

.form-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.botaolimpar {
  width: 100%;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #7e7e7e;
  border-radius: 5px;
  font-size: 14px;
  padding: 10px 20px;
  font-family: "Montserrat", sans-serif;
  margin-top: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.botaolimpar:hover {
  background-color: #eaeaea;
}
</style>