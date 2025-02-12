<template>
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
          <button type="button" class="btn btn-custom-secondary w-100 w-md-auto">Adicionar
            Progresso</button>
        </div>
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
    };
  },
  mounted() {
    const user = this.store.usuario.usuario;
    const email = user.email
    console.log(email)
    axios.get(`http://localhost:3000/ocorrencias/${email}`).then(response => {
      this.ocorrencias = response.data.processos;
      console.log(this.ocorrencias[0].ocorrencias);
    })
      .catch(error => {
        console.error('Erro ao buscar ocorrências:', error);
      });

    console.log(this.store.usuario);
  },
  methods: {
    async gerarPDF(id) {
      console.log("aqui")
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

@media (max-width: 768px) {
  .titulo {
    margin-left: -11%;
    color: #9B287B;
  }

  .ocorrencia {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .ocorrencia-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 10%;
  }

}
</style>