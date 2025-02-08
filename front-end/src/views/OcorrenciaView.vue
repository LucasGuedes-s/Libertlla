<template>
    <SideBar v-if="sidebarVisible" />
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