<template>
    <div class="form-container">   
        <h1>Denúncia Anônima</h1>
        <form @submit.prevent="realizarDenuncia">
            <div class="form-group">
                <label for="">Tipo de Violência:</label>
                <select name="tipodeviolencia" id="tipodeviolencia"  v-model="tipodeviolencia">
                    <option value="violencia_domestica">Violência Doméstica</option>
                    <option value="agressão_fisica_ou_verbal">Agressão Física ou Verbal</option>
                    <option value="assedio">Assédio</option>
                    <option value="abuso_sexual">Abuso Sexual</option>
                    <option value="ameaca_ou_intimidação">Ameaça ou Intimidação</option>
                    <option value="perseguicao_ou_stalking">Perseguição ou Stalking</option>
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
                <input type="file" id="anexo_provas" name="anexo_provas" accept="image/*">
            </div>

            <div class="form-group" id="local_do_ocorrido">
                <label for="local_do_ocorrido">Local do Ocorrido:</label>
                <textarea id="local_do_ocorrido" name="local_do_ocorrido" v-model="local_do_ocorrido" rows="1" placeholder="Rua, Bairro, Nº de Residência..."></textarea>
            </div>

            <button type="submit" click="realizarDenuncia" class="btn_realizardenuncia">Realizar Denúncia!</button>

        </form>
    </div>
</template>

<style scoped>
body {
    background-color: #4D1032 !important;
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
}

header{
    width: 100%; 
    height: auto;
}

h1 {
    margin-top: 10px;
}

.form-container {
    width: 90%;
    margin: 3rem auto;
    padding: 2rem;
    border-radius: 10px;
    border: 1px solid #FF00AE;
    color: white;
}

form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px; /* Ajuste o espaço entre os campos */
    align-items: start;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 10px; /* Ajuste a margem se necessário */
}

.form-group input, select, textarea {
    width: 100%;
    padding: 10px;
    color: white;
    border: 1px solid #FF00AE;
    border-radius: 4px;
    background-color: #4D1032;
    font-family: 'Montserrat', sans-serif;
    box-sizing: border-box; /* Garantir que padding e border não aumentem o tamanho total */
    resize: none;
}

::placeholder {
    color: white;
}

select option:hover {
    background-color: #ffcc00;  /* Cor de fundo da opção ao passar o mouse */
    color: white;               /* Cor do texto da opção ao passar o mouse */
}

#descricao, #adicionar_imagem, #local_do_ocorrido, #anexo_provas, #data_ocorrido {
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
    background-color: #FF00AE; /* Cor alterada quando o mouse passa por cima (exemplo: verde mais escuro) */
}
</style>
<script>
import axios from 'axios';

export default {
    name: 'FormularioDenuncia',
    data() {
        return {
            tipodeviolencia: '',
            local_do_ocorrido: '',
            relacao_agressor: '',
            data_ocorrido: '',
            descricao: ''
        }
    },
    mounted() {
        document.body.style.backgroundColor = "#4D1032"; // Define a cor específica para esta página
    },
    beforeUnmount() {
        document.body.style.backgroundColor = ""; // Reseta a cor ao sair da página
    },
    methods:{
        async realizarDenuncia() {
            await axios.post("http://localhost:3000/cadastrar/ocorrencia", {
            ocorrencias: {
                    tipo_denuncia: this.tipodeviolencia,
                    tipo_violencia: this.tipodeviolencia,
                    agressor: this.relacao_agressor,
                    provas: [],
                    descricao: this.descricao,
                    local: this.local_do_ocorrido,
                    data_ocorrencia: this.data_ocorrido
            }
            })
            .then((response) => {
                console.log("Ocorrência cadastrada com sucesso:", response.data);
            })
            .catch((error) => {
                console.error("Erro ao cadastrar a ocorrência:", error);
            });

    },
    }
}
</script>