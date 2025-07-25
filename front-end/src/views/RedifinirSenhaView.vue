<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand">
          Libertlla
          <span class="recuperar-senha">| Redefinir Senha</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>

    <div class="center-content">
      <div class="form-container">
        <h2>Redefinir Senha</h2>

        <input type="email" placeholder="Digite seu e-mail" class="input-email" v-model="email" />

        <input type="password" placeholder="Digite sua nova senha" class="input-senha" v-model="novaSenha" />

        <input type="password" placeholder="Digite sua senha novamente" class="input-senha" v-model="confirmarSenha" />

        <button class="btn-alterar" @click="alterarSenha">
          Alterar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: "NavBar",
  data() {
    return {
      email: '',
      novaSenha: '',
      confirmarSenha: ''
    };
  },
  methods: {
    async alterarSenha() {
    if (!this.email || !this.novaSenha || !this.confirmarSenha) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos para continuar.',
      });
    }

    if (this.novaSenha !== this.confirmarSenha) {
      return Swal.fire({
        icon: 'error',
        title: 'Senhas diferentes',
        text: 'A nova senha e a confirmação não coincidem.',
      });
    }

    try {
      const response = await axios.post('https://libertlla.onrender.com/vitimas/recuperar_senha', {
        email: this.email,
        novaSenha: this.novaSenha
      });

      Swal.fire({
        icon: 'success',
        title: 'Senha alterada com Sucesso',
        text:  'Volte agora para o APP!',
      });

      this.email = '';
      this.novaSenha = '';
      this.confirmarSenha = '';

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao tentar redefinir a senha.',
      });
    }
  }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.navbar {
  background-color: #450d2c;
  height: 70px;
}

.navbar-brand {
  color: #ffff;
  margin-left: 50px;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  font-weight: 800;
  text-transform: uppercase;
}

#navbarNav a {
  color: #ffff;
}

.active {
  font-family: "Montserrat", sans-serif;
  width: 300px;
  text-align: center;
  margin-right: 50px;
  border: 2px solid #9B287B;
  padding: 10px 10px;
  border-radius: 50px;
}

.login {
  font-family: "Montserrat", sans-serif;
  width: 150px;
  padding: 5px;
  text-align: center;
  margin-right: 50px;
  border-radius: 50px;
  background: linear-gradient(45deg, #801d65, #801d65);
}

.recuperar-senha {
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  font-weight: 100;
  text-transform: none;
  margin-left: 10px;
  color: #ffffff;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  background-color: #f8f8f8;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
}

.form-container {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.form-container h2 {
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
  font-size: 22px;
  color: #450d2c;
}

.input-email,
.input-senha {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}

.btn-alterar {
  width: 100%;
  padding: 12px;
  background-color: #9b287b;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  transition: background-color 0.3s ease;
}

.btn-alterar:hover {
  background-color: #801d65;
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
