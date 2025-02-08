<template>
    <SideBar v-if="sidebarVisible" />
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import axios from 'axios';
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
            ocorrencias: [],
        };
    },
    mounted() {
        axios.get(`http://localhost:3000/ocorrencias/${email}`).then(response => {
            this.ocorrencias = response.data.processos;
            console.log(this.ocorrencias[0].ocorrencias);
        })
            .catch(error => {
                console.error('Erro ao buscar ocorrências:', error);
            });

        console.log(this.store.usuario);
    },
};
</script>


<style scoped>

</style>