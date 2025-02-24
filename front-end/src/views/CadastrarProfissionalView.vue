<template>
    <div class="cadastro_profissional">
        <SideBar />
        <div class="container">
            <h1>Cadastrar Profissional</h1>
            <form @submit.prevent="cadastrarProfissional">
                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" v-model="form.nome" required>
                </div>

                <div class="form-group">
                    <label for="especialidade">Especialidade:</label>
                    <select id="especialide_profissional" v-model="form.especialidade">
                        <option value="delegada">Delegada</option>
                        <option value="pericia criminal">Perícia Criminal</option>
                        <option value="policial">Policial</option>
                        <option value="policial cibernetico">Policial Cibernética</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="form.email" required>
                </div>

                <div class="form-group">
                    <label for="senha">Senha:</label>
                    <input type="password" id="senha" v-model="form.senha" required>
                </div>

                <div class="form-group" id="adicionar_imagem">
                    <label for="imagem">Adicionar Imagem:</label>
                    <input type="file" id="imagem" @change="handleFileChange">
                </div>

                <button type="submit" class="btn_cadastrarprofissional">Cadastrar Profissional</button>
            </form>
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import Axios from 'axios';
import Swal from 'sweetalert2';

export default {
    components: {
        SideBar,
    },
    data() {
        return {
            form: {
                nome: '',
                especialidade: '',
                email: '',
                senha: '',
            },
            uploadStatus: "",
            imageUrl: "",
            file: null,  // Novo campo para armazenar o arquivo
        };
    },
    methods: {
        handleFileChange(event) {
            this.file = event.target.files[0]; // Salvar o arquivo selecionado
        },
        async uploadFile() {
            try {
                if (!this.file) {
                    this.uploadStatus = "Por favor, selecione um arquivo.";
                    return null;
                }

                const formData = new FormData();
                formData.append("file", this.file);
                console.log(FormData)

                const response = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                this.uploadStatus = "Arquivo enviado com sucesso!";
                this.imageUrl = data.fileUrl;
            } catch (error) {
                this.imageUrl = 'https://pub-7033c876e51c4727bbbad298adf1917c.r2.dev/uploads/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black-thumbnail.png'
            }

        },
        async cadastrarProfissional() {
            //const token = this.store.token
            if (this.file) {
                const fileUrl = await this.uploadFile();
                if (fileUrl) {
                    anexos.push(fileUrl);
                }
            }
            try {
                console.log(this.form.especialidade)
                await Axios.post('http://localhost:3000/cadastrar/profissional', {
                    usuario: {
                        nome: this.form.nome,
                        especialidade: this.form.especialidade,
                        email: this.form.email,
                        senha: this.form.senha,
                        foto: this.imageUrl
                    }
                })
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Profissional cadastrado com sucesso!',
                    confirmButtonColor: '#9B287B',
                });
            } catch (error) {
                let errorMessage = "Erro ao cadastrar profissional.";
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
.cadastro_profissional {
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

.btn_cadastrarprofissional {
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

.btn_cadastrarprofissional:hover {
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
    .cadastro_profissional {
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
