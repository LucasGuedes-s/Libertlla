<template>
  <div class="denunciasapp">
    <NavBarUser />
    <div class="d-flex">
      <SideBar />
      <div class="container">
        <h1>Notificações do Botão de Pânico</h1>
        <div class="notificacao-card">
          <h2>Nova ocorrência</h2>
          <p><strong>Data:</strong></p>
          <p><strong>Localização:</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.denunciasapp {
  margin-left: 250px;
  margin-top: 30px; 
  padding: 20px;
  border-radius: 10px;
}

h1 {
  font-size: 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: #9B287B;
}

h2 {
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  color: #FF00AE;
}

.notificacao-card {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #EFEFEF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 20px 25px;
  margin-top: 30px;
  width: 100%;
  font-family: "Montserrat", sans-serif;
}

.notificacao-card h3 {
  margin: 0 0 12px;
  color: #54123F;
  font-size: 20px;
  font-weight: 600;
}

.notificacao-card p {
  margin: 6px 0;
  font-size: 15px;
  color: #7E7E7E;
}
</style>



<script>
import SideBar from '@/components/SideBar.vue';
import NavBarUser from '@/components/NavBarUser.vue';
export default {
  components: {
    SideBar,
    NavBarUser
  },
  
}
</script>