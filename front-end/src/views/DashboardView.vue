<template>
  <div class="dashboard">
    <NavBarUser />
    <div class="d-flex">
      <SideBar />
      <div class="container">
        <section class="section_contagemdedenuncias">
          <div class="card_contagem">
            <h3>Total de Denúncias</h3>
            <p>{{ totalDenuncias }}</p>
          </div>
          <div class="card_contagem">
            <h3>Formulário</h3>
            <p>{{ totalOcorrencias }}</p>
          </div>
          <div class="card_contagem">
            <h3>Chat</h3>
            <p>{{ totalConversas }}</p>
          </div>
          <div class="card_contagem">
            <h3>Atendidas</h3>
            <p>{{ totalAtendidas }}</p>
          </div>
        </section>
        <div class="div_ocorrencias">
          <div class="ocorrencias_formulario">
            <h2>Ocorrências por Formulário</h2>
            <div class="info_denuncia" v-for="ocorrencia in ocorrencias" :key="ocorrencia.id">
              <p><strong>Denúncia - #{{ ocorrencia.id }}</strong></p>
              <p><strong>Data:</strong> {{ formatDate(ocorrencia.data_denuncia) }} </p>
              <p><strong>Tipo de Denúncia:</strong> {{ ocorrencia.tipo_denuncia }} </p>
              <div class="buttons">
                <button type="button" class="detalhar-btn" @click="abrirModal(ocorrencia.id)">Detalhar</button>
                <button class="aceitar-btn" @click="aceitarDenuncia(ocorrencia.id)">Aceitar</button>
              </div>
            </div>
          </div>
          <div class="ocorrencias_chat">
            <h2>Ocorrências por Chat</h2>
            <div class="info_denuncia" v-for="solicitacao in solicitacoes" :key="solicitacao.socketId">
              <p><strong>Denúncia: {{ solicitacao.username }} </strong></p>
              <p><strong>Data:</strong></p>
              <p><strong>Tipo de Denúncia:</strong></p>
              <div class="buttons">
                <button class="aceitar-btn" @click="acceptChat(solicitacao.socketId)">Aceitar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Visualizar Ocorrencia -->
    <ModalVisulalizarOcorrencia :modalVisible="modalVisible" :ocorrencia="ocorrencia" @fechar="modalVisible = false" />

    <!-- Chat Container -->
    <div class="chat-container" v-if="isChatActive" ref="chatContainer">
      <h3>Chat Ativo</h3>
      <button class="close-chat" @click="endChat">&times;</button>
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message.from }}: {{ message.content }}
        </div>
      </div>
      <div class="chat-input-container">
        <input type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="Digite sua mensagem..." />
        <button @click="sendMessage">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import ModalVisulalizarOcorrencia from '@/components/modais/ModalVisulalizarOcorrencia.vue';
import axios from 'axios';
import { useAuthStore } from '@/store.js'
import { io } from "socket.io-client";
import { formatDate } from '@/utils/dataformatar';
import Swal from 'sweetalert2';
import router from '@/router';
import NavBarUser from '@/components/NavBarUser.vue';

export default {
  setup() {
    const store = useAuthStore();
    return {
      store
    };
  },
  data() {
    return {
      formatDate,
      ocorrencias: [],
      ocorrencia: {},
      modalVisible: false,
      chatAtivo: false,
      modalkey: 0,
      socket: null,
      inputMessage: "",
      messages: [],
      solicitacoes: [],
      isChatActive: false,
      activeClient: null, // ID do cliente com o qual está interagindo
      totalDenuncias: 0,
      totalOcorrencias: 0,
      totalConversas: 0,
      totalAtendidas: 0,
      intervalId: null
    };
  },
  mounted() {
    if (this.store.token == null) {
      window.location.href = '/nao-autorizado';
    }
    else {
      this.buscarOcorrencias();
      this.buscarTotalDenuncias();
    }

    this.socket = io("https://libertlla.onrender.com");

    this.socket.on("nova_ocorrencia", () => {
      this.buscarOcorrencias(); // Atualiza a lista
    });

    const adminEmail = this.store.usuario.usuario.email
    // Envia sinal de que é o admin
    this.socket.emit('admin connect', adminEmail);

    // Recebe solicitações de chat
    this.socket.on("chat request", (request) => {
      this.solicitacoes.push(request);
    });

    // Remove solicitações atendidas
    this.socket.on("chat taken", ({ clientSocketId }) => {
      this.solicitacoes = this.solicitacoes.filter(req => req.socketId !== clientSocketId);
    });

    // Recebe mensagens do servidor
    this.socket.on("chat message", (msg) => {
      this.messages.push(msg);
    });

    // Notifica o administrador se o chat terminar
    this.socket.on("chat ended", ({ clientSocketId }) => {
      this.solicitacoes = this.solicitacoes.filter(req => req.socketId !== clientSocketId);
      console.log(this.solicitacoes)
      Swal.fire({
        icon: 'error',
        title: 'Usuário foi desconectado',
        timer: 4000,
      });

      this.endChat();
    });

  },
  methods: {
    async abrirModal(id) {
      try {
        const token = this.store.token;
        const response = await axios.get(`https://libertlla.onrender.com/ocorrencia/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.ocorrencia) {
          this.ocorrencia = response.data.ocorrencia;
          this.ocorrencia.id = id;
          this.modalVisible = true;
          this.modalkey++;
        } else {
          console.warn("Nenhuma ocorrência encontrada para o ID:", id);
        }
      } catch (error) {
        console.error('Erro ao buscar ocorrência:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar detalhes da ocorrência',
          text: 'Tente novamente mais tarde.',
        });
      }
    },
    fecharModal() {
      this.modalVisible = false;
      this.ocorrencia = {};
    },
    async buscarOcorrencias() {
      try {
        const token = this.store.token;
        if (!token) {
          this.$router.push('/nao-autorizado');
          return;
        }
        const response = await axios.get("https://libertlla.onrender.com/ocorrencias", {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.ocorrencias = response.data.ocorrencias;
      } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
        if (error.response && error.response.status === 403) {
          this.$router.push('/nao-autorizado');
        }
      }
    },
    async aceitarDenuncia(id) {
      try {
        const user = this.store.usuario.usuario;
        const email = user.email;
        const token = this.store.token;

        await axios.post("https://libertlla.onrender.com/aceitar/ocorrencia", {
          ocorrenciaId: id,
          profissionalEmail: email
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.buscarOcorrencias();
        Swal.fire({
          icon: 'success',
          title: 'Ocorrência aceita com sucesso',
          timer: 4000,
        });
      } catch (error) {
        console.error('Erro ao aceitar denúncia:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao aceitar denúncia',
          text: 'Tente novamente mais tarde.',
        });
      }
    },
    async buscarTotalDenuncias() {
      try {
        const token = this.store.token;
        const response = await axios.get("https://libertlla.onrender.com/todasocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.totalDenuncias = response.data.totalDenuncias;
        this.totalOcorrencias = response.data.totalOcorrencias;
        this.totalConversas = response.data.totalConversas;
        this.totalAtendidas = response.data.totalAtendidas;
      } catch (error) {
        console.error("Erro ao buscar total de denúncias:", error);
      }
    },
    acceptChat(socketId) {
      if (this.chatAtivo) {
        Swal.fire({
          icon: "warning",
          title: "Você já está em um atendimento!",
          text: "Termine o chat atual antes de aceitar outro.",
        });
      } else {
        this.socket.emit("accept chat", socketId);
        this.isChatActive = true;
        this.chatAtivo = true; // Marca como ocupado
        this.activeClient = socketId;
        this.requests = [];
        this.scrollToChat();
      }
    },
    sendMessage() {
      if (this.inputMessage.trim()) {
        const message = { from: 'Admin', content: this.inputMessage };
        this.socket.emit("chat message", message);
        this.messages.push(message);
        this.inputMessage = "";
      }
    },
    endChat() {
      this.isChatActive = false;
      //this.socket.emit("disconnect", socketId);
      this.chatAtivo = false; // Marca como ocupado
      this.activeClient = null;
      this.messages = [];
    }
  },
  scrollToChat() {
    this.$nextTick(() => {
      const chatContainer = this.$refs.chatContainer;
      if (chatContainer) {
        chatContainer.scrollIntoView({ behavior: "smooth" });
      }
    });
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.emit("end chat");
      this.socket.disconnect();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  components: {
    SideBar,
    NavBarUser,
    ModalVisulalizarOcorrencia
  },
};
</script>

<style scooped>
.navbaruse {
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: #54123F;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.navbaruse .titulo {
  margin: 0;
  font-size: 24px;
  color: white;
  text-align: center;
  font-family: "Montserrat", sans-serif;
}

.dashboard {
  margin-left: 250px;
  margin-top: 30px;
  padding: 20px;
  border-radius: 10px;
}

.section_contagemdedenuncias {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.card_contagem {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}


.card_contagem h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #8b2276;
}

.card_contagem p {
  font-size: 32px;
  font-weight: bold;
  color: #FF00AE;
}

.div_ocorrencias {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.ocorrencias_chat,
.ocorrencias_formulario {
  flex: 1;
  min-width: 300px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.div_ocorrencias h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #8b2276;
  font-weight: bold;
}

.info_denuncia {
  background-color: white;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
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

.chat-container {
  height: 50%;
  margin: 50px auto;
  border-radius: 10px;
  overflow: hidden;
  background-color: rgb(255, 255, 255);
  /* Fundo do contêiner principal */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  flex-direction: column;
}


.chat-container h3 {
  background-color: #802062;
  color: #fff;
  text-align: center;
  padding: 15px;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}


.messages {
  border: 1px solid #ddd;
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 10px;
  padding: 10px;
}


.message {
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.chat-input-container {
  display: flex;
  padding: 10px;
  background-color: #F5F5F5;
  align-items: center;
}


.chat-input-container input[type="text"] {
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 14px;
  margin-right: 10px;
  background-color: #fff;
}


.chat-input-container input::placeholder {
  color: #bbb;
}


.chat-input-container button {
  background-color: #802062;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  width: 80px;
}


.chat-input-container button:hover {
  background-color: #993374;
}

@media (max-width: 768px) {
  .dashboard {
    margin-left: 0;
    padding: 10px;
  }


  .section_contagemdedenuncias {
    grid-template-columns: repeat(2, 1fr);
  }


  .div_ocorrencias {
    flex-direction: column;
    gap: 15px;
  }


  .card_contagem p {
    font-size: 24px;
  }
}
</style>