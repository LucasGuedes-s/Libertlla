const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf.controller");

router.get("/ocorrencia/pdf/:id", pdfController.gerarPdf);

module.exports = router;
