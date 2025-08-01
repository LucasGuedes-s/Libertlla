const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcryptUtil = require("../utils/bcrypt.util");

async function postProfissional(user){
    console.log(user.usuario.especialidade)

    let senha_user = bcryptUtil.hash(user.usuario.senha, 10);  
    const cadastro = await prisma.Profissionais.create({
        data: {
            nome: user.usuario.nome,
            especialidade: user.usuario.especialidade,
            email: user.usuario.email,
            senha: senha_user,
            foto: user.usuario.foto,
            permissaoId: 1
        },
    });
    return cadastro;
}

async function alterarSenhaProfissional(email, novaSenha) {
  const profissional = await prisma.profissionais.findUnique({
    where: { email },
  });

  if (!profissional) {
    throw new Error('E-mail não encontrado');
  }

  const senhaCriptografada = await bcryptUtil.hash(novaSenha, 10); // USANDO utilitário

  const profissionalAtualizado = await prisma.profissionais.update({
    where: { email },
    data: { senha: senhaCriptografada },
  });

  return profissionalAtualizado;
}

async function atualizarFotoProfissional(profissionalId, novaFotoUrl) {
  const profissional = await prisma.profissionais.findUnique({
    where: { id: profissionalId }
  });

  const atualizado = await prisma.profissionais.update({
    where: { id: profissionalId },
    data: { foto: novaFotoUrl }
  });

  return atualizado;
}

async function listarProfissionais() {
  return await prisma.profissionais.findMany({
    select: {
      id: true,               
      nome: true,
      especialidade: true
    }
  });
}


module.exports = {postProfissional, alterarSenhaProfissional, atualizarFotoProfissional, listarProfissionais};