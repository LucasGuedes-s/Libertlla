<template>
    <div>
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
                                <input type="date" id="data" class="form-control" v-model="ocorrencia.data_denuncia"
                                    readonly />
                            </div>
                            <div class="col-md-6">
                                <label for="tipoDenuncia" class="form-label">Tipo de violência:</label>
                                <input type="text" id="tipoDenuncia" class="form-control"
                                    v-model="ocorrencia.tipo_violencia" readonly />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="relacaoDenunciado" class="form-label">Relação com a Pessoa
                                    Denunciada:</label>
                                <input type="text" id="relacaoDenunciado" class="form-control"
                                    v-model="ocorrencia.agressor" readonly />
                            </div>
                            <div class="col-md-6">
                                <label for="localOcorrido" class="form-label">Local do Ocorrido:</label>
                                <input type="text" id="localOcorrido" class="form-control" v-model="ocorrencia.local"
                                    readonly />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="descricao" class="form-label">Descrição:</label>
                            <textarea id="descricao" class="form-control" rows="3" v-model="ocorrencia.descricao"
                                readonly></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="provas" class="form-label">Provas:</label>
                            <textarea id="provas" class="form-control" rows="3" v-model="ocorrencia.provas"
                                readonly></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container mt-5">
    <h2 class="text-center mb-4 text-muted">Linha do tempo</h2>
    <div class="timeline">
        <div v-for="(registro, index) in ocorrencia.registros" :key="registro.id" class="timeline-item" :class="{ 'left': index % 2 === 0, 'right': index % 2 !== 0 }">
    <div class="timeline-box">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">{{ registro.ocorrenciaId }}</h5>
                <p class="card-text">{{ registro.descricoes }}</p>
                <span class="text-muted">{{ new Date(registro.data).toLocaleString() }}</span>
            </div>
        </div>
    </div>
    <div class="timeline-dot"></div>
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
            tipo_violencia: '',
            agressor: '',
            provas: '',
            descricao: '',
            local: '',
            registros: []
        });

        const id = computed(() => props.id);

        onMounted(async () => {
            try {
                const response = await axios.get(`http://localhost:3000/ocorrencia/${id.value}`);
                console.log(response.data.ocorrencia)
                //const eventos = response.data.ocorrencia
                if (response.data && response.data.ocorrencia) {
                    const dados = response.data.ocorrencia;
                    ocorrencia.value = {
                        data_denuncia: dados.data_denuncia?.slice(0, 10) || '',
                        tipo_violencia: dados.tipo_violencia || '',
                        agressor: dados.agressor || '',
                        provas: Array.isArray(dados.provas) ? dados.provas.join(', ') : '',
                        descricao: dados.descricao || '',
                        local: dados.local || '',
                        registros: response.data.ocorrencia.registros || [] // <-- Garante que registros são preenchidos
                    };
                } else {
                    console.warn("Nenhuma ocorrência encontrada para o ID:", id.value);
                }
            } catch (error) {
                console.error('Erro ao buscar ocorrência:', error);
            }
        });
 
        return {
            store,
            id,
            sidebarVisible,
            ocorrencia
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
.timeline {
    position: relative;
    max-width: 800px; /* Limita a largura da linha do tempo */
    margin: auto;
    padding: 20px 0;
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin-bottom: 30px;
    width: 100%;
}

.timeline-box {
    width: 48%; /* Ajustado para dar mais espaço aos itens */
    margin: 0 10px; /* Espaçamento entre os itens */
    box-sizing: border-box;
}

.left .timeline-box {
    order: -1; /* Coloca os itens à esquerda */
    text-align: right;
}

.right .timeline-box {
    order: 1; /* Coloca os itens à direita */
    text-align: left;
}

.timeline-item .card {
    width: 100%;
}

.timeline-item .card-body {
    padding: 10px 20px;
}

/* Adicionar margem para a linha do tempo centralizada */
.timeline::after {
    content: "";
    position: absolute;
    width: 2px;
    background: #ddd;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -1px;
}

</style>