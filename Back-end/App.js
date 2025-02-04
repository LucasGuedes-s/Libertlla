// Importar dependências
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Inicializar o Prisma
const prisma = new PrismaClient();

// Configuração do Express
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json());

// Importar rotas
const userRouter = require('../Back-end/routes/user.router');
const ocorrencias = require('../Back-end/routes/ocorrencia.router');
app.use(userRouter);
app.use(ocorrencias);

// Criar servidor HTTP e configurar Socket.io
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Gerenciamento de conexões e chats
let adminSockets = new Set();  // Conjunto de admins conectados
let activeChats = new Map();   // Mapeia cliente → admin
let chatMessages = new Map();  // Armazena mensagens do chat antes de salvar

io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Quando um administrador se conecta
    socket.on('admin connect', () => {
        adminSockets.add(socket);
        console.log('Admin conectado:', socket.id);
    });

    // Cliente solicita iniciar um chat
    socket.on('request chat', (username) => {
        if (activeChats.has(socket.id)) {
            socket.emit('chat error', 'Chat já está em andamento.');
            return;
        }
        adminSockets.forEach((admin) => {
            admin.emit('chat request', { username, socketId: socket.id });
        });
    });

    // Administrador aceita um chat
    socket.on('accept chat', (clientSocketId) => {
        if (activeChats.has(clientSocketId)) {
            socket.emit('chat error', 'Chat já foi aceito por outro administrador.');
            return;
        }
        activeChats.set(clientSocketId, socket.id);
        chatMessages.set(clientSocketId, []); // Iniciar o armazenamento das mensagens

        io.to(clientSocketId).emit('chat accepted');
        adminSockets.forEach((admin) => {
            if (admin.id !== socket.id) {
                admin.emit('chat taken', { clientSocketId });
            }
        });
    });

    // Cliente ou admin envia mensagem
    socket.on('chat message', ({ from, content }) => {
        const adminSocketId = activeChats.get(socket.id);
        const message = { from, content, timestamp: new Date() };

        if (adminSocketId) {
            io.to(adminSocketId).emit('chat message', message);
            chatMessages.get(socket.id).push(message);
        } else {
            for (let [clientSocketId, adminId] of activeChats.entries()) {
                if (adminId === socket.id) {
                    io.to(clientSocketId).emit('chat message', message);
                    chatMessages.get(clientSocketId).push(message);
                    break;
                }
            }
        }
    });

    // Encerrar um chat e salvar no banco
    socket.on('end chat', async () => {
        if (activeChats.has(socket.id)) {
            const adminSocketId = activeChats.get(socket.id);
            const messages = chatMessages.get(socket.id) || [];

            await prisma.conversa.create({
                data: {
                    clientId: socket.id,
                    adminId: adminSocketId || null,
                    messages: messages,
                },
            });

            io.to(adminSocketId).emit('chat ended', 'Chat encerrado.');
            io.to(socket.id).emit('chat ended', 'Chat encerrado.');

            activeChats.delete(socket.id);
            chatMessages.delete(socket.id);
        }
    });

    // Quando um usuário se desconecta
    socket.on('disconnect', async () => {
        console.log('Usuário desconectado:', socket.id);
        adminSockets.delete(socket);

        if (activeChats.has(socket.id)) {
            const adminSocketId = activeChats.get(socket.id);
            const messages = chatMessages.get(socket.id) || [];

            await prisma.conversa.create({
                data: {
                    clientId: socket.id,
                    adminId: adminSocketId || null,
                    messages: messages,
                },
            });

            io.to(adminSocketId).emit('chat ended', 'Usuário desconectado.');
            activeChats.delete(socket.id);
            chatMessages.delete(socket.id);
        }
    });
});

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
