const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('../utils/bcrypt.util');

async function LoginUser(req, res) {
    const user = await prisma.Profissionais.findFirst({
        where:{
            email: req.usuario.email
        }
    })
    console.log(user)
    if(user == null) {
        throw new Error('Usuário ou senha não encontrado')
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

module.exports = {LoginUser}