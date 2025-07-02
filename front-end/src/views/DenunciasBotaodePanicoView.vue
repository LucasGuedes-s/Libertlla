<template>
  <div class="denunciasapp">
    <NavBarUser />
    <div class="d-flex">
      <SideBar />
      <div class="container">
        <h1>Notificações do Botão de Pânico</h1>

        <div
          v-for="notificacao in notificacoes"
          :key="notificacao.id"
          class="notificacao-card"
        >
          <h2>Nova ocorrência</h2>
          <p><strong>Data:</strong> {{ formatarData(notificacao.data) }}</p>
          <p><strong>Localização:</strong> {{ notificacao.endereco }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import SideBar from '@/components/SideBar.vue';
import NavBarUser from '@/components/NavBarUser.vue';

export default {
  components: {
    SideBar,
    NavBarUser,
  },
  data() {
    return {
      socket: null,
      notificacoes: [],
    };
  },
  mounted() {
    this.carregarNotificacoes();
    this.socket = io('https://libertlla.onrender.com/');
    this.socket.on('Novanotificacao', () => {
      console.log('Nova notificação recebida');
      this.carregarNotificacoes();
    });
  },
  methods: {
    async carregarNotificacoes() {
      try {
        const res = await fetch('https://libertlla.onrender.com/notificacoes');
        const dados = await res.json();
        console.log(dados);
        this.notificacoes = dados;
      } catch (error) {
        console.error('Erro ao carregar notificações', error);
      }
    },
    formatarData(data) {
      return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
};
</script>

<style scoped>
.denunciasapp {
  margin-left: 250px;
  margin-top: 30px;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  font-size: 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: #9B287B;
}

h2 {
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: #FF00AE;
}

.notificacao-card {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #EFEFEF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 20px 25px;
  margin-top: 30px;
  width: 100%;
  font-family: "Montserrat", sans-serif;
}

.notificacao-card p {
  margin: 6px 0;
  font-size: 15px;
  color: #7E7E7E;
}
</style>
