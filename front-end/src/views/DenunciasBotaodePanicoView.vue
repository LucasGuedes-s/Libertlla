<template>
  <div class="denunciasapp">
    <NavBarUser />
    <div class="d-flex">
      <SideBar />
      <div class="container">
        <h1>Notificações do Botão de Pânico</h1>

        <div v-if="loading" class="loading-wrapper">
          <div class="spinner"></div>
        </div>

        <div v-else>
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
                  class="btn-notificar"
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
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import SideBar from '@/components/SideBar.vue';
import NavBarUser from '@/components/NavBarUser.vue';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import 'sweetalert2/dist/sweetalert2.min.css';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


export default {
  components: {
    SideBar,
    NavBarUser,
  },
  data() {
    return {
      socket: null,
      notificacoes: [],
      vitimaId: null,
      loading: true,  // <-- controle do loading
    };
  },
  mounted() {
    // Extrair vitimaId do token JWT salvo no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.vitimaId = decoded.id;  // Ajuste caso seu payload use outro campo
      } catch (e) {
        console.error('Token inválido', e);
      }
    } else {
      console.warn('Usuário não logado');
    }

    this.carregarNotificacoes();

    this.socket = io('https://libertlla.onrender.com/');

    if (this.vitimaId) {
      // Entra na sala socket específica da vítima
      this.socket.emit('entrarNaSalaVitima', this.vitimaId);

      // Escuta notificações direcionadas para essa vítima
      this.socket.on(`notificacao-vitima-${this.vitimaId}`, (data) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: data.mensagem || 'Nova notificação!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#fff',
          color: '#333',
          iconColor: '#FF00AE',
        });
        this.carregarNotificacoes();
      });
    }

    // Notificação geral de nova notificação (se quiser manter)
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
        this.loading = true;  // <-- começa loading
        const res = await fetch('https://libertlla.onrender.com/notificacoes');
        const dados = await res.json();
        console.log('Notificações carregadas:', dados);
        this.notificacoes = dados;
        
      } catch (error) {
        console.error('Erro ao carregar notificações', error);
      } finally {
        this.loading = false;  // <-- termina loading
      }
    },
    formatarData(data) {
      const d = new Date(data);
      d.setHours(d.getHours() + 3); // UTC para UTC-3
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    async notificarVitima(notificacao) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Você precisa estar logado para notificar',
          });
          return;
        }

        const resposta = await fetch(
          `https://libertlla.onrender.com/notificacoes/${notificacao.id}/notificar`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (resposta.ok) {
          const dados = await resposta.json();
          if (dados.mensagem) {
            Swal.fire({
              icon: 'success',
              title: dados.mensagem,
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Usuária foi notificada!',
              showConfirmButton: false,
              timer: 2000,
            });
          }
          notificacao.notificada = true;
        } else {
          const erroData = await resposta.json().catch(() => null);
          Swal.fire({
            icon: 'error',
            title: 'Falha ao notificar a usuária',
            text: erroData?.erro || 'Erro desconhecido',
          });
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
  transition: margin-left 0.3s ease;
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
  box-sizing: border-box;
}

.notificacao-conteudo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; 
}

.info-texto {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #7E7E7E;
  flex: 1 1 60%; 
  min-width: 200px;
}

.acao-botao {
  margin-left: 20px;
  flex: 1 1 30%; 
  min-width: 120px;
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
}

.btn-notificar {
  padding: 8px 20px;
  background-color: #9B287B;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.btn-notificar:hover:enabled {
  background-color: #FF00AE;
}

.btn-notificar:disabled {
  background-color: #cccccc;
  cursor: default;
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
  .denunciasapp {
    margin-left: 0;
    padding: 15px;
  }

  h1 {
    margin-top: 20px; /* <-- Adiciona espaçamento superior no título */
  }

  .notificacao-conteudo {
    flex-direction: column;
    align-items: flex-start;
  }

  .acao-botao {
    margin-left: 0;
    margin-top: 15px;
    justify-content: flex-start;
    width: 100%;
  }

  .info-texto {
    flex: 1 1 100%;
  }
}


</style>