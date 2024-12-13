<template>
    <div class="container_login">
        <div class="image_section">
          <div class="image"></div>
        </div>
        <div class="login_section">
            <h1><span class="nome">LIBERTLLA</span></h1>
            <form  class="login_form" @submit.prevent="login">
                <label for="email"> E-mail</label>
                <input type="text" name="email" placeholder="Digite o seu e-mail" v-model="email">
                <label for="senha">Senha</label>
                <input type="password" name="senha" placeholder="Digite a sua senha" v-model="senha">
                <button type="submit" class="bnt_entrar" @click="login">Entrar</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.container_login {
  display: flex;
  height: 100vh;
}

.image_section {
  flex: 1;
  background: url("../assets/stoplogin.png");
  background-size: cover;
  background-color: #54123F; 
  background-blend-mode: multiply; /* transparencia em cima da imagem */
}

.login_section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #54123F;
}

.login_section h1 {
  font-size: 450%;
  font-family:  "Montserrat", sans-serif ;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #ffffff;
}

.login_form {
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 1000px;
}
.login_form label {
  font-family:  "Montserrat", sans-serif ;
  font-size: 1rem;
  margin-bottom: 0.60rem;
  color: #ffffff;
  margin-top: 1rem;
}
.login_form input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #9B287B;
  border-radius: 10px;
  margin-bottom: 1rem;
  background-color: #4D10;
  color: #ffffff;
}
.login_form input::placeholder {
  color: #ffffff;
}

.bnt_entrar {
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #9B287B;
  border: none;
  border-radius: 10px;
  font-family:  "Montserrat", sans-serif ;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .container_login {
    flex-direction: column;
  }

  .image_section {
    height: 40vh;
  }

  .login_section {
    padding: 1rem;
  }

  .login_section h1 {
    font-size: 2rem;
  }

  .login_form {
    width: 90%;
  }
}

</style>

<script>
import router from '@/router';
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            senha: '',
        }
    },
methods:{
    async login(){
        await axios.post("http://localhost:3000/login", {
            usuario:{
                email:this.email,
                senha: this.senha
            }
        }).then(response =>{
            console.log(response.status)
            console.log(response)
            localStorage.setItem('dados', JSON.stringify(response.data.usuario));
        }).catch(Error =>{
            console.error(Error);
            Swal.fire({
                icon: 'error',
                title: 'Usuario ou senha incorretos',
                timer: 4000,
            })
        });
    }
}
}
</script>