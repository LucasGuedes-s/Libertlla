const { enviarEmailAlteracaoSenha } = require('./email.services');

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

async function getIdVitima(email) {
  const vitima = await prisma.vitima.findUnique({
    where: { email },
    select: { id: true }
  });
  return vitima ? vitima.id : null;
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

async function alterarSenha(email, novaSenha) {
  const vitima = await prisma.vitima.findUnique({
    where: { email },
  });

  if (!vitima) {
    throw new Error('E-mail não encontrado');
  }

  const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

  const senhaAtualizada = await prisma.vitima.update({
    where: { email },
    data: { senha: senhaCriptografada },
  });

  return senhaAtualizada;
}
async function AdicionarVitima(req) {
  try {
    console.log(req.body);

    const senhaCriptografada = await bcrypt.hash('senha', 10);

    const cadVitima = await prisma.vitima.create({
      data: {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        senha: senhaCriptografada,
        dataNascimento: req.body.dataNascimento,
        cpf: req.body.cpf,
        genero: req.body.genero,
        estadoCivil: req.body.estadoCivil,
        profissao: req.body.profissao,
        escolaridade: req.body.escolaridade,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        estado: req.body.estado,
        etnia: req.body.etnia,
        contatosdeEmergencia: req.body.contatosdeEmergencia || [],
        processosJudiciais: req.body.processosJudiciais || null,
      },
    });

    await enviarEmailAlteracaoSenha(cadVitima.email, cadVitima.nome);

    return cadVitima;
  } catch (error) {
    console.error('Erro ao adicionar vítima:', error);
    throw error;
  }
}
module.exports = { LoginUser, getVitimas, getVitimaPorEmail, getIdVitima, adicionarContato, alterarSenha, AdicionarVitima }