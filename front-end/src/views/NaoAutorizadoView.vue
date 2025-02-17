<template>
  <div class="not-authorized">
    <div class="content">
      <h1>Acesso Negado!</h1>
      <p>
        Você não tem permissão para acessar esta página.
      </p>
      <button @click="voltar">Voltar para Login</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    voltar() {
      this.$router.push('/login'); // Redireciona para a página inicial
    }
  }
};
</script>

<style scoped>
.not-authorized {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #54123F; 
  background-blend-mode: multiply;
  background-image: url("../assets/stoplogin.png"); /* Substitua pela URL da imagem */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Faz a imagem de fundo ficar fixa */
}

.content {
  background-color: #54123F; /* Fundo semi-transparente */
  padding: 50px 50px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 1px solid #8b2276;
}

h1 {
  font-size: 45px;
  font-weight: bolder;
  color: white;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: white;
  margin-bottom: 30px;
}

button {
  background-color: #8b2276;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:hover {
  background-color: #632256;
  border: 1px solid #8b2276;
}

button:focus {
  outline: none;
}
@media (max-width: 768px) {
  .content {
    padding: 30px 20px;
    max-width: 90%;
  }

  h1 {
    font-size: 30px;
  }

  p {
    font-size: 16px;
  }

  button {
    padding: 10px 20px;
    font-size: 14px;
  }
}

</style>
