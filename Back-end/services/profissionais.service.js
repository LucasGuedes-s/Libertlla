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


module.exports = {postProfissional};