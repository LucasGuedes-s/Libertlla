<template>
  <div class="dashboard">
    <div class="d-flex">
      <SideBar />

      <div class="container">
        <div class="titulo-principal">Minhas Ocorrências</div>

        <div v-if="loadingOcorrencias || loadingConversas" class="loading-wrapper">
          <div class="spinner"></div>
        </div>

        <div v-else>
          <template v-if="ocorrencias.length === 0 && conversas.length === 0">
            <p class="nenhuma-encontrada">Nenhuma ocorrência ou conversa encontrada.</p>
          </template>

          <!-- Ocorrências -->
          <div v-if="ocorrencias.length > 0" class="div_ocorrencias">
            <div class="formulario">
              <div
                class="info border rounded p-4 row"
                v-for="ocorrencia in ocorrencias"
                :key="ocorrencia.id"
              >
                <div class="denuncia">
                  <label>Data:</label>
                  <p>{{ formatDate(ocorrencia.data_denuncia) }}</p>
                </div>
                <div class="denuncia">
                  <label>Tipo de Denúncia:</label>
                  <p>{{ ocorrencia.tipo_denuncia }}</p>
                </div>
                <div class="denuncia">
                  <label>Tipo de Violência:</label>
                  <p>{{ ocorrencia.tipo_violencia }}</p>
                </div>
                <div class="denuncia">
                  <label>Descrição:</label>
                  <p>{{ ocorrencia.descricao }}</p>
                </div>

                <div class="buttons">
                  <router-link :to="`/ocorrencia/${ocorrencia.id}`" class="detalhar-btn">Detalhar</router-link>
                  <button type="button" class="btn-vincular" @click="abrirModalVincularVitima(ocorrencia.id)">Vincular Vítima</button>
                  <button type="button" class="pdf-btn" @click="gerarPDF(ocorrencia.id)">Gerar PDF</button>
                  <button type="button" class="btn-modal" @click="abrirModalOcorrencia(ocorrencia.id)">Adicionar Progresso</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversas -->
          <div v-if="conversas.length > 0" class="div_conversas">
            <div class="formulario">
              <div
                class="info border rounded p-4 row"
                v-for="conversa in conversas"
                :key="conversa.id"
              >
                <div class="conversa">
                  <label>ID:</label>
                  <p>{{ conversa.id }}</p>
                </div>
                <div class="conversa">
                  <label>Data de Criação:</label>
                  <p>{{ formatDate(conversa.createdAt) }}</p>
                </div>
                <div class="conversa">
                  <label>Tipo de denúncia:</label>
                  <p>Chat</p>
                </div>

                <div class="buttons">
                  <router-link :to="`/conversa/${conversa.id}`" class="detalhar-btn">Detalhar</router-link>
                  <button type="button" class="btn-modal" @click="abrirModalConversa(conversa.id)">Adicionar Progresso</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Adicionar Progresso -->
      <div v-if="modalVisible" :key="modalKey" class="modal-overlay">
        <div class="modal-content">
          <div class="quadrado">
            <h1 class="titulo mb-4">Adicionar Progresso</h1>
          </div>
          <form @submit.prevent="adicionarProgresso">
            <label for="descricao">Descrição:</label>
            <textarea v-model="descricao" id="descricao" rows="4" placeholder="Adicionar descrição"></textarea>

            <div class="form-group" id="adicionar_imagem">
              <label for="imagem">Anexos:</label>
              <input type="file" id="imagem" name="imagem" accept="image/*" @change="handleFileChange" />
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-salvar">Salvar</button>
              <button type="button" class="btn-cancelar" @click="fecharModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Vincular Vítima -->
      <div v-if="modalVincularVisible" class="modal-overlay">
        <div class="modal-content">
          <div class="quadrado">
            <h3 class="titulo mb-4">Vincular Vítima</h3>
          </div>
          <form @submit.prevent="vincularVitima">
            <div class="dropdown-row">
              <label for="vitimaSelecionada">Selecione uma vítima:</label>
              <select v-model="vitimaSelecionada" id="vitimaSelecionada" class="dropdown" required>
                <option disabled value="">Selecionar</option>
                <option v-for="vitima in vitimas" :key="vitima.id" :value="vitima.id">
                  {{ vitima.nome }} - {{ vitima.email }}
                </option>
              </select>
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-salvar">Salvar</button>
              <button type="button" class="btn-cancelar" @click="fecharModalVincularVitima">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import axios from "axios";
import { useAuthStore } from "@/store.js";
import { formatDate } from "@/utils/dataformatar";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      formatDate,
      ocorrencias: [],
      conversas: [],
      modalVisible: false,
      modalKey: 0,
      descricao: "",
      anexos: [],
      file: null,
      ocorrenciaSelecionada: null,
      conversaSelecionada: null,
      store: null,
      modalVincularVisible: false,
      vitimas: [],
      vitimaSelecionada: "",
      filtroVitima: "",
      loadingOcorrencias: false,
      loadingConversas: false,
    };
  },
  computed: {
    vitimasFiltradas() {
      return this.vitimas.filter(
        (v) =>
          v.nome.toLowerCase().includes(this.filtroVitima.toLowerCase()) ||
          v.email.toLowerCase().includes(this.filtroVitima.toLowerCase())
      );
    },
  },
  mounted() {
    this.store = useAuthStore();
    this.carregarOcorrencias();
    this.getConversas();
  },
  methods: {
    abrirModalOcorrencia(id) {
      this.ocorrenciaSelecionada = id;
      this.conversaSelecionada = null;
      this.modalVisible = true;
      this.modalKey++;
    },

    abrirModalConversa(id) {
      this.conversaSelecionada = id;
      this.ocorrenciaSelecionada = null;
      this.modalVisible = true;
      this.modalKey++;
    },

    abrirModalVincularVitima(id) {
      this.ocorrenciaSelecionada = id;
      this.vitimaSelecionada = "";
      this.modalVincularVisible = true;
      this.buscarVitimas();
    },

    fecharModalVincularVitima() {
      this.modalVincularVisible = false;
      this.vitimaSelecionada = null;
      this.ocorrenciaSelecionada = null;
    },

    fecharModal() {
      this.modalVisible = false;
      this.descricao = "";
      this.anexos = [];
      this.file = null;
      this.ocorrenciaSelecionada = null;
      this.conversaSelecionada = null;
    },

    async adicionarProgresso() {
      if (!this.descricao.trim()) {
        return Swal.fire({
          icon: "warning",
          title: "Campo obrigatório",
          text: "A descrição não pode estar vazia.",
        });
      }

      let anexos = [];
      if (this.file) {
        const fileUrl = await this.uploadFile();
        if (fileUrl) anexos.push(fileUrl);
      }

      const url = this.ocorrenciaSelecionada
        ? `http://libertlla.onrender.com/progresso/ocorrencia/${this.ocorrenciaSelecionada}`
        : `http://libertlla.onrender.com/progresso/chat/${this.conversaSelecionada}`;

      try {
        await axios.post(url, { descricao: this.descricao, anexos });
        Swal.fire({
          icon: "success",
          title: "Progresso Adicionado!",
          text: "O progresso foi salvo com sucesso.",
        });
        this.fecharModal();
        this.carregarOcorrencias();
        this.getConversas();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: err.response?.data?.error || "Erro ao adicionar progresso.",
        });
      }
    },

    async uploadFile() {
      if (!this.file) return null;
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const res = await axios.post("http://libertlla.onrender.com/upload", formData);
        return res.data.fileUrl;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro no upload",
          text: "Não foi possível enviar o arquivo.",
        });
        return null;
      }
    },

    async gerarPDF(id) {
      try {
        const res = await axios({
          url: `http://libertlla.onrender.com/ocorrencia/pdf/${id}`,
          method: "GET",
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Relatório de ocorrencia.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível gerar o PDF.",
        });
      }
    },

    async carregarOcorrencias() {
      this.loadingOcorrencias = true;
      const email = this.store.usuario.usuario.email;
      const token = this.store.token;
      try {
        const res = await axios.get(`http://libertlla.onrender.com/ocorrencias/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.ocorrencias = (res.data.processos || [])
          .filter((o) => o.status !== "Arquivada")
          .sort((a, b) => new Date(b.data_denuncia) - new Date(a.data_denuncia)); 
      } catch (err) {
        console.error("Erro ao buscar ocorrências:", err);
      } finally {
        this.loadingOcorrencias = false;
      }
    },

    async getConversas() {
      this.loadingConversas = true;
      const email = this.store.usuario.usuario.email;
      const token = this.store.token;
      try {
        const res = await axios.get(`http://libertlla.onrender.com/conversas/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.conversas = res.data.conversas
          .filter((c) => c.status !== "Arquivada")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      } catch (err) {
        console.error("Erro ao buscar conversas:", err);
      } finally {
        this.loadingConversas = false;
      }
    },

    async buscarVitimas() {
      try {
        const res = await axios.get("http://libertlla.onrender.com/vitimas");
        this.vitimas = res.data;
      } catch (err) {
        Swal.fire({ icon: "error", title: "Erro", text: "Erro ao carregar vítimas." });
      }
    },

    async vincularVitima() {
      if (!this.vitimaSelecionada || !this.ocorrenciaSelecionada) {
        return Swal.fire({
          icon: "warning",
          title: "Campos obrigatórios",
          text: "Selecione uma vítima.",
        });
      }

      try {
        await axios.post(
          `http://libertlla.onrender.com/ocorrencias/${this.ocorrenciaSelecionada}/vincular-vitima`,
          { vitimaId: Number(this.vitimaSelecionada) }
        );
        Swal.fire({ icon: "success", title: "Vítima vinculada com sucesso!" });
        this.fecharModalVincularVitima();
        this.carregarOcorrencias();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: err.response?.data?.error || "Erro ao vincular vítima.",
        });
      }
    },

    handleFileChange(event) {
      this.file = event.target.files[0];
    },
  },
  components: {
    SideBar,
  },
};
</script>

<style scoped>
.dashboard {
  margin-left: 250px;
  padding: 20px;
  border-radius: 100px;
}

.titulo-principal {
  font-size: 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  margin-top: -17px;
  margin-left: 7px;
  color: #9B287B;
}

.div_ocorrencias {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.div_conversas {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.formulario {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border-radius: 10px;
}

.div_ocorrencias h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #8b2276;
  font-weight: bold;
}

p {
  color: #7E7E7E;
  border: 1px solid #d3d3d3b6;
  border-radius: 4px;
  padding: 6px;
  font-family: "Montserrat", sans-serif;
  padding: 12px;
}

label {
  font-family: "Montserrat", sans-serif;
  color: rgba(152, 152, 152, 255);
}

.denuncia {
  margin-bottom: 15px;
}

.conversa {
  margin-bottom: 15px;
}

.denuncia label {
  display: block;
  margin-bottom: 5px;
}

.denuncia p {
  margin-top: 5px;
  color: #7E7E7E;
  padding: 5px;
}

.info {
  border-color: #d3d3d3b6;
  border-style: solid;
  padding: 20px;
  margin-bottom: 20px;
}


.info_denuncia h3 {
  margin-bottom: 10px;
}


.info_denuncia p {
  margin-bottom: 8px;
  color: #7E7E7E
}


.buttons {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.detalhar-btn,
.btn-vincular,
.pdf-btn,
.btn-modal {
  background-color: rgba(245, 245, 245, 255);
  color: rgba(152, 152, 152, 255);
  border: 1px solid rgba(245, 245, 245, 255);
  border-radius: 5px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  flex: 1;
  text-align: center;
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90vw;
  max-width: 600px;
  height: auto;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modal-content form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 60px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
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

input[type="file"] {
  font-size: 14px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

#adicionar_imagem {
  grid-column: 1 / -1;
  margin-top: 20px;
  margin-bottom: 20px;
}

#imagem {
  margin-top: 10px;
}

button {
  font-size: 14px;
  padding: 8px;
  border-radius: 5px;
}

.modal-actions button {
  margin-top: -15px;
}

.btn-salvar,
.btn-cancelar {
  background-color: rgba(245, 245, 245, 255);
  color: rgba(152, 152, 152, 255);
  border: 1px solid rgba(245, 245, 245, 255);
  border-radius: 5px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  width: 49%;
}

.card-body .form-control {
  font-family: 'Montserrat', sans-serif;
  color: rgba(152, 152, 152, 255);
}

.dropdown {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  box-sizing: border-box;
}

.dropdown-row {
  margin-bottom: 20px;
}

.dropdown-row label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #9B287B;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .dashboard {
    margin-left: 0;
    padding: 10px;
  }

  .titulo-principal {
    font-size: 24px;
  }

  .div_ocorrencias {
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }

  .formulario {
    width: 100%;
    min-width: unset;
    background-color: white;
    padding: 15px;
    border-radius: 10px;
  }

  .modal-content {
    width: 90%;
  }

  .modal-actions {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .btn-salvar,
  .btn-cancelar {
    width: 100%;
    margin-bottom: 10px;
    gap: 10px;
  }

  .buttons {
    flex-direction: column;
    gap: 10px;
  }

  .detalhar-btn,
  .pdf-btn,
  .btn-modal {
    width: 100%;
  }
}
</style>