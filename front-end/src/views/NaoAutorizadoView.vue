<template>
    <div class="not-authorized">
      <h1>Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <button @click="voltar">Voltar</button>
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
    text-align: center;
    padding: 50px;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    color: red;
  }
  
  button {
    background-color: #d9534f;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  
  button:hover {
    background-color: #c9302c;
  }
  </style>