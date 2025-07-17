const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('../utils/bcrypt.util');
var jwt = require('jsonwebtoken');
const config= require('../config/app.config')
require('dotenv').config();

async function LoginUser(req, res) {
    console.log(req)
    if (req.usuario.senha == config.senha) {
        throw new Error('Troque sua senha antes de continuar')
    }
    const user = await prisma.Vitima.findFirst({
        where:{
            email: req.usuario.email
        }
    })
    if(user == null) {
        throw new Error('Usuário ou senha incorretos')
    }
    const senhaValida = bcrypt.compare(req.usuario.senha, user.senha);

    if(senhaValida){
        const token = jwt.sign(user, config.jwtSecret, {
            expiresIn: 86400 // 24 horas
        });
        
        return {token: token, user}
        }
    else{
        throw new Error('Usuário ou senha inválido')
    }
}

async function getVitimas() {
    const vitimas = await prisma.Vitima.findMany(
        {
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true,
            }
        }
    );
    return vitimas;
}

async function getVitimaPorEmail(email) {
  return await prisma.vitima.findUnique({
    where: { email },
    select: {
      contatosdeEmergencia: true,
    },
  });
}

async function adicionarContato(email, novoContato){
  const vitima = await prisma.vitima.findUnique({
    where: { email },
  });

  if (!vitima) {
    throw new Error('Vítima não encontrada');
  }

  const contatosAtualizados = [...(vitima.contatosdeEmergencia || []), novoContato];

  const vitimaAtualizada = await prisma.vitima.update({
    where: { email },
    data: {
      contatosdeEmergencia: contatosAtualizados,
    },
  });

  return vitimaAtualizada;
};

module.exports = { LoginUser, getVitimas, getVitimaPorEmail, adicionarContato }