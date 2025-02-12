<template>
    <div>
        <SideBar v-if="sidebarVisible" />
        <div class="container mt-4" style="margin-left: 250px;">
            <div class="card">
                <div class="card-header bg-light">
                    <h5 class="text-primary">Denúncia - (Código)</h5>
                </div>
                <div class="card-body">
                    <form>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="data" class="form-label">Data:</label>
                                <input type="date" id="data" class="form-control" v-model="form.data" />
                            </div>
                            <div class="col-md-6">
                                <label for="tipoDenuncia" class="form-label">Tipo de denúncia:</label>
                                <input type="text" id="tipoDenuncia" class="form-control" v-model="form.tipoDenuncia" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="relacaoDenunciado" class="form-label">Relação com a Pessoa
                                    Denunciada:</label>
                                <input type="text" id="relacaoDenunciado" class="form-control"
                                    v-model="form.relacaoDenunciado" />
                            </div>
                            <div class="col-md-6">
                                <label for="localOcorrido" class="form-label">Local do Ocorrido:</label>
                                <input type="text" id="localOcorrido" class="form-control"
                                    v-model="form.localOcorrido" />
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="descricao" class="form-label">Descrição:</label>
                            <textarea id="descricao" class="form-control" rows="3" v-model="form.descricao"></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="provas" class="form-label">Provas:</label>
                            <textarea id="provas" class="form-control" rows="3" v-model="form.provas"></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SideBar from '@/components/SideBar.vue';
//import axios from 'axios';
import { useAuthStore } from '@/store';

export default {
    components: {
        SideBar,
    },
    setup() {
        const store = useAuthStore();
        return {
            store,
        };
    },
    data() {
        return {
            sidebarVisible: true,
            ocorrencia: [],
            form: {
                data: "",
                tipoDenuncia: "",
                relacaoDenunciado: "",
                localOcorrido: "",
                descricao: "",
                provas: ""
            }
        };
    },
    mounted() {
        /*
        axios.get(`http://localhost:3000/ocorrencias/${email}`)
        .then(response => {
            this.ocorrencia = response.data;
        })
        .catch(error => {
            console.error('Erro ao buscar ocorrências:', error);
        });*/
    },
};
</script>


<style scoped>
</style>