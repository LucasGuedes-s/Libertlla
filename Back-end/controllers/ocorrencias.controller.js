const  Ocorrencia = require("../services/ocorrencias.service");

// Registrar uma ocorrência
async function PostOcorrencias(req, res){
    try {
        const ocorrencias = await Ocorrencia.CadrastrarOcorrencias(req.body)

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

async function adicionarProgresso(req, res) {
    try {
        console.log("ID da ocorrência recebido:", req.params.ocorrenciaId);
        console.log("Dados recebidos no body:", req.body); 
       
        const { descricao, anexos } = req.body; 
        const ocorrenciaId = req.params.ocorrenciaId; 
        const progresso = await Ocorrencia.adicionarProgresso(descricao, anexos, ocorrenciaId);
        res.status(201).json({
            message: 'Progresso adicionado com sucesso!',
            registro: progresso
        });
    } catch (error) {
        console.error('Erro ao adicionar progresso:', error);
        res.status(500).json({ error: 'Houve um erro ao adicionar o progresso.' });
    }
}

module.exports = {PostOcorrencias, GetOcorrencias, getOcorrenciasProfissional, GetTodasOcorrencias, GetOcorrenciaEspecifica,arquivarOcorrencia, updateOcorrencia, adicionarProgresso};



