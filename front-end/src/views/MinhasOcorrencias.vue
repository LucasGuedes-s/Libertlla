<template>
  <div class="dashboard">
    <div class="d-flex">
      <SideBar />
      <div class="container">
        <div class="titulo-principal">Minhas Ocorrências</div>
        <div class="div_ocorrencias">
          <div class="formulario">
            <div class="info border rounded p-4 row" v-for="ocorrencia in ocorrencias[0].ocorrencias"
              :key="ocorrencia.id">
              <div class="denuncia">
                <label>Data: </label>
                <p>{{ formatDate(ocorrencia.data_denuncia) }}</p>
              </div>

              <div class="denuncia">
                <label>Tipo de Denúncia:</label>
                <p>{{ ocorrencia.tipo_denuncia }}</p>
              </div>

              <div class="denuncia">
                <label>Tipo de Violencia:</label>
                <p>{{ ocorrencia.tipo_violencia }}</p>
              </div>

              <div class="denuncia">
                <label>Descrição:</label>
                <p>{{ ocorrencia.descricao }}</p>
              </div>
              <div class="buttons">
                <router-link :to="`/ocorrencia/${ocorrencia.id}`" class="detalhar-btn">Detalhar</router-link>

                <button type="button" class="pdf-btn" @click="gerarPDF(ocorrencia.id)">Gerar PDF</button>

                <button type="button" class="btn-modal" @click="abrirModal(ocorrencia.id)">Adicionar Progresso</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal -->
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
              <input type="file" id="imagem" name="imagem" accept="image/*" @change="handleFileChange">
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-salvar">Salvar</button>
              <button type="button" class="btn-cancelar" @click="fecharModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


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
  margin-top: 20px;
  margin-left: 7px;
  color: #9B287B;
}

.div_ocorrencias {
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
  /* Ajuste conforme necessário */
}

.denuncia label {
  display: block;
  /* Garante que o label fique acima do p */
  margin-bottom: 5px;
  /* Adiciona um pequeno espaço abaixo do label */
}

.denuncia p {
  margin-top: 5px;
  /* Adiciona espaço acima do texto */
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
.pdf-btn,
.btn-modal{
  background-color: rgba(245, 245, 245, 255);
  color: rgba(152, 152, 152, 255);
  border: 1px solid rgba(245, 245, 245, 255);
  border-radius: 5px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  flex: 1;
  /* Faz com que todos os botões tenham a mesma largura */
  text-align: center;
}

/* Estilos do Modal */
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
  /* Ajuste para aumentar a largura (Ex: 50% da tela) */
  max-width: 600px;
  /* Define um tamanho máximo */
  height: auto;
  /* Ajuste para aumentar a altura (Ex: 60% da altura da tela) */
  max-height: 90vh;
  /* Define um tamanho máximo */
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
  /* Isso garante que o conteúdo do form seja distribuído entre a parte superior e inferior */
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
  /* Impede que o usuário redimensione a área de texto */
}

.quadrado {
  background-color: #54123F;
  /* Cor de fundo */
  color: white;
  /* Cor do texto */
  width: 100%;
  /* Ocupa toda a largura da tela */
  height: 60px;
  /* Ajusta a altura conforme necessário */
  top: 0px;
  left: 0px;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  /* Centraliza o conteúdo horizontalmente */
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
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

#adicionar_imagem {
  grid-column: 1 / -1;
  margin-top: 20px
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
  /* Ajuste a distância que deseja mover para cima */
}
.btn-salvar, .btn-cancelar {
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

@media (max-width: 768px) {
  .dashboard {
    margin-left: 0;
    padding: 10px;
  }

  .div_ocorrencias {
    flex-direction: column;
    gap: 15px;
  }

}
</style>

<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
import { useAuthStore } from '@/store.js'
import { formatDate } from '@/utils/dataformatar';
import Swal from 'sweetalert2';
import router from '@/router';

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
      sidebarVisible: true,
      ocorrencias: [],
      modalVisible: false,
      modalKey: 0, // Para resetar o modal
      progresso: '',
      descricao: '',
      data: '',
      anexos: [], // Para armazenar os arquivos anexados
      selectedFileName: '',
      ocorrenciasId: null,
      uploadStatus: "",
      imageUrl: "",
      file: null,  // Novo campo para armazenar o arquivo
    };
  },
  mounted() {
    const user = this.store.usuario.usuario;
    const email = user.email;
    const token = this.store.token;
    axios.get(`http://localhost:3000/ocorrencias/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      this.ocorrencias = response.data.processos;

      this.ocorrencias.forEach(processo => {
        processo.ocorrencias.sort((a, b) => {
          const dateA = new Date(a.data_denuncia);
          const dateB = new Date(b.data_denuncia);
          return dateA - dateB;
        });
        processo.ocorrencias.reverse();
      });
    }).catch(error => {
      if (error.status === 403 || error.status === 401) {
        router.push('/nao-autorizado')
      }
      console.error('Erro ao buscar ocorrências:', error);
    });
  },
  methods: {
    async gerarPDF(id) {
      console.log("aqui");
      const response = await axios({
        url: `http://localhost:3000/ocorrencia/pdf/${id}`,
        method: 'GET',
        responseType: 'blob',
      });

      // Cria e baixa o arquivo PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Relatório de ocorrencia.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    abrirModal(id) {
      this.ocorrenciasId = id;  // Salva o ID da ocorrência
      this.modalVisible = true;
      this.modalKey++;
    },
    handleFileChange(event) {
      this.file = event.target.files[0]; // Salvar o arquivo selecionado
    },
    async uploadFile() {
      if (!this.file) {
        this.uploadStatus = "Por favor, selecione um arquivo.";
        return null;
      }

      const formData = new FormData();
      formData.append("file", this.file);

      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      this.uploadStatus = "Arquivo enviado com sucesso!";
      return data.fileUrl;
    },

    fecharModal() {
      this.modalVisible = false;
      this.progresso = '';
      this.descricao = '';
      this.data = '';
      this.anexos = [];
      this.selectedFileName = '';
    },
    async adicionarProgresso() {
      console.log("ID da ocorrência:", this.ocorrenciasId);
      console.log("Descrição:", this.descricao);
      console.log("Arquivo:", this.file);
      if (!this.descricao.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Campo obrigatório',
          text: 'A descrição não pode estar vazia',
        });
        return;
      }

      let anexos = [];

      if (this.file) {
        const fileUrl = await this.uploadFile();
        if (fileUrl) {
          anexos.push(fileUrl);
        }
      }

      axios.post(`http://localhost:3000/ocorrencia/${this.ocorrenciasId}/progresso`, {
        descricao: this.descricao,
        anexos: anexos, // Envia os anexos se houver
      })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Progresso Adicionado!',
            text: 'O progresso foi salvo com sucesso.',
          });
          this.fecharModal();
        })
        .catch(error => {
          console.error('Erro ao adicionar progresso:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Houve um problema ao adicionar o progresso.',
          });
        });
    }
  },
  components: {
    SideBar
  }
};
</script>
