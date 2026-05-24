const calculoService = require('../services/calculo.service');

async function simular(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const resultado = await calculoService.simularESalvar(req.body, usuarioId);

    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({
      erro: error.message
    });
  }
}

async function listar(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const calculos = await calculoService.listar(usuarioId);

    return res.json(calculos);
  } catch (error) {
    return res.status(400).json({
      erro: error.message
    });
  }
}

module.exports = {
  simular,
  listar
};