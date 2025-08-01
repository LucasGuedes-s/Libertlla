<template>
  <div class="dashboard">
    <div class="d-flex">
      <SideBar />

      <div class="container">
        <div class="titulo-principal">Minhas Ocorrências
          <button class="button_desarquivar" @click="abrirModalArquivadas">Arquivadas</button>
        </div>

        <div v-if="loadingOcorrencias || loadingConversas" class="loading-wrapper">
          <div class="spinner"></div>
        </div>

        <div v-else>
          <p v-if="ocorrencias.length === 0 && conversas.length === 0" class="nenhuma-encontrada">
            Nenhuma ocorrência ou conversa encontrada.
          </p>

          <!-- Ocorrências -->
          <div v-if="ocorrencias.length > 0" class="div_ocorrencias">
            <div class="formulario">
              <div class="info border rounded p-4 row" v-for="ocorrencia in ocorrencias" :key="ocorrencia.id">
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
                  <button type="button" class="btn-vincular" @click="abrirModalVincularVitima(ocorrencia.id)">Vincular
                    Vítima</button>
                  <button type="button" class="btn-modal"
                    @click="abrirModalVincularProfissional(ocorrencia.id)">Vincular profissional</button>
                  <button type="button" class="pdf-btn" @click="gerarPDF(ocorrencia.id)">Gerar PDF</button>
                  <button type="button" class="btn-modal" @click="abrirModalOcorrencia(ocorrencia.id)">Adicionar
                    Progresso</button>
                  <button type="button" class="btn-modal" @click="abrirModalCadastrarVisitaOcorrencia(ocorrencia.id)">
                    Cadastrar Visita
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversas -->
          <div v-if="conversas.length > 0" class="div_conversas">
            <div class="formulario">
              <div class="info border rounded p-4 row" v-for="conversa in conversas" :key="conversa.id">
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
                  <button type="button" class="btn-modal" @click="abrirModalConversa(conversa.id)">Adicionar
                    Progresso</button>
                  <button type="button" class="btn-modal" @click="abrirModalCadastrarVisitaConversa(conversa.id)">
                    Cadastrar Visita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de adicionar progresso-->
      <ModalAdicionarProgresso :visible="modalVisible" :modalKey="modalKey" @close="fecharModal"
        @submit="adicionarProgresso" />

      <!-- Componente ModalCadastrarVisita -->
      <ModalCadastrarVisita :visible="modalCadastrarVisible" :modalKey="modalKey" @close="fecharModalVisita"
        @submit="cadastrarVisita" />

      <!-- Modal de vincular vitima -->
      <ModalVincularVitima :visible="modalVincularVisible" :vitimas="vitimas" @close="fecharModalVincularVitima"
        @submit="vincularVitima" />

      <!-- Modal de vincular profissional -->
      <ModalVincularProfissional v-if="modalVincularProfissionalVisivel && ocorrenciaSelecionada !== null"
        :visible="modalVincularProfissionalVisivel" :profissionais="profissionaisFiltrados"
        :idOcorrencia="ocorrenciaSelecionada" @vincular-profissional="vincularProfissional"
        @close="fecharModalVincularProfissional" />

      <!-- Modal de Ocorrências Arquivadas -->
      <ModalArquivadas v-if="modalArquivadasVisivel" :visivel="modalArquivadasVisivel" :modalKey="modalKey"
        :ocorrencias="ocorrenciasArquivadas" :conversas="conversasArquivadas" :carregando="loadingArquivadas"
        @desarquivar="desarquivarOcorrencia" @desarquivarConversa="desarquivarConversa"
        @fechar="fecharModalArquivadas" />

    </div>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar.vue";
import ModalArquivadas from "@/components/modais/ModalArquivadas.vue"
import ModalCadastrarVisita from "@/components/modais/ModalCadastrarVisita.vue";
import ModalVincularVitima from "@/components/modais/ModalVincularVitima.vue";
import ModalVincularProfissional from "@/components/modais/ModalVincularProfissional.vue";
import ModalAdicionarProgresso from "@/components/modais/ModalAdicionarProgresso.vue";
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
      modalCadastrarVisible: false,
      modalKey: 0,
      descricao: "",
      testemunhas: "",
      assinaturas: null,
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
      modalArquivadasVisivel: false,
      ocorrenciasArquivadas: [],
      conversasArquivadas: [],
      loadingArquivadas: false,
      profissionais: [],
      profissionalSelecionado: "",
      modalVincularProfissionalVisivel: false,
    };
  },

  computed: {
    profissionaisFiltrados() {
      if (!this.profissionais || !this.store || !this.store.usuario) return [];

      const idLogado = this.store.usuario.usuario.id;

      return this.profissionais.filter(p => p.id !== idLogado);
    },
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
    this.buscarProfissionais();
  },

  methods: {
    abrirModalOcorrencia(id) {
      this.resetCampos();
      this.ocorrenciaSelecionada = id;
      this.modalVisible = true;
      this.modalKey++;
    },

    abrirModalConversa(id) {
      this.resetCampos();
      this.conversaSelecionada = id;
      this.modalVisible = true;
      this.modalKey++;
    },

    abrirModalCadastrarVisitaOcorrencia(id) {
      this.resetCampos(false);
      this.ocorrenciaSelecionada = id;
      this.conversaSelecionada = null;
      this.modalCadastrarVisible = true;
      this.modalKey++;
    },

    abrirModalCadastrarVisitaConversa(id) {
      this.resetCampos(false);
      this.conversaSelecionada = id;
      this.ocorrenciaSelecionada = null;
      this.modalCadastrarVisible = true;
      this.modalKey++;
    },

    fecharModalVisita() {
      this.modalCadastrarVisible = false;
      this.resetCampos(false);
    },

    abrirModalVincularVitima(id) {
      this.ocorrenciaSelecionada = id;
      this.vitimaSelecionada = "";
      this.modalVincularVisible = true;
      this.buscarVitimas();
    },

    fecharModalVincularVitima() {
      this.modalVincularVisible = false;
      this.vitimaSelecionada = "";
      this.ocorrenciaSelecionada = null;
    },

    fecharModal() {
      this.modalVisible = false;
      this.resetCampos();
    },

    resetCampos(resetOcorrencia = true) {
      this.descricao = "";
      this.testemunhas = "";
      this.assinaturas = null;
      this.anexos = [];
      this.file = null;
      if (resetOcorrencia) {
        this.ocorrenciaSelecionada = null;
        this.conversaSelecionada = null;
      }
    },

    handleFileChange(event) {
      const files = Array.from(event.target.files);
      this.anexos = files;
    },

    handleAssinaturaChange(event) {
      this.assinaturas = event.target.files[0];
    },

    async abrirModalArquivadas() {
      this.modalArquivadasVisivel = true;
      this.loadingArquivadas = true;

      try {
        await Promise.all([
          this.buscarOcorrenciasArquivadas(),
          this.buscarConversasArquivadas()
        ]);
      } catch (error) {
        console.error("Erro ao buscar arquivadas", error);
      } finally {
        this.loadingArquivadas = false;
      }
    },

    fecharModalArquivadas() {
      this.modalArquivadasVisivel = false;
    },

    abrirModalVincularProfissional(idOcorrencia) {
      this.ocorrenciaSelecionada = idOcorrencia;
      this.profissionalSelecionado = "";
      this.modalVincularProfissionalVisivel = true;
      this.buscarProfissionais();
    },
    fecharModalVincularProfissional() {
      this.modalVincularProfissionalVisivel = false;
      this.profissionalSelecionado = "";
      this.ocorrenciaSelecionada = null;
    },
    async buscarOcorrenciasArquivadas() {
      try {
        const email = this.store.usuario.usuario.email;
        const token = this.store.token;

        const res = await axios.get(`https://libertlla.onrender.com/ocorrencias/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.ocorrenciasArquivadas = (res.data.processos || [])
          .filter((o) => o.status === "Arquivada")
          .sort((a, b) => new Date(b.data_denuncia) - new Date(a.data_denuncia));
      } catch (error) {
        console.error("Erro ao buscar ocorrências arquivadas:", error);
        Swal.fire("Erro", "Não foi possível carregar as ocorrências arquivadas.", "error");
      }
    },

    async buscarConversasArquivadas() {
      try {
        const email = this.store.usuario.usuario.email;
        const token = this.store.token;

        const res = await axios.get(`https://libertlla.onrender.com/conversas/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.conversasArquivadas = (res.data.conversas || [])
          .filter((c) => c.status === "Arquivada")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (error) {
        console.error("Erro ao buscar conversas arquivadas:", error);
        Swal.fire("Erro", "Não foi possível carregar as conversas arquivadas.", "error");
      }
    },

    async desarquivarOcorrencia(id) {
      try {
        const token = this.store.token;

        await axios.put(
          `https://libertlla.onrender.com/ocorrencias/${id}/desarquivar`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Sucesso", "Ocorrência desarquivada com sucesso!", "success");
        this.ocorrenciasArquivadas = this.ocorrenciasArquivadas.filter((o) => o.id !== id);
        this.carregarOcorrencias();
      } catch (error) {
        console.error("Erro ao desarquivar ocorrência:", error);
        Swal.fire("Erro", "Não foi possível desarquivar a ocorrência.", "error");
      }
    },

    async desarquivarConversa(id) {
      try {
        const token = this.store.token;

        await axios.put(
          `https://libertlla.onrender.com/conversa/${id}/desarquivar`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Sucesso", "Conversa desarquivada com sucesso!", "success");

        this.conversasArquivadas = this.conversasArquivadas.filter((c) => c.id !== id);

        this.getConversas();
      } catch (error) {
        console.error("Erro ao desarquivar conversa:", error);
        Swal.fire("Erro", "Não foi possível desarquivar a conversa.", "error");
      }
    },
    async uploadFiles(files) {
      const urls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await axios.post("https://libertlla.onrender.com/upload", formData);
          urls.push(res.data.fileUrl);
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Erro no upload",
            text: "Não foi possível enviar um ou mais arquivos.",
          });
        }
      }
      return urls;
    },

    async uploadFile(file) {
      if (!file) return null;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await axios.post("https://libertlla.onrender.com/upload", formData);
        return res.data.fileUrl;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro no upload da assinatura",
          text: "Não foi possível enviar a assinatura.",
        });
        return null;
      }
    },

    async cadastrarVisita({ descricao, testemunhas, anexos, assinatura }) {
      if (!descricao.trim()) {
        return Swal.fire({
          icon: "warning",
          title: "Campo obrigatório",
          text: "A descrição não pode estar vazia.",
        });
      }

      try {
        const anexosUrls = await this.uploadFiles(anexos);
        const assinaturaUrl = await this.uploadFile(assinatura);

        const url = this.ocorrenciaSelecionada
          ? `https://libertlla.onrender.com/visita/ocorrencia/${this.ocorrenciaSelecionada}`
          : `https://libertlla.onrender.com/visita/conversa/${this.conversaSelecionada}`;

        const payload = {
          data: new Date().toISOString(),
          descricao,
          testemunhas,
          anexos: anexosUrls,
          assinatura: assinaturaUrl,
        };

        const token = this.store.token;
        await axios.post(url, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire({
          icon: "success",
          title: "Visita cadastrada com sucesso!",
        });

        this.fecharModalVisita();
        this.carregarOcorrencias();
        this.getConversas();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: err.response?.data?.error || "Erro ao cadastrar visita.",
        });
      }
    },


    async adicionarProgresso(progresso) {
      if (!progresso.descricao || !progresso.descricao.trim()) {
        return Swal.fire({
          icon: "warning",
          title: "Campo obrigatório",
          text: "A descrição não pode estar vazia.",
        });
      }

      let anexos = [];
      if (progresso.imagem) {
        anexos = await this.uploadFiles([progresso.imagem]);
      }

      const url = this.ocorrenciaSelecionada
        ? `https://libertlla.onrender.com/progresso/ocorrencia/${this.ocorrenciaSelecionada}`
        : `https://libertlla.onrender.com/progresso/chat/${this.conversaSelecionada}`;

      try {
        await axios.post(url, { descricao: progresso.descricao, anexos });
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

    async gerarPDF(id) {
      try {
        const res = await axios({
          url: `https://libertlla.onrender.com/ocorrencia/pdf/${id}`,
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
        const res = await axios.get(`https://libertlla.onrender.com/ocorrencias/${email}`, {
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
        const res = await axios.get(`https://libertlla.onrender.com/conversas/${email}`, {
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
        const res = await axios.get("https://libertlla.onrender.com/vitimas");
        this.vitimas = res.data;
      } catch (err) {
        Swal.fire({ icon: "error", title: "Erro", text: "Erro ao carregar vítimas." });
      }
    },

    async vincularVitima(vitimaId) {
      this.vitimaSelecionada = vitimaId;

      if (!this.vitimaSelecionada || !this.ocorrenciaSelecionada) {
        return Swal.fire({
          icon: "warning",
          title: "Campos obrigatórios",
          text: "Selecione uma vítima.",
        });
      }

      try {
        await axios.post(
          `https://libertlla.onrender.com/ocorrencias/${this.ocorrenciaSelecionada}/vincular-vitima`,
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
    async buscarProfissionais() {
      try {
        const res = await axios.get("https://libertlla.onrender.com/profissionais");
        this.profissionais = res.data.map(p => ({
          id: p.id,
          nome: p.nome,
          especialidade: p.especialidade
        }));
      } catch (error) {
        console.error("Erro ao carregar profissionais:", error);
        Swal.fire("Erro", "Não foi possível carregar os profissionais.", "error");
      }
    },
    async vincularProfissional({ idOcorrencia, profissional }) {
      if (!idOcorrencia || !profissional) {
        return Swal.fire("Erro", "Dados incompletos para vinculação.", "error");
      }

      try {
        const token = this.store.token;

        await axios.post('https://libertlla.onrender.com/ocorrencias/adicionar-profissional',
          {
            ocorrenciaId: idOcorrencia,
            profissionalId: profissional,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire("Sucesso", "Profissional vinculado com sucesso!", "success");
        this.modalVincularProfissionalVisivel = false;
        this.carregarOcorrencias();
      } catch (error) {
        const mensagemBackend = error.response?.data?.error || "";
        if (
          mensagemBackend.toLowerCase().includes("já está associado") ||
          mensagemBackend.toLowerCase().includes("já vinculado")
        ) {
          Swal.fire("Aviso", "Este profissional já está vinculado a esta ocorrência.", "warning");
        } else {
          console.error(error.response || error);
          Swal.fire("Erro", "Erro ao vincular profissional.", "error");
        }
      }
    }
  },
  components: {
    SideBar,
    ModalArquivadas,
    ModalCadastrarVisita,
    ModalVincularVitima,
    ModalVincularProfissional,
    ModalAdicionarProgresso,
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
  display: flex;
}

.div_ocorrencias,
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

p {
  color: #7E7E7E;
  border: 1px solid #d3d3d3b6;
  border-radius: 4px;
  padding: 12px;
  font-family: "Montserrat", sans-serif;
}

label {
  font-family: "Montserrat", sans-serif;
  color: rgba(152, 152, 152, 255);
}

.denuncia,
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

.buttons {
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

.button_desarquivar {
  background-color: #9B287B;
  color: #f5f5f5;
  font-size: 14px;
  font-weight: 500;
  padding: 0 35px;
  height: 40px;
  line-height: 40px;
  border: none;
  border-radius: 4px;
  margin-left: auto;
  display: block;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
}

textarea,
input[type="text"],
input[type="date"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: "Montserrat", sans-serif;
  color: #333;
  box-sizing: border-box;
}

textarea {
  resize: none;
}

.dashboard input::placeholder,
.dashboard textarea::placeholder {
  color: rgba(152, 152, 152, 0.7);
  font-size: 14px;
  font-weight: 400;
  padding-left: 2px;
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

button {
  font-size: 14px;
  padding: 8px;
  border-radius: 5px;
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

@media (max-width: 768px) {
  .dashboard {
    margin-left: 0;
    padding: 10px;
  }

  .titulo-principal {
    font-size: 24px;
    margin-top: 5px;
  }

  .div_ocorrencias {
    gap: 10px;
    flex-direction: column;
    align-items: center;
  }

  .formulario {
    width: 100%;
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