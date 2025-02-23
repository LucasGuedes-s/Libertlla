// Importar dependências
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Authorization']

}));
// Inicializar o Prisma
const prisma = new PrismaClient();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Authorization, content-type");
    res.header("Access-Control-Expose-Headers", "Authorization, content-type");
    next();
});

app.use(express.json());
// Importar rotas
const userRouter = require('../Back-end/routes/user.router');
const ocorrencias = require('../Back-end/routes/ocorrencia.router');
const pdf = require('../Back-end/routes/pdfs.router');
const profissionais = require('../Back-end/routes/profissionais.router');

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
let adminEmails = new Map(); // Armazena o email do admin por socket.id


// 🔹 Adiciona o `io` no `req` para acessar no controller
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(userRouter);
app.use(ocorrencias);
app.use(pdf);
app.use(profissionais)

io.on('connection', (socket) => {
    // Quando um administrador se conecta
    socket.on('admin connect', (email) => {
        adminSockets.add(socket);
        //console.log(email)
        adminEmails.set(socket.id, email); // Armazena o email do admin
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
            const adminEmail = adminEmails.get(adminSocketId) || null;

            const profissional = await prisma.Profissionais.findUnique({
                where: { email: adminEmail },
                select: { id: true }
            });

            await prisma.conversa.create({
                data: {
                    clientId: socket.id,
                    adminId: adminSocketId || null,
                    profissional: profissional?.id || null,
                    messages: messages,
                },
            });

            // Enviar o ID do cliente desconectado para o frontend
            io.to(adminSocketId).emit('chat ended', { clientSocketId: socket.id });

            io.to(socket.id).emit('chat ended', { clientSocketId: socket.id });

            activeChats.delete(socket.id);
            chatMessages.delete(socket.id);
        }
    });

    // Quando um usuário se desconecta
    socket.on('disconnect', async () => {
    // Verifica se o socket desconectado é um administrador
    if ([...adminSockets].includes(socket)) {
        adminSockets.delete(socket);

        // Identificar os clientes que estavam conversando com esse admin
        for (let [clientSocketId, adminSocketId] of activeChats.entries()) {
            if (adminSocketId === socket.id) {
                // Notificar o cliente que o admin saiu
                io.to(clientSocketId).emit('admin disconnected', {
                    message: "O profissional saiu do chat. Aguarde um novo atendimento."
                });

                // Remover o chat ativo e as mensagens armazenadas
                activeChats.delete(clientSocketId);
                chatMessages.delete(clientSocketId);
            }
        }

        // Remover o email do admin da lista
        adminEmails.delete(socket.id);
    } else {
        // Caso contrário, é um cliente que se desconectou
        if (activeChats.has(socket.id)) {
            const adminSocketId = activeChats.get(socket.id);
            const messages = chatMessages.get(socket.id) || [];
            const adminEmail = adminEmails.get(adminSocketId) || null;

            const profissional = await prisma.Profissionais.findUnique({
                where: { email: adminEmail },
                select: { id: true }
            });

            await prisma.conversa.create({
                data: {
                    clientId: socket.id,
                    adminId: adminSocketId || null,
                    profissional: profissional?.id || null,
                    messages: messages,
                },
            });

            // Enviar o ID do cliente desconectado para o frontend
            io.to(adminSocketId).emit('chat ended', { clientSocketId: socket.id });

            activeChats.delete(socket.id);
            chatMessages.delete(socket.id);
        }
    }
});

});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuração do Cliente S3 (Cloudflare R2)
const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT, // Endpoint do seu R2
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
    },
});

app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("Nenhum arquivo enviado.");
    }

    const fileName = `${Date.now()}_${req.file.originalname}`; // Gerar um nome único para o arquivo
    const fileContent = req.file.buffer;

    // Configurações do upload para o Cloudflare R2
    const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET,
        Key: `uploads/${fileName}`, // Caminho do arquivo no R2
        Body: fileContent,
        ContentType: req.file.mimetype,
        ACL: "public-read", // Permite que o arquivo seja acessado publicamente
    };

    try {
        // Envia o arquivo para o Cloudflare R2
        await s3.send(new PutObjectCommand(params));

        // URL pública do arquivo-
        const fileUrl = `${process.env.URL_PUBLICA}.r2.dev/uploads/${fileName}`;
        console.log(fileUrl)
        res.status(200).json({ fileUrl }); // Retorna a URL pública do arquivo
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao fazer upload do arquivo." });
    }
});
// Iniciar o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
