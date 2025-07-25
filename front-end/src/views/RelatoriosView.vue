<template>
  <section>
    <SideBar />
    <div class="container">
      <div class="titulo-principal">Relatórios</div>
      <div class="charts-container">
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store.js';
import SideBar from '@/components/SideBar.vue';

Chart.register(...registerables);

export default {
  setup() {
    const store = useAuthStore();
    const totalDenuncias = ref(0);
    const totalOcorrencias = ref(0);
    const totalConversas = ref(0);
    const totalAtendidas = ref(0);
    const tiposViolencia = ref([]);
    const quantidadesViolencia = ref([]);

    const buscarTotalDenuncias = async () => {
      try {
        const token = store.token;
        const response = await axios.get("https://libertlla.onrender.com/todasocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        //totalDenuncias.value = response.data.totalDenuncias;
        totalOcorrencias.value = response.data.totalOcorrencias;
        totalConversas.value = response.data.totalConversas;
        totalAtendidas.value = response.data.totalAtendidas;
        renderPieChart();
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

        renderViolenceLineChart();
      } catch (error) {
        console.error("Erro ao buscar ocorrências por tipo:", error);
      }
    };

    const renderViolenceLineChart = () => {
      const canvas = document.getElementById("violenceLineChart");
      canvas.width = 1200; // Definir largura maior
      canvas.height = 400; // Ajustar altura
      
      const ctx = canvas.getContext("2d");

      new Chart(ctx, {
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
              tension: 0.3, // Suaviza as linhas
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
      const ctx = document.getElementById("pieChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Ocorrências por formulário", "Denuncia via chat", "Atendidas"],
          datasets: [
            {
              label: "Quantidade",
              data: [
                //totalDenuncias.value,
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

    onMounted(() => {
      buscarOcorrenciasPorTipo();
      buscarTotalDenuncias();
    });

    return {
      totalDenuncias,
      totalOcorrencias,
      totalConversas,
      totalAtendidas,
    };
  },
  components: {
    SideBar
  }
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
  .line-chart-container, .pie-chart-container {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
  }
}
</style>