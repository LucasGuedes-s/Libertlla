<template>
    <div>
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
                            <input type="date" id="data" class="form-control" v-model="ocorrencia.data_denuncia" readonly  />
                        </div>
                        <div class="col-md-6">
                            <label for="tipoDenuncia" class="form-label">Tipo de denúncia:</label>
                            <input type="text" id="tipoDenuncia" class="form-control" v-model="ocorrencia.tipo_denuncia" readonly  />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="relacaoDenunciado" class="form-label">Relação com a Pessoa Denunciada:</label>
                            <input type="text" id="relacaoDenunciado" class="form-control" v-model="ocorrencia.agressor" readonly  />
                        </div>
                        <div class="col-md-6">
                            <label for="localOcorrido" class="form-label">Local do Ocorrido:</label>
                            <input type="text" id="localOcorrido" class="form-control" v-model="ocorrencia.local" readonly  />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição:</label>
                        <textarea id="descricao" class="form-control" rows="3" v-model="ocorrencia.descricao" readonly ></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="provas" class="form-label">Provas:</label>
                        <textarea id="provas" class="form-control" rows="3" v-model="ocorrencia.provas" readonly ></textarea>
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
        const token = this.store.token

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
                const response = await axios.get(`http://localhost:3000/ocorrencia/${id.value}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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
</style>
