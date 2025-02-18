<template>
  <div class="dashboard">
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
                <button class="detalhar-btn">Detalhar</button>
                <button class="aceitar-btn" @click="aceitarDenuncia(ocorrencia.id)">Aceitar</button>
              </div>
            </div>
          </div>
          <div class="ocorrencias_chat">
            <h2>Ocorrências por Chat</h2>
            <div class="info_denuncia" v-for="(solicitacao, index) in solicitacoes" :key="index">
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
    <div class="chat-container">
      <div v-if="isChatActive">
        <h3>Chat Ativo</h3>
        <button class="close-chat" @click="endChat">&times;</button>
        <div class="messages">
          <div v-for="(message, index) in messages" :key="index" class="message">
            {{ message.from }} {{ message.content }}
          </div>
        </div>
        <div class="chat-input-container">
          <input type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="Digite sua mensagem..." />
          <button @click="sendMessage">Enviar</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scooped>
.close-chat {
  background: none;
  border: none;
  color: #8b2276;
  font-size: 24px;
  cursor: pointer;
}


.dashboard {
  margin-left: 250px;
  padding: 20px;
  border-radius: 100px;
}


.section_contagemdedenuncias {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
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
  /* Fundo do cabeçalho */
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


/* Input e botão de envio */
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


<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
import { useAuthStore } from '@/store.js'
import { io } from "socket.io-client";
import { formatDate } from '@/utils/dataformatar';
import Swal from 'sweetalert2';
import router from '@/router';


export default {
  setup() {
    const store = useAuthStore()
    return {
      store
    }
  },
  data() {
    return {
      formatDate,
      ocorrencias: [],
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
    };
  },
  mounted() {
    this.buscarOcorrencia();
    this.buscarTotalDenuncias();


    const usuario = this.store.usuario
    console.log(usuario)


    this.socket = io("http://localhost:3000");


    // Envia sinal de que é o admin
    this.socket.emit("admin connect");


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
    this.socket.on("chat ended", (reason) => {
      Swal.fire({
        icon: 'error',
        title: 'Usuário foi desconectado',
        timer: 4000,
      })
      this.endChat();
    });
  },
  methods: {
    async buscarOcorrencia() {
      const token = this.store.token


      axios.get("http://localhost:3000/ocorrencias", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        this.ocorrencias = response.data.ocorrencias
      }).catch(error => {
        console.log(error.status)
        if(error.status === 403 || error.status === 401){
          router.push('/nao-autorizado')
        }
        console.error('Erro ao buscar ocorrências:', error);
      });
    },
    async aceitarDenuncia(id) {
      const user = this.store.usuario.usuario
      const email = user.email
      const token = this.store.token


      await axios.post("http://localhost:3000/aceitar/ocorrencia", {
        ocorrenciaId: id,
        profissionalEmail: email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        this.buscarOcorrencia();
        Swal.fire({
          icon: 'success',
          title: 'Ocorrência aceita com sucesso',
          timer: 4000,
        })
      }).catch(error => {
        if(error.status === 403 || error.status === 401){
          router.push('/nao-autorizado')
        }
        Swal.fire({
          icon: 'error',
          title: 'Erro ao aceitar denúncia',
          timer: 4000,
        })
      });
    },
    async buscarTotalDenuncias() {
      const token = this.store.token;
      try {
        const response = await axios.get("http://localhost:3000/todasocorrencias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.totalDenuncias = response.data.totalDenuncias; // Atualiza o estado
        this.totalOcorrencias = response.data.totalOcorrencias; // Formulário
        this.totalConversas = response.data.totalConversas; // Chat
        this.totalAtendidas = response.data.totalAtendidas;
      } catch (error) {
        console.error("Erro ao buscar total de denúncias:", error);
      }
    },
    acceptChat(socketId) {
      // Aceita a solicitação de chat
      this.socket.emit("accept chat", socketId);
      this.isChatActive = true;
      this.activeClient = socketId; // Armazena o ID do cliente
      this.requests = []; // Limpa as solicitações
    },
    sendMessage() {
      if (this.inputMessage.trim()) {
        const message = {
          from: 'Admin',
          content: this.inputMessage
        };
        this.socket.emit("chat message", message); // Envia para o servidor
        this.messages.push(message); // Adiciona localmente no admin
        this.inputMessage = ""; // Limpa o campo de entrada
      }
    },
    endChat() {
      // Encerra o chat ativo
      this.isChatActive = false;
      this.activeClient = null;
      this.messages = [];
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  components: {
    SideBar,
  },
}
</script>

