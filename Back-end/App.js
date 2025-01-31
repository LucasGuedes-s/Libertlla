// Importar o Express
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Configurar CORS antes das rotas
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

// Middleware para interpretar JSON
app.use(express.json());

// Importar rotas
const userRouter = require('../Back-end/routes/user.router');
const ocorrencias = require('../Back-end/routes/ocorrencia.router');
app.use(userRouter);
app.use(ocorrencias);

// Definir a porta do servidor
const PORT = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Gerenciamento de administradores e chats
let adminSockets = new Set(); // Usando Set para evitar duplicações
let activeChats = new Map();  // Usando Map para mapeamento eficiente

io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Conectar administrador
    socket.on('admin connect', () => {
        adminSockets.add(socket);
        console.log('Admin conectado:', socket.id);
    });

    // Cliente solicita chat
    socket.on('request chat', (username) => {
        if (activeChats.has(socket.id)) {
            socket.emit('chat error', 'Chat já está em andamento.');
            return;
        }
        adminSockets.forEach((admin) => {
            admin.emit('chat request', { username, socketId: socket.id });
        });
    });

    // Admin aceita chat
    socket.on('accept chat', (clientSocketId) => {
        if (activeChats.has(clientSocketId)) {
            socket.emit('chat error', 'Chat já foi aceito por outro administrador.');
            return;
        }
        activeChats.set(clientSocketId, socket.id);
        io.to(clientSocketId).emit('chat accepted');
        adminSockets.forEach((admin) => {
            if (admin.id !== socket.id) {
                admin.emit('chat taken', { clientSocketId });
            }
        });
    });

    // Mensagens do chat
    socket.on('chat message', ({ from, content }) => {
        const adminSocketId = activeChats.get(socket.id);
        if (adminSocketId) {
            io.to(adminSocketId).emit('chat message', { from, content });
        } else {
            for (let [clientSocketId, adminId] of activeChats.entries()) {
                if (adminId === socket.id) {
                    io.to(clientSocketId).emit('chat message', { from, content });
                    break;
                }
            }
        }
    });

    // Desconexão do usuário
    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
        adminSockets.delete(socket);

        // Remover chats ativos do administrador desconectado
        for (let [clientSocketId, adminSocketId] of activeChats.entries()) {
            if (adminSocketId === socket.id) {
                activeChats.delete(clientSocketId);
                io.to(clientSocketId).emit('chat ended', 'Administrador desconectado.');
            }
        }
    });
});

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});