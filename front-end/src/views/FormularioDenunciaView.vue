<template>
    <div>
        <header>
            <img src="../assets/imagemcabeçalho.png" alt="Imagem de Cabeçalho" class="header-image">
        </header>
        <div class="form-container">
            <h1>Denúncia Anônima</h1>
            <form @submit.prevent="realizarDenuncia">
                <div class="form-group">
                    <label for="">Tipo de Violência:</label>
                    <select name="tipodeviolencia" id="tipodeviolencia" v-model="tipodeviolencia">
                        <option value="Violencia doméstica">Violência Doméstica</option>
                        <option value="Agressão fisica ou verbal">Agressão Física ou Verbal</option>
                        <option value="Assédio">Assédio</option>
                        <option value="Abuso sexual">Abuso Sexual</option>
                        <option value="Ameaça ou intimidação">Ameaça ou Intimidação</option>
                        <option value="Perseguicao ou stalking">Perseguição ou Stalking</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="">Relação com o Agressor:</label>
                    <select name="relacao_agressor" id="relacao_agressor" v-model="relacao_agressor">
                        <option value="parente_familiar">Parente | Familiar</option>
                        <option value="desconhecido">Desconhecido(a)</option>
                        <option value="amigo">Amigo(a)</option>
                        <option value="companheiro">Companheiro(a)</option>
                        <option value="ex_companheiro">Ex-companheiro(a)</option>
                        <option value="colega_trabalho">Colega de trabalho</option>
                    </select>
                </div>
                
                <div class="form-group" id="descricao">
                    <label for="descricao">Descrição:</label>
                    <textarea id="descricao" name="descricao" rows="8" v-model="descricao"></textarea>
                </div>

                <div class="form-group" id="data_ocorrido">
                    <label for="data_ocorrido">Data do Ocorrido:</label>
                    <input type="date" id="data" name="data" v-model="data_ocorrido">
                </div>

                <div class="form-group" id="anexo_provas">
                    <label for="anexo_provas">Anexar Provas:</label>
                    <input type="file" id="anexo_provas" name="anexo_provas" accept="image/*"
                        @change="handleFileChange">
                </div>

                <div class="form-group" id="local_do_ocorrido">
                    <label for="local_do_ocorrido">Local do Ocorrido:</label>
                    <textarea id="local_do_ocorrido" name="local_do_ocorrido" v-model="local_do_ocorrido" rows="1"
                        placeholder="Rua, Bairro, Nº de Residência..."></textarea>
                </div>

                <button type="submit" click="realizarDenuncia" class="btn_realizardenuncia">Realizar Denúncia!</button>

            </form>
        </div>
    </div>
</template>


<style scoped>
body {
    background-color: #4D1032 !important;
    font-family: "Montserrat", sans-serif;
    margin: 0;
    padding: 0;
}


header img {
    width: 100%;
    /* Imagem vai ocupar toda a largura disponível */
    height: auto;
    /* Manter a proporção da imagem */
}


h1 {
    margin-top: 10px;
    margin-bottom: 20px;
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    font-size: 32px;
}

.form-container {
    width: 95%;
    margin: 48px auto;
    padding: 32px;
    border-radius: 10px;
    border: 1px solid #FF00AE;
    color: white;
}

form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    /* Ajuste o espaço entre os campos */
    align-items: start;
}


.form-group {
    display: flex;
    flex-direction: column;
}


.form-group label {
    margin-bottom: 10px;
    /* Ajuste a margem se necessário */
}


.form-group input,
select,
textarea {
    width: 100%;
    padding: 10px;
    color: white;
    border: 1px solid #FF00AE;
    border-radius: 4px;
    background-color: #4D1032;
    font-family: 'Montserrat', sans-serif;
    box-sizing: border-box;
    /* Garantir que padding e border não aumentem o tamanho total */
    resize: none;
}

::placeholder {
    color: white;
    font-size: 14px;
}

select option:hover {
    background-color: #ffcc00;
    color: white;
}

#descricao,
#adicionar_imagem,
#local_do_ocorrido,
#anexo_provas,
#data_ocorrido {
    grid-column: 1 / -1;
}


h2 {
    margin-bottom: 10px;
}


.btn_realizardenuncia {
    grid-column: 1 / -1;
    padding: 10px;
    background-color: #5C164E;
    border: none;
    border-radius: 4px;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    cursor: pointer;
    width: 100%;
    margin-top: 10px;
}


.btn_realizardenuncia:hover {
    background-color: #FF00AE;
    /* Cor alterada quando o mouse passa por cima (exemplo: verde mais escuro) */
}

@media (max-width: 768px) {
    h1 {
        font-size: 25px;
    }

    form {
        grid-template-columns: 1fr;
    }

    .btn_realizardenuncia {
        padding: 10px;
    }
}
</style>
<script>
import axios from 'axios';
import Swal from 'sweetalert2';


export default {
    name: 'FormularioDenuncia',
    data() {
        return {
            tipodeviolencia: '',
            local_do_ocorrido: '',
            relacao_agressor: '',
            data_ocorrido: '',
            descricao: '',
            file: null,
            provas: []
        };
    },
    mounted() {
        document.body.style.backgroundColor = "#4D1032";
    },
    beforeUnmount() {
        document.body.style.backgroundColor = "";
    },
    methods: {
        handleFileChange(event) {
            this.file = event.target.files[0];
        },

        async uploadFile() {
            if (!this.file) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Erro',
                    text: 'Por favor, selecione um arquivo antes de enviar!',
                });
                return null;
            }

            const formData = new FormData();
            formData.append("file", this.file);

            try {
                const response = await fetch("https://libertlla.onrender.com/upload", {
                    method: "POST",
                    body: formData,
                });


                if (!response.ok) {
                    throw new Error('Erro ao enviar o arquivo');
                }


                const data = await response.json();
                return data.fileUrl; // Retorna a URL da imagem enviada


            } catch (error) {
                console.error('Erro no upload:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro no Upload',
                    text: 'Houve um problema ao enviar a imagem.',
                });
                return null;
            }
        },

        async realizarDenuncia() {
            try {
                let fileUrl = null;
                if (this.file) {
                    fileUrl = await this.uploadFile();
                    if (fileUrl) {
                        this.provas.push(fileUrl);
                    }
                }

                const response = await axios.post("https://libertlla.onrender.com/cadastrar/ocorrencia", {
                    ocorrencias: {
                        tipo_denuncia: this.tipodeviolencia,
                        tipo_violencia: this.tipodeviolencia,
                        agressor: this.relacao_agressor,
                        provas: this.provas,
                        descricao: this.descricao,
                        local: this.local_do_ocorrido,
                        data_ocorrencia: this.data_ocorrido
                    }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Denúncia realizada com sucesso',
                    text: `Denúncia ID: ${response.data.ocorrencia}`,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });


                // Resetando os campos após o envio
                this.tipodeviolencia = '';
                this.relacao_agressor = '';
                this.provas = [];
                this.descricao = '';
                this.local_do_ocorrido = '';
                this.data_ocorrido = '';
                this.file = null;

                // Resetando input file
                document.getElementById("anexo_provas").value = "";


            } catch (error) {
                console.error('Erro ao enviar denúncia:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível enviar a denúncia.',
                });
            }
        }
    }
}
</script>
