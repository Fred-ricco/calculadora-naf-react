const prisma = require('../config/prisma');
const { calcularTributacao } = require('./calculoTributario.service');

async function simularESalvar(dados, usuarioId) {
  console.log('DADOS NO SERVICE:', dados);

  const renda = Number(dados.renda);
  const custos = Number(dados.custos || 0);
  const profissao = dados.profissao;

  if (!renda || Number.isNaN(renda)) {
    throw new Error('Informe uma renda válida.');
  }

  const resultado = calcularTributacao({
    renda,
    custos,
    profissao
  });

  const calculo = await prisma.historicoCalculo.create({
    data: {
      profissao: resultado.profissao,
      renda: resultado.renda,
      custos: resultado.custos,
      resultadoPF: resultado.pf,
      resultadoPJ: resultado.pj,
      economia: resultado.economiaGeral || 0,
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
    where: { usuarioId },
    orderBy: { createdAt: 'desc' }
  });
}

module.exports = {
  simularESalvar,
  listar
};