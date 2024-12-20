// Importar o Express
const express = require('express');
const app = express();
const userRouter = require('../Back-end/routes/user.router')
const ocorrencias = require('../Back-end/routes/ocorrencia.router')
const cors = require('cors');

// Definir a porta do servidor
const PORT = 3000;
app.use(cors({
    origin: '*', // Ajuste para a origem do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // Se você estiver lidando com cookies
  }));

// Criar uma rota básica
app.get('/', (req, res) => {
    res.send('Olá, mundo');
});
app.use(express.json());

app.use(userRouter)
app.use(ocorrencias)

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
