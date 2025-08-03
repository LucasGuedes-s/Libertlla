<template>
  <div class="wrapper">
    <SideBar v-if="sidebarVisible" />

    <div class="main-content">
      <div class="container mt-4">
        <div class="card">
          <div class="card-header bg-light">
            <h5 class="text-primary">Conversa</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="data" class="form-label">Data:</label>
              <input id="data" class="form-control" :value="formatDate(conversa.createdAt)" readonly />
            </div>

            <div class="mb-3">
              <label for="messages" class="form-label">Mensagens:</label>
              <textarea id="messages" class="form-control" rows="5" :value="formatarMensagens()" readonly></textarea>
            </div>

            <div class="button">
              <button class="apertarBotao" @click="arquivarConversa">Arquivar</button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-5">
        <h5 class="linha">Linha do tempo</h5>

        <div class="filtros-wrapper d-flex justify-content-between align-items-end flex-wrap mb-4">
          <div class="filtro-item">
            <label class="form-label">Tipo:</label>
            <select v-model="filtro.tipo" class="form-select">
              <option value="">Todos</option>
              <option value="visita">Visita</option>
              <option value="progresso">Progresso</option>
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
              <option v-for="ano in anosDisponiveis" :key="ano" :value="ano">
                {{ ano }}
              </option>
            </select>
          </div>
          <div class="filtro-item">
            <label class="form-label">⠀</label>
            <button class="botaolimpar" @click="limparFiltros">Limpar Filtros</button>
          </div>
        </div>

        <div class="timeline">
          <div v-for="(registro, index) in registrosFiltrados" :key="registro.id" class="timeline-item"
            :class="{ left: index % 2 === 0, right: index % 2 !== 0 }">
            <div class="timeline-box">
              <div class="card">
                <div class="card-body">
                  <p class="mb-1">
                    <span v-if="
                      registro.assinatura &&
                      registro.anexos &&
                      Array.isArray(registro.testemunhas) &&
                      registro.testemunhas.length
                    " class="badge text-white" style="background-color: #9B287B;">
                      Visita
                    </span>
                    <span v-else class="badge text-white" style="background-color: #9B287B;">
                      Progresso
                    </span>
                  </p>

                  <p class="card-text">{{ registro.descricoes }}</p>
                  <p v-if="Array.isArray(registro.testemunhas) && registro.testemunhas.length" class="card-text">
                    <strong class="form-label">Testemunhas:</strong>
                    {{ registro.testemunhas.join(', ') }}
                  </p>
                  <p v-if="registro.anexos">
                    <strong class="form-label">Anexo:</strong>
                    <a :href="registro.anexos" target="_blank" class="card-title visualizar">Visualizar</a>
                  </p>
                  <p v-if="registro.assinatura">
                    <strong class="form-label">Assinatura:</strong>
                    <a :href="registro.assinatura" target="_blank" class="card-title visualizar">Visualizar</a>
                  </p>
                  <span class="text-muted">{{
                    new Date(registro.data).toLocaleString()
                  }}</span>
                </div>
              </div>
            </div>
            <div class="timeline-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils/dataformatar';
import Swal from 'sweetalert2';
import router from '@/router';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup() {
    const store = useAuthStore();
    return { store };
  },
  data() {
    return {
      formatDate,
      sidebarVisible: true,
      conversa: {
        id: null,
        createdAt: '',
        messages: [],
        registros: [],
        status: ''
      },
      filtro: {
        tipo: '',
        mes: '',
        ano: ''
      },
      loading: false
    };
  },
  mounted() {
    this.getConversas();
  },
  computed: {
    registrosFiltrados() {
      return this.conversa.registros.filter(registro => {
        const data = new Date(registro.data);
        const tipo = (registro.assinatura && registro.anexos && Array.isArray(registro.testemunhas) && registro.testemunhas.length)
          ? 'visita'
          : 'progresso';

        const condTipo = this.filtro.tipo === '' || tipo === this.filtro.tipo;
        const condMes = this.filtro.mes === '' || (data.getMonth() + 1) === Number(this.filtro.mes);
        const condAno = this.filtro.ano === '' || data.getFullYear() === Number(this.filtro.ano);

        return condTipo && condMes && condAno;
      });
    },
    anosDisponiveis() {
      const anos = this.conversa.registros.map(r => new Date(r.data).getFullYear());
      return [...new Set(anos)].sort();
    }
  },
  methods: {
    limparFiltros() {
      this.filtro.tipo = '';
      this.filtro.mes = '';
      this.filtro.ano = '';
    },

    async getConversas() {
      this.loading = true;
      try {
        const user = this.store.usuario?.usuario;
        const email = user?.email;
        const token = this.store.token;

        if (!token || !email) {
          throw new Error('Usuário ou token não encontrado.');
        }

        const response = await axios.get(`https://libertlla.onrender.com/conversas/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.conversas) {
          const conversas = response.data.conversas;
          const encontrada = conversas.find(c => String(c.id) === String(this.id));
          if (encontrada) {
            this.conversa = encontrada;
          } else {
            console.warn('Conversa não encontrada com o ID fornecido.');
            this.conversa.id = this.id; 
          }
        } else {
          console.warn('Resposta da API não contém conversas.');
        }
      } catch (error) {
        console.error('Erro ao buscar conversas:', error.response?.data || error.message);
      } finally {
        this.loading = false;
      }
    },

    formatarMensagens() {
      if (!this.conversa || !Array.isArray(this.conversa.messages) || this.conversa.messages.length === 0) {
        return "Nenhuma mensagem disponível.";
      }
      return this.conversa.messages
        .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.from}: ${msg.content}`)
        .join("\n");
    },

    async arquivarConversa() {
      try {
        const token = this.store.token;
        const conversaId = this.id; 

        if (!token || !conversaId) {
          throw new Error('Token ou ID da conversa não encontrado.');
        }

        await axios.put(
          'https://libertlla.onrender.com/conversas/arquivar',
          { conversaId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        Swal.fire({
          title: 'Sucesso!',
          text: 'Conversa arquivada com sucesso!',
          icon: 'success'
        });

        this.conversa.status = 'Arquivada';
        router.push('/minhasocorrencias');

      } catch (error) {
        console.error('Erro ao arquivar conversa:', error.response?.data || error.message);
        Swal.fire({
          title: 'Erro!',
          text: 'Não foi possível arquivar a conversa. Tente novamente.',
          icon: 'error'
        });
      }
    }
  },
  components: {
    SideBar
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  margin-left: 200px;
  margin-right: -50px;
  box-sizing: border-box;
}

.container {
  width: 90%;
  max-width: 1300px;
  background: #ffffff;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.apertarBotao,
.botaolimpar {
  flex: 1;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #7e7e7e;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
}

.botaolimpar {
  padding: 8px 20px;
}

.button {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.card-header {
  background: #ffffff !important;
  border-bottom: 1px solid #d9d9d9;
}

h5.text-primary {
  color: #9b287b !important;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 30px;
}

.form-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: rgba(126, 126, 126, 0.8);
}

.form-control {
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
}

textarea.form-control {
  height: 111px;
  resize: none;
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: auto;
  padding: 20px 0;
}

.timeline-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 30px;
  width: 100%;
}

.timeline-box {
  width: 48%;
  margin: 0 10px;
  box-sizing: border-box;
}

.left .timeline-box {
  order: -1;
  text-align: right;
}

.right .timeline-box {
  order: 1;
  text-align: left;
}

.timeline-item .card {
  width: 100%;
}

.timeline-item .card-body {
  padding: 10px 20px;
}

.timeline::after {
  content: '';
  position: absolute;
  width: 2px;
  background: #ddd;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -1px;
}

.linha {
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  padding: 15px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 30px;
}

.visualizar {
  color: black;
}

.filtros-wrapper {
  gap: 16px;
  margin-top: 50px;
  margin-left: 90px;
}

.filtro-item {
  flex: 1 1 250px;
  min-width: 180px;
}

@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
  }

  .main-content {
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    order: 1;
    box-sizing: border-box;
    margin-top: 20px;
  }

  .container {
    width: 100% !important;
    max-width: 100% !important;
    padding: 10px;
    margin: 0 auto;
  }

  .linha {
    font-size: 24px;
  }

  .filtros-wrapper {
    gap: 10px;
    margin-top: 50px;
    margin-left: 10px;
    width: 95%;
  }

  .botaolimpar {
    padding: 10px 20px;
    margin-left: 1px;
    width: 100%;

  }
}
</style>