  const vitima = require('../services/vitima.services');

  async function LoginVitma(req, res, next) {
    try {
      const Login = await vitima.LoginUser(req.body);

      // Header (opcional, mas pode manter)
      res.setHeader('Authorization', `Bearer ${Login.token}`);

      // Body com token
      res.status(200).json({ 
        usuario: Login.user,
        token: Login.token  // 👈 aqui está o que o front precisa!
      });

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

  async function getIdVitimaPorToken(req, res) {
    try {
      const email = req.user.email; // <-- está acessando o dado do token
      if (!email) return res.status(400).json({ error: 'Email não encontrado no token' });

      const id = await vitima.getIdVitima(email);
      if (!id) return res.status(404).json({ error: 'Vítima não encontrada' });

      res.status(200).json({ id });
    } catch (error) {
      console.error(error);
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

  async function alterarsenhacontroller(req, res) {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ error: 'Email e nova senha são obrigatórios' });
  }

  try {
    const resultado = await vitima.alterarSenha(email, novaSenha);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

async function AdicionarVitima(req, res) {
  try {
    const cadVitima = await vitima.AdicionarVitima(req);
    res.status(201).json(cadVitima);
  } catch (error) {
    console.error('Erro ao adicionar vítima:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = { LoginVitma, getVitimas, getVitimaPorEmail, getIdVitimaPorToken, adicionarContato, alterarsenhacontroller, AdicionarVitima};
