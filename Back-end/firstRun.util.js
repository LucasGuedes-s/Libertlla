const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcryptUtil = require("./utils/bcrypt.util");
require('dotenv').config();

async function cadastrarProfissional() {
    const user = {
        usuario: {
            nome: 'Admin',
            especialidade: 'Psicóloga',
            email: 'admin@gmail.com',
            senha: 'password',
            foto: 'https://firebasestorage.googleapis.com/v0/b/clinica-maria-luiza-17cef.appspot.com/o/pacientes%2F18289c5a-86ef-428b-901b-e864fa589721_default-avatar-profile-icon-vector-social-media-user-photo-183042379.webp?alt=media&token=62e2a198-bcf9-4b67-8735-fbf69a1f0b79'
        }
    }

    try {
        console.log('Especialidade:', user.usuario.especialidade)

        const senhaCriptografada = bcryptUtil.hash(user.usuario.senha, 10)

        const cadastro = await prisma.profissionais.create({
            data: {
                nome: user.usuario.nome,
                especialidade: user.usuario.especialidade,
                email: user.usuario.email,
                senha: senhaCriptografada,
                foto: user.usuario.foto,
                permissaoId: 1 // ajuste conforme seu schema
            }
        })

        console.log('Profissional cadastrado com sucesso:', cadastro)
    } catch (error) {
        console.error('Erro ao cadastrar profissional:', error)
    } finally {
        await prisma.$disconnect()
    }
}

//cadastrarProfissional()
const senhaCriptografada = bcryptUtil.hash('senha', 10)

async function main() {
  // 1. Cadastrar Vítima
  const vitima = await prisma.vitima.create({
    data: {
      nome: 'Maria da Silva',
      dataNascimento: '1990-05-10',
      cpf: '12345678900',
      email: 'maria.silva@example.com',
      senha: senhaCriptografada,
      telefone: '11999999999',
      genero: 'Feminino',
      estadoCivil: 'Solteira',
      profissao: 'Professora',
      escolaridade: 'Superior Completo',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      etnia: 'Parda',
      contatosdeEmergencia: ['11988887777'],
    },
  })

  // 2. Cadastrar Agressor
  const agressor = await prisma.agressor.create({
    data: {
      nome: 'João Pereira',
      relacionamento_vitima: 'Ex-marido',
      cpf: '98765432100',
      dataNascimento: '1985-08-20',
      email: 'joao.pereira@example.com',
      telefone: '11977776666',
      genero: 'Masculino',
      estadoCivil: 'Divorciado',
      profissao: 'Autônomo',
      escolaridade: 'Ensino Médio',
      endereco: 'Rua das Palmeiras, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      etnia: 'Branco',
      caracteristicas_fisicas: 'Alto, magro, tatuagem no braço esquerdo',
    },
  })

  // 3. Criar a Ocorrência e vincular à Vítima
  const ocorrencia = await prisma.ocorrencias.create({
    data: {
      tipo_denuncia: 'Agressão Física',
      tipo_violencia: 'Violência Doméstica',
      agressor: agressor.nome,
      provas: ['Foto do hematoma', 'Relatório médico'],
      descricao: 'A vítima relata agressões frequentes durante o casamento.',
      local: 'Casa da vítima',
      data_denuncia: new Date(),
      data_ocorrencia: '2025-06-12',
      status: 'Andamento',
      endereco: 'Rua das Flores, 123',
      endereco_vitima: 'Rua das Flores, 123',
      vitimaId: vitima.id, // 🔗 Relacionando com a vítima
    },
  })

  // 4. Criar relação entre agressor e vítima
  await prisma.relacao_agressor_vitima.create({
    data: {
      agressorId: agressor.id,
      vitimaId: vitima.id,
    },
  })

  console.log('Vítima, agressor e ocorrência cadastrados com sucesso.')
}

main()
  .catch((e) => {
    console.error('Erro:', e)
  })
  .finally(() => {
    prisma.$disconnect()
  }) 
/*
async function criarPermissoes() {
  try {
    await prisma.permissoes.createMany({
      data: [
        { descricao: 'Psicologo' },
        { descricao: 'Policial' },
        { descricao: 'Administrador' },
      ],
    });

    console.log('Permissões criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar permissões:', error);
  } finally {
    await prisma.$disconnect();
  }
} */
// Descomente a linha abaixo para criar as permissões
  //criarPermissoes();
  //cadastrarProfissional()
