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
          <div class="notificacao-conteudo">
            <div class="info-texto">
              <h2>Nova ocorrência</h2>
              <p><strong>Data:</strong> {{ formatarData(notificacao.data) }}</p>
              <p><strong>Localização:</strong> {{ notificacao.endereco }}</p>
            </div>

            <div class="acao-botao">
              <button
                class="btn-aceitar"
                :disabled="notificacao.notificada"
                @click="notificarVitima(notificacao)"
              >
                {{ notificacao.notificada ? 'Usuária notificada!' : 'Notificar usuária' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import SideBar from '@/components/SideBar.vue';
import NavBarUser from '@/components/NavBarUser.vue';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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
    this.socket.on('novaNotificacao', () => {
      console.log('Nova notificação recebida');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Nova notificação recebida!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#fff',
        color: '#333',
        iconColor: '#FF00AE',
      });
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
    async notificarVitima(notificacao) {
      try {
        const resposta = await fetch(`https://libertlla.onrender.com/notificacoes/${notificacao.id}/notificar`, {
           method: 'POST' 
          });

        if (resposta.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Usuária foi notificada!',
            showConfirmButton: false,
            timer: 2000,
          });

          notificacao.notificada = true;
        } else {
          throw new Error('Falha ao notificar a usuária');
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar notificação',
          text: error.message,
        });
      }
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

.notificacao-conteudo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-texto {
  flex: 1;
}

.acao-botao {
  margin-left: 20px;
}

.btn-aceitar {
  padding: 10px 20px;
  background-color: #9B287B;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.btn-aceitar:hover:enabled {
  background-color: #FF00AE;
}

.btn-aceitar:disabled {
  background-color: #cccccc;
  cursor: default;
}
</style>
