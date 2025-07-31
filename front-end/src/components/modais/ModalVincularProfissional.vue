<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <div class="quadrado">
        <h3 class="titulo mb-4">Vincular Profissional</h3>
      </div>
      <form @submit.prevent="emitirVinculo">
        <div class="dropdown-row">
          <label for="profissionalSelecionado">Selecione um profissional:</label>
          <select v-model="selecionado" id="profissionalSelecionado" class="dropdown" required>
            <option disabled value="">Selecionar</option>
            <option v-for="profissional in profissionais" :key="profissional.id" :value="profissional.id">
              {{ profissional.nome }} - {{ profissional.especialidade }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn-salvar">Salvar</button>
          <button type="button" class="btn-cancelar" @click="$emit('close')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalVincularProfissional",
  props: {
    visible: Boolean,
    profissionais: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      selecionado: ""
    };
  },
  methods: {
    emitirVinculo() {
      this.$emit("submit", this.selecionado);
    }
  }
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

select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: "Montserrat", sans-serif;
  color: #333;
  box-sizing: border-box;
  margin-bottom: 15px;
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