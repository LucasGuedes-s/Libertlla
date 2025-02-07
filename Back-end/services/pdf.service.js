const { jsPDF } = require("jspdf");
const ocorrencias = require("../services/ocorrencias.service")
require("jspdf-autotable"); // Importa a biblioteca para tabelas


async function criarPdf(req, res) {
  try {
    const doc = new jsPDF();

    // Obtém os dados da ocorrência
    const ocorrencia = await ocorrencias.GetOcorrencia(req);

    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }

    // Data e hora atuais
    const dataAtual = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    // Função para validar os textos
    const safeText = (text) => (text !== undefined && text !== null ? String(text) : "Não informado");

    // Configuração do título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(92, 22, 78); // Cor #5C164E
    const pageWidth = doc.internal.pageSize.width;
    
    doc.text("RELATÓRIO DE OCORRÊNCIA POLICIAL", pageWidth / 2, 20, { align: "center" });

    // Criar a tabela com os detalhes da ocorrência
    doc.autoTable({
      startY: 30, // Começa a tabela após o cabeçalho
      head: [["Campo", "Detalhes"]], // Cabeçalhos da tabela
      body: [
        ["ID", safeText(ocorrencia.id)],
        ["Tipo de Denúncia", safeText(ocorrencia.tipo_denuncia)],
        ["Tipo de Violência", safeText(ocorrencia.tipo_violencia)],
        ["Agressor", safeText(ocorrencia.agressor)],
        ["Descrição", safeText(ocorrencia.descricao)],
        ["Local", safeText(ocorrencia.local)],
        ["Data da Ocorrência", safeText(ocorrencia.data_ocorrencia)],
        ["Data da Denúncia", safeText(new Date(ocorrencia.data_denuncia).toLocaleDateString("pt-BR"))],
        ["Status", safeText(ocorrencia.status)],
      ],
      theme: "grid", // Estilo da tabela
      styles: {
        fontSize: 10, // Tamanho da fonte
        textColor: [0, 0, 0], // Cor do texto (preto)
        lineColor: [0, 0, 0], // Cor da borda das células
        lineWidth: 0.1, // Espessura da borda
      },
      headStyles: {
        fillColor: [92, 22, 78], // Cor de fundo do cabeçalho (#5C164E)
        textColor: [255, 255, 255], // Cor do texto no cabeçalho (branco)
        fontSize: 12, // Tamanho da fonte do cabeçalho
        fontStyle: "bold", // Negrito
      }
    });

    // Se houver provas, criar uma tabela separada
    if (Array.isArray(ocorrencia.provas) && ocorrencia.provas.length > 0) {
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10, // Posiciona abaixo da primeira tabela
        head: [["Provas"]],
        body: ocorrencia.provas.map((prova) => [safeText(prova)]),
        theme: "grid",
        headStyles: {
          fillColor: [92, 22, 78], // Cor de fundo do cabeçalho (#5C164E)
          textColor: [255, 255, 255], // Cor do texto no cabeçalho (branco)
          fontSize: 12, // Tamanho da fonte do cabeçalho
          fontStyle: "bold", // Negrito
        }
      });
    }

    // Barra inferior colorida
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(92, 22, 78); // Cor #5C164E
    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

    // Data no canto inferior direito
    doc.setTextColor(255, 255, 255); // Texto branco
    doc.setFontSize(10);
    doc.text(`Gerado em: ${dataAtual}`, pageWidth - 60, pageHeight - 5);

    // Retorna o PDF como buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return pdfBuffer;
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({ error: "Erro ao gerar o PDF" });
  }
}

module.exports = { criarPdf };
