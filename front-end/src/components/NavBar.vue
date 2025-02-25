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
  background-color: #450d2c;
  height: 70px;
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
  width: 150px;
  padding: 5px;
  text-align: center;
  margin-right: 50px;
  border-radius: 50px;
  background: linear-gradient(45deg, #801d65, #801d65);
}
@media (max-width: 780px) {
  .navbar {
    height: auto;
    padding: 8px 15px;
  }

  .navbar-toggler {
    padding: 2px 5px;
    margin-right: 0px;
  }

  .navbar-toggler .navbar-toggler-icon {
    width: 16px;
    height: 16px;
  }

  .navbar-brand {
    font-size: 16px;
    margin-left: 0;
  }

  .login {
    width: 100%;
    font-size: 13px;
    padding: 4px 8px;
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
