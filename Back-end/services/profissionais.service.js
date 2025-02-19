const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcryptUtil = require("../utils/bcrypt.util");

async function postProfissional(user){
    console.log(user.usuario)
    let senha_user = bcryptUtil.hash(user.senha);  
    const cadastro = await prisma.Profissionais.create({
        data: {
            nome: user.nome,
            especialidade: user.especialidade,
            email: user.email,
            senha: senha_user,
            foto: user.foto,
            permissaoId: 1
        },
    });
    return cadastro;
}


module.exports = {postProfissional};