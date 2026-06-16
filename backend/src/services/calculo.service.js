const prisma = require('../config/prisma');
const { calcularTributacao } = require('./calculoTributario.service');

async function simularESalvar(dados, usuarioId) {
  const resultado = calcularTributacao({
    renda: Number(dados.renda),
    custos: Number(dados.custos || 0),
    profissao: dados.profissao
  });

  const calculo = await prisma.historicoCalculo.create({
    data: {
      profissao: resultado.profissao,
      renda: resultado.renda,
      custos: resultado.custos,
      resultadoPF: resultado.pf,
      resultadoPJ: resultado.pj,
      economia: resultado.economiaGeral,
      usuarioId
    }
  });

  return {
    resultado,
    historico: calculo
  };
}

async function listar(usuarioId) {
  return prisma.historicoCalculo.findMany({
    where: {
      usuarioId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

module.exports = {
  simularESalvar,
  listar
};