<template>
  <div class="dashboard d-flex">
    <SideBar />
    <div class="dashboard container">
      <section class="section_contagemdedenuncias">
        <div class="card_contagem">
          <h3>Total de Denúncias</h3>
          <p>150</p>
        </div>
        <div class="card_contagem">
          <h3>Formulário</h3>
          <p>80</p>
        </div>
        <div class="card_contagem">
          <h3>Chat</h3>
          <p>70</p>
        </div>
        <div class="card_contagem">
          <h3>Atendidas</h3>
          <p>120</p>
        </div>
      </section>

      <div class="div_ocorrencias">
        <div class="ocorrencias_formulario">
          <h2>Ocorrências por Formulário</h2>
          <div class="info_denuncia">
            <p><strong>Denúncia:</strong></p>
            <p><strong>Data:</strong></p>
            <p><strong>Tipo de Denúncia:</strong></p>
            <div class="buttons">
              <button class="detalhar-btn">Detalhar</button>
              <button class="aceitar-btn">Aceitar</button>
            </div>
          </div>
        </div>
        <div class="ocorrencias_chat">
          <h2>Ocorrências por Chat</h2>
          <div class="info_denuncia">
            <p><strong>Denúncia:</strong></p>
            <p><strong>Data:</strong></p>
            <p><strong>Tipo de Denúncia:</strong></p>
            <div class="buttons">
              <button class="detalhar-btn">Detalhar</button>
              <button class="aceitar-btn">Aceitar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.dashboard {
  margin-left: 250px;
  padding: 20px;
  border-radius: 100px;
}

.section_contagemdedenuncias {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.card_contagem {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card_contagem h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #8b2276;
}

.card_contagem p {
  font-size: 32px;
  font-weight: bold;
  color: #FF00AE;
}

.div_ocorrencias {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.ocorrencias_chat,
.ocorrencias_formulario {
  flex: 1;
  min-width: 300px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.div_ocorrencias h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #8b2276;
  font-weight: bold;
}

.info_denuncia {
  background-color: white;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
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
.aceitar-btn {
  flex: 1;
  padding: 10px 20px;
  background-color: #F5F5F5;
  border: 1px solid #D9D9D9;
  color: #7E7E7E;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
}
@media (max-width: 768px) {
  .dashboard {
    margin-left: 0;
    padding: 10px;
  }

  .section_contagemdedenuncias {
    grid-template-columns: repeat(2, 1fr);
  }

  .div_ocorrencias {
    flex-direction: column;
    gap: 15px;
  }

  .card_contagem p {
    font-size: 24px;
  }
}
</style>

<script>
import SideBar from '@/components/SideBar.vue';

export default {
  components: {
    SideBar,
  },
}
</script>