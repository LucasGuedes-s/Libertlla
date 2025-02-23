<template>
  <div class="chat-container-denunciante">
    <h2>Denúncia Anônima</h2>
    <div v-if="!chatAceito" class="chat-initial">
      <button @click="requestChat">Iniciar Chat</button>
    </div>
    <div v-if="chatAceito" class="chat-window">
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
        >
          <strong v-if="message.from">{{ message.from }}:</strong> {{ message.content }}
        </div>
      </div>

      <div class="chat-input-container">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="Digite sua mensagem..."
          type="text"
        />
        <button @click="sendMessage">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export default {
  name: "chat-user",
  data() {
    return {
      socket: null,
      nome: "Anonimo",
      inputMessage: "",
      messages: [],
      chatAceito: false,
      waitingAlert: null,
    };
  },
  mounted() {
    this.socket = io("http://localhost:3000");

    this.socket.on("chat accepted", () => {
      this.chatAceito = true;
      if (this.waitingAlert) {
        this.waitingAlert.close();
      }
    });

    this.socket.on("chat message", (msg) => {
      if (msg && msg.content) {
        this.messages.push(msg);
      }
    });
    
    this.socket.on("admin disconnected", (data) => {
      Swal.fire({
        title: "Profissional desconectado!",
        text: data.message,
        icon: "warning",
        confirmButtonText: "OK",
      });

      this.chatAceito = false;
      this.messages = []; // Limpa o chat
    });
  },
  methods: {
    requestChat() {
      if (this.nome.trim()) {
        this.socket.emit("request chat", this.nome);
        
        this.waitingAlert = Swal.fire({
          title: "Aguardando aceitação...",
          text: "Aguarde um administrador aceitar o chat.",
          allowOutsideClick: false,
          showConfirmButton: false,
          willClose: () => {
            this.waitingAlert = null;
          }
        });
      }
    },
    sendMessage() {
      if (this.inputMessage.trim()) {
        const message = {
          from: this.nome,
          content: this.inputMessage,
        };
        this.socket.emit("chat message", message);
        this.messages.push(message);
        this.inputMessage = "";
      }
    },
  },
};
</script>

<style scoped>
 :global(body) { 
  background-color: #4D1032; 
}

/* Contêiner principal */
.chat-container-denunciante {
  max-width: 80%;
  height: 50%;
  margin: 50px auto;
  border-radius: 10px;
  overflow: hidden;
  background-color:rgb(255, 255, 255); /* Fundo do contêiner principal */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  flex-direction: column;
}

/* Cabeçalho */
.chat-container-denunciante h2 {
  background-color: #802062; /* Fundo do cabeçalho */
  color: #fff;
  text-align: center;
  padding: 15px;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

/* Tela inicial do chat */
.chat-initial {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.chat-initial input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
}

.chat-initial button {
  width: 40%;
  padding: 10px;
  border: none;
  border-radius: 20px;
  background-color: #802062;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.chat-initial button:hover {
  background-color: #993374;
}

/* Janela de mensagens */
.chat-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 500px;
}

/* Área das mensagens */
.messages {
  flex: 1;
  background-color: #fff;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.message:nth-child(odd) {
  align-self: flex-start;
  background-color: #f5f5f5;
  color: #333;
}

.message:nth-child(even) {
  align-self: flex-end;
  background-color: #e0bee4;
  color: #4b2046;
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
</style>
