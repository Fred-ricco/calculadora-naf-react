const calculoService = require('../services/calculo.service');

async function simular(req, res) {
  try {
    console.log('BODY RECEBIDO:', req.body);
    console.log('USUARIO:', req.usuario);

    const resultado = await calculoService.simularESalvar(
      req.body,
      req.usuario.id
    );

    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({
      erro: error.message
    });
  }
}

async function listar(req, res) {
  try {
    const calculos = await calculoService.listar(req.usuario.id);
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