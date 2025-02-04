// Importar o Express
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    /*
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
    }); */

    socket.on('request chat', async (username) => {
        if (activeChats.has(socket.id)) {
            socket.emit('chat error', 'Chat já está em andamento.');
            return;
        }
    
        // Criar um novo chat no banco com um array vazio de mensagens
        await prisma.chat.create({
            data: {
                clienteId: socket.id,
                mensagens: [] // Inicialmente, sem mensagens
            }
        });
    
        adminSockets.forEach((admin) => {
            admin.emit('chat request', { username, socketId: socket.id });
        });
    });
    
    socket.on('chat message', async ({ from, content }) => {
        try {
            // Buscar o chat associado ao cliente pelo clienteId
            let chat = await prisma.chat.findFirst({
                where: { clienteId: socket.id }
            });
    
            // Criar uma nova mensagem no formato JSON
            const novaMensagem = {
                remetente: from,
                conteudo: content,
                timestamp: new Date().toISOString()
            };
    
            if (!chat) {
                // Se o chat ainda não existir, criar um novo com a primeira mensagem
                chat = await prisma.chat.create({
                    data: {
                        clienteId: socket.id,
                        mensagens: [novaMensagem] // Criando o chat com um array de mensagens
                    }
                });
            } else {
                // Pegar o array atual de mensagens
                const mensagensAnteriores = chat.mensagens || [];
    
                // Adicionar a nova mensagem ao array
                const mensagensAtualizadas = [...mensagensAnteriores, novaMensagem];
    
                // Atualizar o chat com o novo array completo
                await prisma.chat.update({
                    where: { id: chat.id },
                    data: {
                        mensagens: mensagensAtualizadas
                    }
                });
            }
    
            // Enviar a mensagem para o destinatário correto
            const adminSocketId = activeChats.get(socket.id); // Obtém o admin associado ao cliente
    
            if (adminSocketId) {
                io.to(adminSocketId).emit('chat message', { from, content });
            } else {
                // Se for um admin enviando, encaminhar ao cliente correspondente
                let clientSocketId = [...activeChats.entries()]
                    .find(([clientId, adminId]) => adminId === socket.id)?.[0];
    
                if (clientSocketId) {
                    io.to(clientSocketId).emit('chat message', { from, content });
                }
            }
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
        }
    });
    
    // ADMIN ACEITA O CHAT (Correção para evitar múltiplos admins aceitando)
    socket.on('accept chat', (clientSocketId) => {
        if (activeChats.has(clientSocketId)) {
            socket.emit('chat error', 'Chat já foi aceito por outro administrador.');
            return;
        }
    
        activeChats.set(clientSocketId, socket.id); // Relaciona cliente e admin
    
        io.to(clientSocketId).emit('chat accepted'); // Notifica cliente que o chat foi aceito
    
        // Notifica outros admins que esse chat já foi aceito
        adminSockets.forEach((admin) => {
            if (admin.id !== socket.id) {
                admin.emit('chat taken', { clientSocketId });
            }
        });
    });
    
    // ADMIN E CLIENTE SE DESCONECTAM (Correção para limpar chats corretamente)
    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
        adminSockets.delete(socket);
    
        // Remover chats ativos do admin desconectado
        for (let [clientSocketId, adminSocketId] of activeChats.entries()) {
            if (adminSocketId === socket.id) {
                activeChats.delete(clientSocketId);
                io.to(clientSocketId).emit('chat ended', 'Administrador desconectado.');
            }
        }
    
        // Se for um cliente que desconectou, remover o chat ativo
        if (activeChats.has(socket.id)) {
            let adminSocketId = activeChats.get(socket.id);
            activeChats.delete(socket.id);
            io.to(adminSocketId).emit('chat ended', 'Usuário desconectado.');
        }
    });    
});

// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});