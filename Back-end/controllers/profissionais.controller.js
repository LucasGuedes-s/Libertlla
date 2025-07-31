const Profissional = require('../services/profissionais.service')

async function postProfissional(req, res, next){
    try {
        const cadastro = await Profissional.postProfissional(req.body)
        res.status(200).json({cadastro});
        next()
    } catch (error) { 
        console.error('Erro ao cadastrar profissional:', error);

        if (error.code === 'P2002') {  // Erro de chave única (e-mail já cadastrado)
            return res.status(409).json({ message: 'E-mail já cadastrado!' });
        }

        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
}

async function alterarSenhaController(req, res) {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ error: 'Email e nova senha são obrigatórios' });
  }

  try {
    const resultado = await Profissional.alterarSenhaProfissional(email, novaSenha);
    return res.status(200).json(resultado);
  } catch (error) {
    if (error.message === 'E-mail não encontrado') {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Erro interno ao atualizar senha' });
  }
}

async function atualizarFotoController(req, res) {
  const profissionalId = parseInt(req.params.id);
  const { foto } = req.body;

  if (!foto) {
    return res.status(400).json({ erro: 'URL da foto é obrigatória.' });
  }

  try {
    const profissionalAtualizado = await Profissional.atualizarFotoProfissional(profissionalId, foto);
    return res.status(200).json(profissionalAtualizado);
  } catch (error) {
    return res.status(404).json({ erro: error.message });
  }
}

module.exports = {postProfissional, alterarSenhaController, atualizarFotoController};