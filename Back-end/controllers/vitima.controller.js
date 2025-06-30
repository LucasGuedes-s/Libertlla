const vitima = require('../services/vitima.services');

async function LoginVitma(req, res, next) {
    try {
        const Login = await vitima.LoginUser(req.body);
        res.setHeader('Authorization', `Bearer ${Login.token}`);
        res.status(200).json({ 
            usuario: Login.user
        });
        res.end()
    } catch (error) {
        console.error('Erro no login do usuário', error);
        next(error);
    }
}
async function getVitimas(req, res, next) {
    try {
        const vitimas = await vitima.getVitimas();
        res.status(200).json(vitimas);
    } catch (error) {
        console.error('Erro ao obter vítimas', error);
        next(error);
    }
}
module.exports = { LoginVitma, getVitimas };
