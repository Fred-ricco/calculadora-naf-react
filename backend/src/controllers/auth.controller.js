const authService = require('../services/auth.service');

async function cadastrar(req, res) {
  try {
    const resultado = await authService.cadastrar(req.body);

    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({
      erro: error.message
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const resultado = await authService.login(email, senha);

    return res.json(resultado);
  } catch (error) {
    return res.status(400).json({
      erro: error.message
    });
  }
}

async function perfil(req, res) {
  return res.json({
    mensagem: 'Usuário autenticado com sucesso.',
    usuario: req.usuario
  });
}

module.exports = {
  cadastrar,
  login,
  perfil
};