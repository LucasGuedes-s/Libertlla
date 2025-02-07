const pdfService = require("../services/pdf.service");

async function gerarPdf(req, res){
  try {
    const pdfBuffer = await pdfService.criarPdf(req.params.id);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=report.pdf",
    });
    
    res.send(pdfBuffer);

  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar o PDF" });
  }
};

module.exports = {gerarPdf}