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

  async function getVitimaPorEmail(req, res) {
    try {
      const { email } = req.params;
      const vitimaDados = await vitima.getVitimaPorEmail(email);
      if (!vitimaDados) {
        return res.status(404).json({ error: 'Vítima não encontrada' });
      }
      res.status(200).json(vitimaDados);
    } catch (error) {
      console.error('Erro ao buscar vítima:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }

  async function getVitimaIdPorEmail(req, res) {
    try {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      const id = await vitima.getIdVitima(email);
      if (!id) {
        return res.status(404).json({ error: 'Vítima não encontrada' });
      }

      res.status(200).json({ id });
    } catch (error) {
      console.error('Erro ao buscar id da vítima:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }

  async function adicionarContato (req, res){
    const { email } = req.params;
    const { contato } = req.body;

    try {
      const vitimaAtualizada = await vitima.adicionarContato(email, contato);
      res.json(vitimaAtualizada);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao adicionar contato.' });
    }
  };

  module.exports = { LoginVitma, getVitimas, getVitimaPorEmail, getVitimaIdPorEmail ,adicionarContato };
