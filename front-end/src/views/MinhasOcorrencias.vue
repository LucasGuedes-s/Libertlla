<template>
  <div>
    <div class="minhasocorrencias d-flex">
      <SideBar v-if="sidebarVisible" />
      <div class="ocorrencia container">
        <h1 class="titulo mb-4">Minhas Ocorrências:</h1>

        <div class="ocorrencia-form border rounded p-4 row" v-for="ocorrencia in ocorrencias[0].ocorrencias"
          :key="ocorrencia.id">
          <div class="col-12 mb-3">
            <label>Data:</label>
            <p>{{ ocorrencia.data_denuncia }}</p>
          </div>

          <div class="col-12 mb-3">
            <label>Tipo de Denúncia:</label>
            <p>{{ ocorrencia.tipo_denuncia }}</p>
          </div>

          <div class="col-12 mb-3">
            <label>Descrição:</label>
            <p>{{ ocorrencia.descricao }}</p>
          </div>

          <div class="col-12 mt-3 d-flex flex-column flex-md-row justify-content-start gap-3">
            <router-link :to="`/ocorrencia/${ocorrencia.id}`"
              class="btn btn-custom-primary w-100 w-md-auto">Detalhar</router-link>
            <button type="button" class="btn btn-custom-secondary w-100 w-md-auto" @click="gerarPDF(ocorrencia.id)">
              Gerar PDF</button>
            <button type="button" class="btn btn-custom-secondary w-100 w-md-auto" @click="abrirModal">Adicionar
              Progresso</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalVisible" :key="modalKey" class="modal-overlay">
      <div class="modal-content">
        <div class="quadrado">
          <h1 class="titulo mb-4">Adicionar Progresso</h1>
        </div>
        <form @submit.prevent="adicionarProgresso">
          <label for="descricao">Descrição:</label>
          <textarea v-model="descricao" id="descricao" rows="4" placeholder="Adicionar descrição"></textarea>
          <!-- <label for="anexos" class="btn-upload">Escolher Arquivos</label>
          <input type="file" id="anexos" multiple @change="FileUpload" style="display: none;" />

          xibir o nome do arquivo selecionado -
          <label v-if="selectedFileName">Arquivo selecionado: {{ selectedFileName }}</label>
          <label v-else>Nenhum arquivo selecionado</label>  -->

          <div class="form-group" id="adicionar_imagem">
            <label for="imagem">Anexos:</label>
            <input type="file" id="imagem" name="imagem" accept="image/*">
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-custom-primary">Salvar</button>
            <button type="button" class="btn btn-custom-secondary" @click="fecharModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
import { useAuthStore } from '@/store';
import router from '@/router';

export default {
  components: {
    SideBar,
  },
  setup() {
    const store = useAuthStore();
    return {
      store,
    };
  },
  data() {
    return {
      sidebarVisible: true,
      ocorrencias: [],
      modalVisible: false,
      modalKey: 0, // Para resetar o modal
      progresso: '',
      descricao: '',
      data: '',
      anexos: [], // Para armazenar os arquivos anexados
      selectedFileName: '',
    };
  },
  mounted() {
    const user = this.store.usuario.usuario;
    const email = user.email;
    const token = this.store.token
    axios.get(`http://localhost:3000/ocorrencias/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
      this.ocorrencias = response.data.processos;

    }).catch(error => {
        if(error.status === 403 || error.status === 401){
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
    abrirModal() {
      this.modalVisible = true;
      this.modalKey++;
    },
    FileUpload(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.selectedFileName = files[0].name; // Salvar nome do arquivo
        this.anexos = Array.from(files);
      }
    },
    fecharModal() {
      this.modalVisible = false;
      this.progresso = ''; // Limpar o campo de progresso quando fechar
      this.descricao = '';
      this.data = '';
      this.anexos = [];
      this.selectedFileName = ''; // Limpar nome do arquivo
    },
  }
};

</script>

<style scoped>
.titulo {
  font-size: 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 7px;
  color: #9B287B;
}

p {
  color: rgba(152, 152, 152, 255);
  border: 1px solid #d3d3d3b6;
  /* Adicionando a borda */
  border-radius: 4px;
  /* Arredondando as bordas */
  padding: 6px;
}

label {
  font-family: "Montserrat", sans-serif;
  color: rgba(152, 152, 152, 255);
}

.ocorrencia {
  margin-left: 290px;
  padding: 20px;
  border-radius: 100px;
}

.ocorrencia-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  border-color: #d3d3d3b6;
  border-style: solid;
  width: 96%;
  padding: 20px;
  margin-left: 5px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.btn-custom-primary,
.btn-custom-secondary {
  background-color: rgba(245, 245, 245, 255);
  color: rgba(152, 152, 152, 255);
  border: 1px solid rgba(245, 245, 245, 255);
  border-radius: 5px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  width: 49%;
}

.btn-custom-primary:hover,
.btn-custom-secondary:hover {
  background-color: rgba(245, 245, 245, 255);
  /* Mudando a cor de fundo */
  color: rgba(152, 152, 152, 255);
  /* Mudando a cor do texto */
  border: 1px solid rgba(245, 245, 245, 255);
  /* Mudando a cor da borda */
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
  width: 50vw;
  /* Ajuste para aumentar a largura (Ex: 50% da tela) */
  max-width: 800px;
  /* Define um tamanho máximo */
  height: 60vh;
  /* Ajuste para aumentar a altura (Ex: 60% da altura da tela) */
  max-height: 80vh;
  /* Define um tamanho máximo */
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
  width: 50vw;
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
  margin-top: -15px;  /* Ajuste a distância que deseja mover para cima */
}
</style>
