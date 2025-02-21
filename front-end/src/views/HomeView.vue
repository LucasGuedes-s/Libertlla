<template>
  <div class="home">
    <NavBar />
    <section class="section_content">
      <div class="div-content">
        <h1>Redescubra o Seu Espaço</h1>
        <p>Ambiente leve, inspirador e seguro, onde você pode explorar e se conectar no seu próprio ritmo.</p>
      </div>
    </section>

    <section class="características">
      <div class="características-card">
        <h3>Espaço Seguro</h3>
        <p>Conforto e Privacidade caminham juntos.</p>
      </div>
      <div class="características-card">
        <h3>Inspire-se</h3>
        <p>Conteúdos que despertam novas ideias e perspectivas.</p>
      </div>
      <div class="características-card">
        <h3>Conecte-se</h3>
        <p>Crie conexões significativas e verdadeiras.</p>
      </div>
    </section>

    <section class="section_options">
      <h2>Pronta para uma nova experiência?</h2>
      <p>Escolha o caminho que mais combina com você.</p>
      <div class="button-container">
        <a href="/formulariodedenuncia" class="link-button">
          <i class="bi bi-stars"></i> Formulário
        </a>
        <a href="/chat" class="link-button">
          <i class="bi bi-chat-dots"></i> Chat
        </a>
      </div>
    </section>

  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
export default {
  name: 'HomeView',
  components: { NavBar },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
  font-family: "Montserrat", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #450d2c;
}

nav {
  width: 100%;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section_content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, rgba(73, 9, 56, 0.7), rgba(77, 16, 50, 0.8)), url("../assets/mulheres_paginainicial.jpg");
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center;
  
}

.div-content {
  max-width: 800px;
}

.section_content h1 {
  font-size: 34px;
  color: white;
  margin-bottom: 15px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
}

.section_content p {
  font-size: 18px;
  color: white;
  margin-bottom: 25px;
}

.características {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
  padding: 60px 20px;
  width: 100%;
  max-width: 1200px;
  text-align: center;
}

.características-card {
  width: 280px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #9B287B;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.características-card h3 {
  margin-bottom: 10px;
  color: #9B287B;
}

.section_options {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #f6f0fa, #fbe4f1);
  width: 100%;
}
.section_options h2 {
  font-weight: bolder;
  font-size: 32px;
  margin-bottom: 20px;
  color: #9B287B;
}

.section_options p {
  font-size: 18px;
  margin-bottom: 25px;
}
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.link-button {
  padding: 12px 26px;
  background: #9B287B;
  color: #fff;
  border-radius: 30px;
  text-decoration: none;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.link-button:hover {
  background: #801d65;
}
@media (max-width: 768px) {
  .section_content h1 {
    font-size: 28px;
  }

  .section_content p {
    font-size: 16px;
  }

  .características {
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
  }

  .características-card {
    width: 90%;
    margin-bottom: 20px;
  }

  .section_options h2 {
    font-size: 28px;
  }

  .section_options p {
    font-size: 16px;
  }

  .link-button {
    padding: 10px 20px;
  }
}

</style>
