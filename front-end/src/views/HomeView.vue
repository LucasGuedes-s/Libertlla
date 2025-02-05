<template>
  <div class="home">
    <NavBar />
    <div class="titulo">
      <h1>A Importância de Denunciar</h1>
    </div>

    <div class="texto">
      <img src="../assets/mulher.jpg">
      <p>Denunciar a violência contra a mulher é um ato de coragem e solidariedade. Sua denúncia pode salvar vidas,
        interromper ciclos de abuso e promover mudanças significativas na sociedade.
        Quando você decide agir, está não apenas ajudando a si mesma, mas também encorajando outras a fazerem o mesmo.
      </p>
    </div>
    <div class="titulo">
      <h1>Como você pode denunciar?</h1>
      <ul class="button-container">
        <li class="item">
          <a class="link-button" aria-current="page" href="/formulariodedenuncia">
            <i class="bi bi-card-list"></i>
            Formulário</a>
        </li>
        <li class="item">
          <a class="link-button" href="#">
            <i class="bi bi-chat-left-text"></i>
            Chat</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'
export default {
  name: 'HomeView',
  components: {
    NavBar
  }
}
</script>
<style>
.titulo h1 {
  color: #9B287B;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  margin: 30px
}

.texto {
  display: flex
}

.texto p {
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  color: #575757;
  padding: 50px
}

.texto img {
  margin-left: 50px;
  width: 600px;
}

.button-container {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.link-button i {
  margin-right: 5px;
  color: #9B287B;
}

.link-button {
  display: flex;
  justify-content: center;
  margin: 20px;
  text-align: center;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  color: #5a5a5a;
  background-color: #F5F5F5;
  border: 2px solid #D9D9D9;
  padding: 10px 30px;
  border-radius: 5px;
  width: 300px;
}
</style>