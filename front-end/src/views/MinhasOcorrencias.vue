<template>
  <div>
    <div class="minhasocorrencias d-flex">
      <SideBar v-if="sidebarVisible" />
      <div class="ocorrencia container">
        <h1 class="titulo mb-4">Minhas Ocorrências:</h1>

        <div class="ocorrencia-form border rounded p-4 row" v-for="ocorrencia in ocorrencias[0].ocorrencias"
          :key="ocorrencia.id">
          <div class="col-12 col-md-6">
            <label>Data:</label>
            <p>{{ ocorrencia.data_denuncia }}</p>
          </div>

          <div class="col-12 col-md-6">
            <label>Tipo de Denúncia:</label>
            <p>{{ ocorrencia.tipo_denuncia }}</p>
          </div>

          <div class="col-12 mt-3">
            <label>Descrição:</label>
            <p>{{ ocorrencia.descricao }}</p>
          </div>

          <div class="col-12 mt-3 d-flex flex-column flex-md-row justify-content-start gap-3">
            <router-link :to="`/ocorrencia/${ocorrencia.id}`"
              class="btn btn-custom-primary w-100 w-md-auto">Detalhar</router-link>
            <button type="button" class="btn btn-custom-secondary w-100 w-md-auto" @click="gerarPDF(ocorrencia.id)"> Gerar PDF</button>
            <button type="button" class="btn btn-custom-secondary w-100 w-md-auto" @click="abrirModal">Adicionar Progresso</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalVisible" :key="modalKey" class="modal-overlay">
      <div class="modal-content">
        <h1 class="titulo mb-4">Adicionar Progresso</h1>
        <form @submit.prevent="adicionarProgresso">
       <label for="data">  Data:</label>
          <input type="date" v-model="data" id="data" required />
        </br>
          <label for="descricao">Descrição:</label>
          <textarea v-model="descricao" id="descricao" rows="4" placeholder="Adicionar descrição (opcional)"></textarea>

            <label for="anexos">Anexos:</label>
          <input type="file" id="anexos" multiple @change="FileUpload" />

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
      modalKey: 0, // Adicionando chave para resetar o modal
      progresso: '',
      descricao: '',
      data: '',
      anexos: [], // Para armazenar os arquivos anexados
    };
  },
  mounted() {
    const user = this.store.usuario.usuario;
    const email = user.email;
    console.log(email);
    axios.get(`http://localhost:3000/ocorrencias/${email}`).then(response => {
      this.ocorrencias = response.data.processos;
      console.log(this.ocorrencias[0].ocorrencias);
    })
      .catch(error => {
        console.error('Erro ao buscar ocorrências:', error);
      });
  },
  methods: {
    async gerarPDF(id) {
      console.log("aqui");
      const response = await axios({
        url: `http://localhost:3000/ocorrencia/pdf/${id}`,
        method: 'GET',
        responseType: 'blob', // Para tratar a resposta como arquivo
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
    fecharModal() {
      this.modalVisible = false;
      this.progresso = ''; // Limpar o campo de progresso quando fechar
      this.descricao = ''; 
      this.data = ''; 
      this.anexos = []; 
    },
    FileUpload(event) {
      const files = event.target.files;
      this.anexos = Array.from(files);
      
      this.fecharModal();
    }
  }
};
</script>

<style scoped>
.titulo {
  font-size: 150%;
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
  margin-top: 30px;
  border-color: #d3d3d3b6;
  border-style: solid;
  width: 96%;
  padding: 20px;
  margin-left: 5px;
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
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
  border: 1px solid #ddd;
}

textarea:focus {
  outline: none;
  border-color: #9B287B;
}

button {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 5px;
}
</style>
