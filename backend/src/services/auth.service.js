const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { gerarToken } = require('../utils/jwt');

async function cadastrar(dados) {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email: dados.email
    }
  });

  if (usuarioExistente) {
    throw new Error('E-mail já cadastrado.');
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senha: senhaHash
    }
  });

  const token = gerarToken(usuario);

  return {
    usuario,
    token
  };
}

async function login(email, senha) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      email
    }
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Senha inválida.');
  }

  const token = gerarToken(usuario);

  return {
    usuario,
    token
  };
}

module.exports = {
  cadastrar,
  login
};