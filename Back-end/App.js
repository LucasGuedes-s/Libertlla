// Importar o Express
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const userRouter = require('../Back-end/routes/user.router')
const ocorrencias = require('../Back-end/routes/ocorrencia.router')

// Definir a porta do servidor
const PORT = 3000;
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Permite apenas seu domínio
        methods: ["GET", "POST"],
    },
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(express.json());

app.use(userRouter)
app.use(ocorrencias)

let adminSockets = [];  // Lista de administradores conectados
let activeChats = {};   // Mapeamento de chats ativos (socketId do cliente -> administrador)

io.on('connection', (socket) => {
    //console.log('Usuário conectado:', socket.id);

    // Verificar se o usuário é admin
    socket.on('admin connect', () => {
        adminSockets.push(socket);
        //console.log('Admin conectado:', socket.id);
    });

    // Quando um cliente solicita iniciar um chat
    socket.on('request chat', (username) => {
        //console.log(`${username} (${socket.id}) solicitou iniciar um chat`);

        // Verificar se já existe um chat ativo para este cliente
        if (activeChats[socket.id]) {
            socket.emit('chat error', 'Chat já está em andamento.');
            return;
        }

        // Notifica todos os administradores conectados
        adminSockets.forEach((admin) => {
            admin.emit('chat request', { username, socketId: socket.id });
        });
    });

    // Quando o admin aceita a solicitação de chat
    socket.on('accept chat', (clientSocketId) => {
        // Verificar se o chat já foi aceito
        if (activeChats[clientSocketId]) {
            socket.emit('chat error', 'Chat já foi aceito por outro administrador.');
            return;
        }

        // Registrar o administrador responsável pelo chat
        activeChats[clientSocketId] = socket.id;

        // Informar o cliente que o chat foi aceito
        io.to(clientSocketId).emit('chat accepted');
        //console.log(`Chat entre admin ${socket.id} e cliente ${clientSocketId} iniciado.`);

        // Informar outros administradores que o chat foi aceito
        adminSockets.forEach((admin) => {
            if (admin.id !== socket.id) {
                admin.emit('chat taken', { clientSocketId });
            }
        });
    });

    // Recebe mensagem de cliente ou admin
    socket.on("chat message", (data) => {
        //console.log("Mensagem recebida:", data);

        const { from, content } = data;
        const adminSocketId = activeChats[socket.id]; // Admin associado ao cliente

        if (adminSocketId) {
            // Enviar a mensagem para o admin responsável
            io.to(adminSocketId).emit("chat message", { from, content });
            //console.log(`Mensagem enviada para admin ${adminSocketId}:`, content);
        } else {
            // Enviar a mensagem para o cliente associado
            const clientSocketId = Object.keys(activeChats).find(
                key => activeChats[key] === socket.id
            );
            if (clientSocketId) {
                io.to(clientSocketId).emit("chat message", { from, content });
                //console.log(`Mensagem enviada para cliente ${clientSocketId}:`, content);
            }
        }
    });

    // Evento de desconexão
    socket.on('disconnect', () => {
        //console.log('Usuário desconectado:', socket.id);

        // Remover da lista de administradores, se aplicável
        adminSockets = adminSockets.filter((admin) => admin.id !== socket.id);

        // Encerrar chats ativos deste administrador
        for (const [clientSocketId, adminSocketId] of Object.entries(activeChats)) {
            if (adminSocketId === socket.id) {
                delete activeChats[clientSocketId];
                io.to(clientSocketId).emit('chat ended', 'Administrador desconectado.');
                //console.log(`Chat encerrado entre admin ${socket.id} e cliente ${clientSocketId}`);
            }
        }
    });
});

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
