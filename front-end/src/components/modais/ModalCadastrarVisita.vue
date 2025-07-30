<template>
  <div v-if="visible" :key="modalKey" class="modal-overlay">
    <div class="modal-content">
      <div class="quadrado">
        <h1 class="titulo mb-4">Cadastrar Visita</h1>
      </div>
      <form @submit.prevent="cadastrarVisita">
        <label for="descricao">Descrição:</label>
        <textarea
          v-model="descricao"
          id="descricao"
          rows="4"
          placeholder="Adicionar descrição"
        ></textarea>

        <label for="testemunhas">Testemunhas:</label>
        <input
          type="text"
          id="testemunhas"
          v-model="testemunhas"
          placeholder="Nome das testemunhas"
        />

        <div class="form-group adicionar-imagem">
          <label for="anexos">Anexos:</label>
          <input
            ref="anexosInput"
            type="file"
            id="anexos"
            accept="image/*"
            multiple
            @change="handleFileChange"
          />
        </div>

        <div class="form-group adicionar-imagem">
          <label for="assinaturas">Assinaturas:</label>
          <input
            ref="assinaturaInput"
            type="file"
            id="assinaturas"
            accept="image/*"
            @change="handleAssinaturaChange"
          />
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn-salvar">Salvar</button>
          <button type="button" class="btn-cancelar" @click="fecharModalVisita">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    modalKey: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      descricao: "",
      testemunhas: "",
      anexos: [],
      assinatura: null,
    };
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.resetCampos();
      }
    },
  },
  methods: {
    resetCampos() {
      this.descricao = "";
      this.testemunhas = "";
      this.anexos = [];
      this.assinatura = null;

      if (this.$refs.anexosInput) this.$refs.anexosInput.value = "";
      if (this.$refs.assinaturaInput) this.$refs.assinaturaInput.value = "";
    },
    handleFileChange(event) {
      this.anexos = Array.from(event.target.files);
    },
    handleAssinaturaChange(event) {
      const files = event.target.files;
      this.assinatura = files?.[0] || null;
    },
    cadastrarVisita() {
      this.$emit("submit", {
        descricao: this.descricao,
        testemunhas: this.testemunhas,
        anexos: this.anexos,
        assinatura: this.assinatura,
      });
      // NÃO fecha o modal aqui, o pai controla o fechamento
    },
    fecharModalVisita() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
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
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.modal-content form {
  display: flex;
  flex-direction: column;
  margin-top: 60px;
}

.modal-content form label {
  margin-top: 10px;
  font-weight: 600;
  color: rgba(152, 152, 152, 255);
  font-family: "Montserrat", sans-serif;
}

textarea,
input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: "Montserrat", sans-serif;
  color: #333;
  box-sizing: border-box;
}

textarea {
  resize: none;
  margin-bottom: 15px;
}

input[type="file"] {
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 20px;
}

#descricao {
  margin-bottom: 1px;
}

.form-group.adicionar-imagem {
  margin-top: 1px;
  margin-bottom: 1px;
}

#testemunhas {
  margin-top: 5px;
  margin-bottom: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  margin-top: -15px;
}

.btn-salvar,
.btn-cancelar {
  background-color: rgba(245, 245, 245, 255);
  color: rgba(152, 152, 152, 255);
  border: 1px solid rgba(245, 245, 245, 255);
  border-radius: 5px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  width: 49%;
  padding: 8px;
}

.quadrado {
  background-color: #54123F;
  color: white;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.quadrado .titulo {
  margin: 0;
  font-size: 24px;
  color: white;
  text-align: center;
  padding-top: 20px;
  font-family: "Montserrat", sans-serif;
}
</style>
