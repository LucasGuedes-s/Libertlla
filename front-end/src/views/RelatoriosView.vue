<template>
  <section>
    <SideBar />
    <div class="container">
      <div class="titulo-principal">Relatórios</div>

      <div v-if="loading" class="loading-wrapper">
        <div class="spinner"></div>
      </div>

      <div v-else class="charts-container">
        <div class="line-chart-container">
          <canvas id="violenceLineChart"></canvas>
        </div>
        <div class="pie-chart-container">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store.js';
import SideBar from '@/components/SideBar.vue';

Chart.register(...registerables);

export default {
  setup() {
    const store = useAuthStore();

    const loading = ref(true);

    const totalDenuncias = ref(0);
    const totalOcorrencias = ref(0);
    const totalConversas = ref(0);
    const totalAtendidas = ref(0);
    const tiposViolencia = ref([]);
    const quantidadesViolencia = ref([]);

    // Guardar instâncias dos gráficos para destruir antes de recriar
    let violenceChart = null;
    let pieChart = null;

    const buscarTotalDenuncias = async () => {
      try {
        const token = store.token;
        const response = await axios.get("https://libertlla.onrender.com/todasocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        totalOcorrencias.value = response.data.totalOcorrencias;
        totalConversas.value = response.data.totalConversas;
        totalAtendidas.value = response.data.totalAtendidas;
      } catch (error) {
        console.error("Erro ao buscar total de denúncias:", error);
      }
    };

    const buscarOcorrenciasPorTipo = async () => {
      try {
        const token = store.token;
        const response = await axios.get("https://libertlla.onrender.com/todas/ocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });

        tiposViolencia.value = response.data.ocorrencias.map(o => o.tipo);
        quantidadesViolencia.value = response.data.ocorrencias.map(o => o.quantidade);
      } catch (error) {
        console.error("Erro ao buscar ocorrências por tipo:", error);
      }
    };

    const renderViolenceLineChart = () => {
      const canvas = document.getElementById("violenceLineChart");
      if (!canvas) {
        console.error("Canvas 'violenceLineChart' não encontrado no DOM");
        return;
      }
      if (violenceChart) violenceChart.destroy();
      const ctx = canvas.getContext("2d");

      violenceChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: tiposViolencia.value,
          datasets: [
            {
              label: "Ocorrências por Tipo de Violência",
              data: quantidadesViolencia.value,
              borderColor: "#9B287B",
              backgroundColor: "rgba(155, 40, 123, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    };

    const renderPieChart = () => {
      const canvas = document.getElementById("pieChart");
      if (!canvas) {
        console.error("Canvas 'pieChart' não encontrado no DOM");
        return;
      }
      if (pieChart) pieChart.destroy();
      const ctx = canvas.getContext("2d");

      pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Ocorrências por formulário", "Denuncia via chat", "Atendidas"],
          datasets: [
            {
              label: "Quantidade",
              data: [
                totalOcorrencias.value,
                totalConversas.value,
                totalAtendidas.value,
              ],
              backgroundColor: ["#7A1A62", "#B33A8C", "#C05B9D"],
            },
          ],
        },
      });
    };

    onMounted(async () => {
      loading.value = true;

      await Promise.all([buscarOcorrenciasPorTipo(), buscarTotalDenuncias()]);
      loading.value = false;  
      await nextTick(); 

      renderViolenceLineChart();
      renderPieChart();
    });

    return {
      loading,
      totalDenuncias,
      totalOcorrencias,
      totalConversas,
      totalAtendidas,
    };
  },
  components: {
    SideBar,
  },
};
</script>

<style scoped>
.container {
  margin-left: 250px;
  padding: 20px;
  max-width: calc(100vw - 250px);
  box-sizing: border-box;
}

.titulo-principal {
  font-size: 30px;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 7px;
  color: #9B287B;
}

.charts-container {
  display: flex;
  margin-top: 80px;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.line-chart-container {
  flex: 3;
  height: 400px;
}

.line-chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.pie-chart-container {
  flex: 2;
  height: 400px;
}

.pie-chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #9B287B;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .container {
    margin-left: 0;
    max-width: 100vw;
    padding: 20px;
  }

  .charts-container {
    display: block;
    width: 100%;
  }

  .line-chart-container,
  .pie-chart-container {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
}
</style>
