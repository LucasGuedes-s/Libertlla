<template>
    <div class="cadastro_profissional">
        <SideBar />
        <div class="container">
        <h1>Cadastrar Profissional</h1>
        <form>
            <div class="form-group">
                <label for="nome">Nome:</label>
                <input type="text" id="nome" name="nome" required>
            </div>

                <div class="form-group">
                    <label for="especialidade">Especialidade:</label>
                    <select id="especialide_profissional">
                        <option value="atendimento_humanizado">Atendimento Humanizado e Apoio a Vítimas</option>
                        <option value="delegada">Delegada</option>
                        <option value="pericia_criminal">Perícia Criminal</option>
                        <option value="policial">Policial</option>
                        <option value="policial_cibernetico">Policial Cibernética</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="text" id="email" name="email" required>
                </div>

                <div class="form-group">
                    <label for="senha">Senha:</label>
                    <input type="text" id="senha" name="senha" required>
                </div>


                <div class="form-group" id="adicionar_imagem">
                    <label for="imagem">Adicionar Imagem:</label>
                    <input type="file" id="imagem" name="imagem" accept="image/*">
                </div>

                <button type="submit" click="" class="btn_cadastrarprofissional">Cadastrar Profissional</button>
        </form>
        </div>
    </div>
</template>

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
    /* Ajuste a margem se necessário */
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
</style>

<script>

import SideBar from '@/components/SideBar.vue';

export default {
    
  components: {
    SideBar,
  },
}
</script>