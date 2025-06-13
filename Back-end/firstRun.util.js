const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcryptUtil = require("./utils/bcrypt.util");
require('dotenv').config();

async function cadastrarProfissional() {
    const user = {
        usuario: {
            nome: 'Admin',
            especialidade: 'Psicóloga',
            email: 'admin@gmail.com',
            senha: 'senhaSegura123',
            foto: 'password'
        }
    }

    try {
        console.log('Especialidade:', user.usuario.especialidade)

        const senhaCriptografada = bcryptUtil.hash(user.usuario.senha, 10)

        const cadastro = await prisma.profissionais.create({
            data: {
                nome: user.usuario.nome,
                especialidade: user.usuario.especialidade,
                email: user.usuario.email,
                senha: senhaCriptografada,
                foto: user.usuario.foto,
                permissaoId: 1 // ajuste conforme seu schema
            }
        })

        console.log('Profissional cadastrado com sucesso:', cadastro)
    } catch (error) {
        console.error('Erro ao cadastrar profissional:', error)
    } finally {
        await prisma.$disconnect()
    }
}

cadastrarProfissional()
