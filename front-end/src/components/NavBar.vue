<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand">Libertlla</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Acompanhe a sua denúncia</a>
          </li>
          <li class="nav-item">
            <a class="nav-link login" href="/login">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped>
/* Ajustes adicionais */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
.navbar{
  background-color: #4D1032;
  height: 90px;
}
.navbar-brand{
  color:#ffff;
  margin-left: 50px;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  font-weight: 800; /* ExtraBold */
  text-transform: uppercase; /* Torna o texto maiúsculo */

}
#navbarNav a{
  color: #ffff;
}
.active{
  font-family: "Montserrat", sans-serif;
  width: 300px;
  text-align: center;
  margin-right: 50px;
  border: 2px solid #9B287B; 
  padding: 10px 10px; 
  border-radius: 50px;
}
.login{
  font-family: "Montserrat", sans-serif;
  width: 100px;
  text-align: center;
  margin-right: 50px;
  border: 2px solid #9B287B; 
  padding: 10px 60px; 
  border-radius: 50px;
  background-color: #9B287B; 
}
</style>
