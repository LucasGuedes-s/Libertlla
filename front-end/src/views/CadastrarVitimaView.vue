<template>
  <div class="cadastro_vitima">
    <SideBar />
    <div class="container">
      <h1>Cadastrar Vítima</h1>
      <form @submit.prevent="cadastrarvitima">
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="form.nome" required />
        </div>

        <div class="form-group">
          <label for="dataNascimento">Data de Nascimento:</label>
          <input type="date" id="dataNascimento" v-model="form.dataNascimento" required />
        </div>

        <div class="form-group">
          <label for="cpf">CPF:</label>
          <input
            type="text"
            id="cpf"
            v-model="form.cpf"
            maxlength="14"
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>

        <div class="form-group">
          <label for="telefone">Telefone:</label>
          <input
            type="text"
            id="telefone"
            v-model="form.telefone"
            maxlength="15"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div class="form-group">
          <label for="genero">Gênero:</label>
          <select id="genero" v-model="form.genero">
            <option disabled value="">Selecione...</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não dizer">Prefiro não dizer</option>
          </select>
        </div>

        <div class="form-group">
          <label for="estadoCivil">Estado Civil:</label>
          <input type="text" id="estadoCivil" v-model="form.estadoCivil" />
        </div>

        <div class="form-group">
          <label for="profissao">Profissão:</label>
          <input type="text" id="profissao" v-model="form.profissao" />
        </div>

        <div class="form-group">
          <label for="escolaridade">Escolaridade:</label>
          <select id="escolaridade" v-model="form.escolaridade">
            <option disabled value="">Selecione...</option>
            <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
            <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
            <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
            <option value="Ensino Médio Completo">Ensino Médio Completo</option>
            <option value="Superior Incompleto">Superior Incompleto</option>
            <option value="Superior Completo">Superior Completo</option>
            <option value="Pós-graduação">Pós-graduação</option>
          </select>
        </div>

        <div class="form-group">
          <label for="endereco">Endereço:</label>
          <input type="text" id="endereco" v-model="form.endereco" />
        </div>

        <div class="form-group">
          <label for="cidade">Cidade:</label>
          <input type="text" id="cidade" v-model="form.cidade" />
        </div>

        <div class="form-group">
          <label for="estado">Estado:</label>
          <input type="text" id="estado" v-model="form.estado" />
        </div>

        <div class="form-group">
          <label for="etnia">Etnia:</label>
          <select id="etnia" v-model="form.etnia">
            <option disabled value="">Selecione...</option>
            <option value="Branca">Branca</option>
            <option value="Parda">Parda</option>
            <option value="Preta">Preta</option>
            <option value="Amarela">Amarela</option>
            <option value="Indígena">Indígena</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="contatosdeEmergencia">Contatos de Emergência (separados por vírgula):</label>
          <input
            type="text"
            id="contatosdeEmergencia"
            v-model="form.contatosdeEmergencia"
          />
        </div>

        <div class="form-group">
          <label for="processosJudiciais">Processos Judiciais:</label>
          <textarea id="processosJudiciais" v-model="form.processosJudiciais"></textarea>
        </div>

        <button type="submit" class="btn_cadastrarvitima">Cadastrar vítima</button>
      </form>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/store.js'


export default {
    setup() {
        const store = useAuthStore();
        return {
            store
        };
    },
    components: {
        SideBar,
    },
    data() {
        return {
            form: {
                nome: '',
                dataNascimento: '',
                cpf: '',
                email: '',
                telefone: '',
                genero: '',
                estadoCivil: '',
                profissao: '',
                escolaridade: '',
                endereco: '',
                cidade: '',
                estado: '',
                etnia: '',
                contatosdeEmergencia: '',
                processosJudiciais: '',
            },
        };
    },

    methods: {
        async cadastrarvitima() {
            const token = this.store.token;

            try {
                const contatosArray = this.form.contatosdeEmergencia
                    ? this.form.contatosdeEmergencia.split(',').map(c => c.trim())
                    : [];

                await Axios.post('https://libertlla.onrender.com/vitima', {
                    ...this.form,
                    contatosdeEmergencia: contatosArray,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Vítima cadastrada com sucesso!',
                    confirmButtonColor: '#9B287B',
                });
            } catch (error) {
                let errorMessage = "Erro ao cadastrar vítima.";
                if (error.response) {
                    if (error.response.status === 400) {
                        errorMessage = "Dados inválidos. Verifique e tente novamente.";
                    } else if (error.response.status === 409) {
                        errorMessage = "E-mail já cadastrado!";
                    } else if (error.response.status === 500) {
                        errorMessage = "Erro no servidor. Tente novamente mais tarde.";
                    }
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: errorMessage,
                    confirmButtonColor: '#d33',
                });
            }
        }

    }
};
</script>

<style scoped>
.cadastro_vitima {
    margin-left: 250px;
    padding: 20px;
    border-radius: 100px;
}

h1 {
    font-size: 30px;
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    margin-top: 20px;
    margin-left: 7px;
    color: #9B287B;
}

form {
    display: grid;
    gap: 25px;
    margin-top: 20px;
    align-items: start;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 10px;
}

.form-group input,
select,
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: 'Montserrat', sans-serif;
    box-sizing: border-box;
    resize: none;
}

.btn_cadastrarvitima {
    padding: 10px;
    background-color: #8b2276;
    border: none;
    border-radius: 4px;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
}

.btn_cadastrarvitima:hover {
    background-color: #9B287B;
}

input[type="file"] {
    font-size: 14px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
}

#adicionar_imagem {
    grid-column: 1 / -1;
}

@media (max-width: 768px) {
    .cadastro_vitima {
        margin-left: 0;
        padding: 15px;
    }

    form {
        grid-template-columns: 1fr;
        /* Um campo por vez em telas pequenas */
    }

    .form-group {
        width: 100%;
    }
}
</style>
