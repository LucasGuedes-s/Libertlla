<template>
    <div class="wrapper">
        <SideBar v-if="sidebarVisible" />
        <div class="container mt-4" style="margin-left: 250px;">
            <div class="card">
                <div class="card-header bg-light">
                    <h5 class="text-primary">Denúncia - {{ id }}</h5>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="data" class="form-label">Data:</label>
                            <input type="date" id="data" class="form-control" v-model="ocorrencia.data_denuncia" readonly />
                        </div>
                        <div class="col-md-6">
                            <label for="tipoDenuncia" class="form-label">Tipo de denúncia:</label>
                            <input type="text" id="tipoDenuncia" class="form-control"
                                v-model="ocorrencia.tipo_denuncia" readonly />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="relacaoDenunciado" class="form-label">Relação com a Pessoa Denunciada:</label>
                            <input type="text" id="relacaoDenunciado" class="form-control"
                                v-model="ocorrencia.agressor" readonly />
                        </div>
                        <div class="col-md-6">
                            <label for="localOcorrido" class="form-label">Local do Ocorrido:</label>
                            <input type="text" id="localOcorrido" class="form-control" v-model="ocorrencia.local" readonly />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição:</label>
                        <textarea id="descricao" class="form-control" rows="3"
                            v-model="ocorrencia.descricao" readonly></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="provas" class="form-label">Provas:</label>
                        <textarea id="provas" class="form-control" rows="3" v-model="ocorrencia.provas" readonly></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/store';

export default {
    components: { SideBar },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const store = useAuthStore();
        const sidebarVisible = ref(true);
        const ocorrencia = ref({
            data_denuncia: '',
            tipo_denuncia: '',
            tipo_violencia: '',
            agressor: '',
            provas: '',
            descricao: '',
            local: ''
        });

        const id = computed(() => props.id);

        // Função que será chamada quando o componente for montado
        onMounted(async () => {
            try {
                const response = await axios.get(`http://localhost:3000/ocorrencia/${id.value}`);

                if (response.data.ocorrencia) {
                    // Preenche os dados da ocorrência nos campos
                    const dados = response.data.ocorrencia;
                    ocorrencia.value = {
                        data_denuncia: dados.data_denuncia.slice(0, 10), // Convertendo a data para o formato "YYYY-MM-DD"
                        tipo_denuncia: dados.tipo_denuncia,
                        tipo_violencia: dados.tipo_violencia,
                        agressor: dados.agressor,
                        provas: dados.provas.join(', '), // Unindo provas como uma string (caso sejam múltiplas)
                        descricao: dados.descricao,
                        local: dados.local
                    };
                } else {
                    console.log("Nenhuma ocorrência encontrada para o ID:", id.value);
                }
            } catch (error) {
                console.error('Erro ao buscar ocorrências:', error);
            }
        });

        return {
            store,
            id,
            sidebarVisible,
            ocorrencia // Passando as informações da ocorrência para o template
        };
    }
};
</script>


<style scoped>

.wrapper {
    display: flex;
    justify-content: center;
}
.container {
    width: 90%;
    max-width: 1300px;
    background: #FFFFFF;
    margin: 0 auto;
    padding: 20px;
}

@media (min-width: 1024px) {
    .container {
        max-width: 90%;
    }
}

.card-header {
    background: #FFFFFF !important;
    border-bottom: 1px solid #D9D9D9;
}

h5.text-primary {
    color: #9B287B !important;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 30px;
}

.form-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: rgba(126, 126, 126, 0.8);
}

.form-control {
    border: 1px solid #D9D9D9;
    border-radius: 5px;
    font-size: 16px;
    color: #333;
}

textarea.form-control {
    height: 111px;
    resize: none;
}

/* Linha do tempo */
.timeline {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #7E7E7E;
    text-align: center;
    color: #D9D9D9;
    font-size: 45px;
    font-weight: 700;
    font-family: 'Montserrat', sans-serif;
}   
</style>
