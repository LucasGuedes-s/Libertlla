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
        const response = await axios.get("http://localhost:3000/todasocorrencias", {
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
        const response = await axios.get("http://localhost:3000/todas/ocorrencias", {
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
  width: 90%; /* Garantir que o contêiner ocupe toda a largura disponível */
  overflow: hidden; /* Evitar rolagem horizontal */
}

.line-chart-container {
  flex: 3; /* Gráfico de linhas ocupa 3 partes */
  height: 400px; /* Ajustar a altura */
}

.line-chart-container canvas {
  width: 90% !important;
  height: 100% !important;
}

.pie-chart-container {
  flex: 2; /* Gráfico de pizza ocupa 2 partes */
  height: 400px; /* Ajustar a altura */
}

.pie-chart-container canvas {
  width: 90% !important;
  height: 100% !important;
}

@media (max-width: 900px) {
  .container {
    margin-left: 0px;
    padding: 20px;
  }
  .charts-container {
    display: block;
    width: 100%;
  }
  .line-chart-container, .pie-chart-container {
    width: 100%; /* Para garantir que os gráficos ocupem toda a largura */
    height: 300px; /* Ajustar para o layout pequeno */
    margin-bottom: 20px;
  }
}
</style>
