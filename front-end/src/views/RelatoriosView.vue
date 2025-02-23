<template>
  <div>
  <SideBar />
  <div class="chart-container">
    <canvas id="lineChart"></canvas>
    <canvas id="barChart"></canvas>
    <canvas id="pieChart"></canvas>
  </div>
</div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store.js';
import SideBar from '@/components/SideBar.vue';

Chart.register(...registerables);

export default {
  setup() {
    const store = useAuthStore();
    const ocorrencias = ref([]);
    const totalDenuncias = ref(0);
    const totalOcorrencias = ref(0);
    const totalConversas = ref(0);
    const totalAtendidas = ref(0);

    const buscarOcorrencias = async () => {
      try {
        const token = store.token;
        if (!token) {
          window.location.href = '/nao-autorizado';
          return;
        }
        const response = await axios.get("http://localhost:3000/ocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        ocorrencias.value = response.data.ocorrencias;
        renderLineChart();
      } catch (error) {
        console.error("Erro ao buscar ocorrências:", error);
      }
    };

    const buscarTotalDenuncias = async () => {
      try {
        const token = store.token;
        const response = await axios.get("http://localhost:3000/todasocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        totalDenuncias.value = response.data.totalDenuncias;
        totalOcorrencias.value = response.data.totalOcorrencias;
        totalConversas.value = response.data.totalConversas;
        totalAtendidas.value = response.data.totalAtendidas;
        renderBarChart();
        renderPieChart();
      } catch (error) {
        console.error("Erro ao buscar total de denúncias:", error);
      }
    };

    const renderLineChart = () => {
      const ctx = document.getElementById("lineChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ocorrencias.value.map((o) => o.data),
          datasets: [
            {
              label: "Ocorrências Registradas",
              data: ocorrencias.value.map((o) => o.quantidade),
              borderColor: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              fill: true,
            },
          ],
        },
      });
    };

    const renderBarChart = () => {
      const ctx = document.getElementById("barChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Denúncias", "Ocorrências", "Conversas", "Atendidas"],
          datasets: [
            {
              label: "Totais",
              data: [
                totalDenuncias.value,
                totalOcorrencias.value,
                totalConversas.value,
                totalAtendidas.value,
              ],
              backgroundColor: ["red", "blue", "green", "purple"],
            },
          ],
        },
      });
    };

    const renderPieChart = () => {
      const ctx = document.getElementById("pieChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Denúncias", "Ocorrências", "Conversas", "Atendidas"],
          datasets: [
            {
              label: "Distribuição",
              data: [
                totalDenuncias.value,
                totalOcorrencias.value,
                totalConversas.value,
                totalAtendidas.value,
              ],
              backgroundColor: ["#9B287B", "#7A1A62", "#B33A8C", "#C05B9D"],
            },
          ],
        },
      });
    };

    onMounted(() => {
      buscarOcorrencias();
      buscarTotalDenuncias();
    });

    return {
      ocorrencias,
      totalDenuncias,
      totalOcorrencias,
      totalConversas,
      totalAtendidas,
    };
  },
  components:{
    SideBar
  }
};
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
  margin-left: 250px; /* Ajuste para acomodar o sidebar */
}
canvas {
  max-width: 300px;
  max-height: 300px;
  margin: 20px;
}
</style>