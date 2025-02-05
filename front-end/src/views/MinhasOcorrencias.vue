<template>
  <div class="minhasocorrencias d-flex">
    <SideBar v-if="sidebarVisible" />
    <div class="ocorrencia container">
      <h1 class="titulo mb-4">Minhas Ocorrências:</h1>

      <div class="ocorrencia-form border rounded p4 row">
        <div class="col-12 col-md-6">
          <label for="data">Data:</label>
          <input class="form-control" id="data" name="data" />
        </div>

        <div class="col-12 col-md-6">
          <label for="tipo-denuncia">Tipo de denúncia:</label>
          <input type="text" class="form-control" id="tipo-denuncia" name="tipo-denuncia" />
        </div>

        <div class="col-12 mt-3">
          <label for="descricao">Descrição:</label>
          <input class="form-control" id="descricao" name="descricao" rows="4" />
        </div>

        <div class="col-12 mt-3 d-flex flex-column flex-md-row justify-content-start gap-3">
          <button type="button" class="btn btn-custom-primary w-100 w-md-auto">Detalhar</button>
          <button type="button" class="btn btn-custom-secondary w-100 w-md-auto">Adicionar Progresso</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';

export default {
  components: {
    SideBar,
  },
  data() {
    return {
      sidebarVisible: true, 
    };
  },
  methods: {
    toggleSidebar() {
      
      this.sidebarVisible = !this.sidebarVisible; 
    },
  },
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

label {
  color: rgba(152, 152, 152, 255);
  font-weight: 700;
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
  background-color: rgba(245, 245, 245, 255); /* Mudando a cor de fundo */
  color: rgba(152, 152, 152, 255);/* Mudando a cor do texto */
  border: 1px solid rgba(245, 245, 245, 255); /* Mudando a cor da borda */
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