const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function LoginUser(req, res) {
    const user = await prisma.Profissionais.findFirst({
        where:{
            email: req.email
        }
    })
    if(user == null) {
        throw new Error('Usuário ou senha não encontrado')
    }
    return user
}

module.exports = {LoginUser}