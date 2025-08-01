const Ocorrencia = require("../services/ocorrencias.service");
const conversaService = require('../services/ocorrencias.service');

// Registrar uma ocorrência
async function PostOcorrencias(req, res) {
  try {
    const ocorrencias = await Ocorrencia.CadrastrarOcorrencias(req.body.ocorrencias);

    req.io.emit('nova_ocorrencia', ocorrencias);

    res.status(200).json({ message: 'Ocorrência registrada com sucesso', ocorrencia: ocorrencias });
  } catch (error) {
    console.error('Erro ao registrar ocorrência:', error);
    res.status(500).json({ message: 'Erro ao registrar ocorrência' });
  }
};

async function getOcorrenciasProfissional(req, res, next) {
  try {
    const processos = await Ocorrencia.getOcorrenciasProfissional(req.params.email)
    res.status(200).json({
      processos
    })
    next()
  } catch (error) {
    console.error(error)
    console.error('Erro no get em processos do profissional')
  }
}

async function getConversas(req, res, next) {
  const { profissionalEmail } = req.params;

  try {
    const conversas = await conversaService.getConversasProfissional(profissionalEmail);

    res.status(200).json({
      conversas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar conversas do profissional' });
  }
}

async function GetOcorrencias(req, res, next) {
  try {
    const ocorrencias = await Ocorrencia.GetOcorrencias()
    res.status(200).json({
      ocorrencias
    })
    next()
  } catch (error) {
    console.error(error)
    console.error('Erro ao receber ocorrencias')
  }
}
async function GetOcorrenciasTotais(req, res, next) {
  try {
    const ocorrencias = await Ocorrencia.GetOcorrenciaTotais()
    res.status(200).json({
      ocorrencias
    })
    next()
  } catch (error) {
    console.error(error)
    console.error('Erro ao receber ocorrencias')
  }
}
async function GetTodasOcorrencias(req, res, next) {
  try {
    const { totalDenuncias, totalConversas, totalOcorrencias, totalAtendidas } = await Ocorrencia.GetTodasOcorrencias();
    res.status(200).json({ totalDenuncias, totalConversas, totalOcorrencias, totalAtendidas });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar total de denúncias' });
  }
}

async function GetOcorrenciaEspecifica(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const ocorrencia = await Ocorrencia.GetOcorrenciaEspecifica(id);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência não encontrada." });
    }


    res.status(200).json({ ocorrencia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar a ocorrência." });
  }
}

async function updateOcorrencia(req, res, next) {
  try {
    const ocorrencias = await Ocorrencia.updateOcorrencia(req)
    res.status(200).json({
      ocorrencias
    })
    next()
  } catch (error) {
    console.error(error)
    console.error('Erro ao realizar alteração na ocorrencia/processo')
  }
}

async function arquivarOcorrencia(req, res, next) {
  try {
    const { ocorrenciaId } = req.body;
    const ocorrencias = await Ocorrencia.arquivarOcorrencia(ocorrenciaId);
    res.status(200).json({
      ocorrencias
    });
    next();
  } catch (error) {
    console.error(error);
    console.error("Erro ao arquivar ocorrência");
    res.status(500).json({ error: "Erro ao arquivar ocorrência." });
  }
}
async function arquivarConversa(req, res, next) {
  try {
    const { conversaId } = req.body;

    if (!conversaId) {
      return res.status(400).json({ error: "ID da conversa é obrigatório." });
    }

    await conversaService.arquivarConversa(conversaId);

    return res.status(200).json({ message: "Conversa arquivada com sucesso" });
  } catch (error) {
    console.error("Erro ao arquivar conversa:", error);
    return res.status(500).json({ error: "Erro ao arquivar conversa." });
  }
}

async function desarquivarOcorrenciaController(req, res) {
  const { id } = req.params;

  try {
    const ocorrencia = await Ocorrencia.desarquivarOcorrencia(id);
    res.status(200).json({ message: 'Ocorrência desarquivada com sucesso', ocorrencia });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function desarquivarConversaController(req, res) {
  try {
    const { id } = req.params;
    const conversaAtualizada = await conversaService.desarquivarConversa(id);
    return res.status(200).json(conversaAtualizada);
  } catch (error) {
    console.error('Erro ao desarquivar conversa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

async function adicionarProgressoChat(req, res) {
  try {
    const { id } = req.params;
    const { descricao, anexos } = req.body;

    await conversaService.adicionarProgressoChat(descricao, anexos, id);

    return res.status(200).json({ message: "Progresso do chat adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar progresso no chat:", error);
    return res.status(500).json({ error: "Houve um erro ao adicionar o progresso no chat." });
  }
}

async function adicionarProgressoOcorrencia(req, res) {
  try {
    const { id } = req.params;
    const { descricao, anexos } = req.body;

    await Ocorrencia.adicionarProgressoOcorrencia(descricao, anexos, id);

    return res.status(200).json({ message: "Progresso da ocorrência adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar progresso na ocorrência:", error);
    return res.status(500).json({ error: "Houve um erro ao adicionar o progresso na ocorrência." });
  }
}

async function vincularVitimaController(req, res) {
  const ocorrenciaId = parseInt(req.params.id);
  const { vitimaId } = req.body;

  try {
    await Ocorrencia.vincularVitima(ocorrenciaId, vitimaId);
    return res.status(200).json({ message: "Vítima vinculada com sucesso." });
  } catch (error) {
    console.error("Erro ao vincular vítima:", error);
    return res.status(500).json({ error: "Erro ao vincular vítima à ocorrência." });
  }
}

async function adicionarVisitaOcorrencia(req, res) {
  try {
    const { id } = req.params;
    const { data, descricao, testemunhas, anexos, assinatura } = req.body;

    const testemunhasArray = typeof testemunhas === 'string'
      ? testemunhas.split(',').map(t => t.trim())
      : testemunhas;

    await Ocorrencia.adicionarVisitaOcorrencia(
      data,
      descricao,
      testemunhasArray,
      anexos,
      assinatura,
      id
    );

    return res.status(200).json({ message: "Visita da ocorrência adicionada com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar visita na ocorrência:", error);
    return res.status(500).json({ error: "Houve um erro ao adicionar a visita na ocorrência." });
  }
}

async function adicionarVisitaConversa(req, res) {
  try {
    const { id } = req.params;
    const { data, descricao, testemunhas, anexos, assinatura } = req.body;

    const testemunhasArray = typeof testemunhas === 'string'
      ? testemunhas.split(',').map(t => t.trim())
      : testemunhas;

    await conversaService.adicionarVisitaConversa(
      data,
      descricao,
      testemunhasArray,
      anexos,
      assinatura,
      id
    );

    return res.status(200).json({ message: "Visita da conversa adicionada com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar visita na conversa:", error);
    return res.status(500).json({ error: "Houve um erro ao adicionar a visita na conversa." });
  }
}

async function adicionarProfissional(req, res) {
  const { ocorrenciaId, profissionalId } = req.body;

  try {
    const resultado = await Ocorrencia.adicionarProfissionalOcorrencia(ocorrenciaId, profissionalId);
    res.status(201).json({
      message: 'Profissional adicionado com sucesso à ocorrência.',
      data: resultado
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


module.exports = { PostOcorrencias, GetOcorrencias, getConversas, GetOcorrenciasTotais, getOcorrenciasProfissional, GetTodasOcorrencias, GetOcorrenciaEspecifica, arquivarOcorrencia, arquivarConversa, desarquivarOcorrenciaController, desarquivarConversaController, updateOcorrencia, adicionarProgressoChat, adicionarProgressoOcorrencia, vincularVitimaController, adicionarVisitaOcorrencia, adicionarVisitaConversa, adicionarProfissional };


