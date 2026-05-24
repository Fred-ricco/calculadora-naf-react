const SALARIO_MINIMO = 1621;
const DESCONTO_SIMPLIFICADO = 607.2;

function arredondar(valor) {
  return Number(valor.toFixed(2));
}

function calcularImpostoTabela(baseCalculo) {
  if (baseCalculo <= 2428.8) {
    return 0;
  }

  if (baseCalculo <= 2826.65) {
    return baseCalculo * 0.075 - 182.16;
  }

  if (baseCalculo <= 3751.05) {
    return baseCalculo * 0.15 - 394.16;
  }

  if (baseCalculo <= 4664.68) {
    return baseCalculo * 0.225 - 675.49;
  }

  return baseCalculo * 0.275 - 908.73;
}

function calcularRedutor(renda) {
  if (renda <= 5000) {
    return 312.89;
  }

  if (renda <= 7350) {
    return 978.62 - 0.133145 * renda;
  }

  return 0;
}

function calcularPessoaFisica(renda, custos) {
  const baseCompleta = Math.max(renda - custos, 0);
  const impostoCompletaTabela = calcularImpostoTabela(baseCompleta);
  const redutorCompleta = calcularRedutor(renda);
  const impostoCompleta = Math.max(impostoCompletaTabela - redutorCompleta, 0);

  const baseSimplificada = Math.max(renda - DESCONTO_SIMPLIFICADO, 0);
  const impostoSimplificadaTabela = calcularImpostoTabela(baseSimplificada);
  const redutorSimplificada = calcularRedutor(renda);
  const impostoSimplificada = Math.max(impostoSimplificadaTabela - redutorSimplificada, 0);

  const modalidadeMaisVantajosa =
    impostoCompleta <= impostoSimplificada
      ? 'Declaração completa'
      : 'Declaração simplificada';

  const totalPF = Math.min(impostoCompleta, impostoSimplificada);
  const economia = Math.abs(impostoCompleta - impostoSimplificada);

  return {
    completa: {
      baseCalculo: arredondar(baseCompleta),
      impostoTabela: arredondar(impostoCompletaTabela),
      redutor: arredondar(redutorCompleta),
      impostoDevido: arredondar(impostoCompleta)
    },
    simplificada: {
      baseCalculo: arredondar(baseSimplificada),
      impostoTabela: arredondar(impostoSimplificadaTabela),
      redutor: arredondar(redutorSimplificada),
      impostoDevido: arredondar(impostoSimplificada)
    },
    modalidadeMaisVantajosa,
    totalTributos: arredondar(totalPF),
    economia: arredondar(economia)
  };
}

function calcularPessoaJuridica(renda, profissao) {
  const profissaoNormalizada = profissao.toLowerCase();

  if (
    profissaoNormalizada === 'psicologo' ||
    profissaoNormalizada === 'psicólogo' ||
    profissaoNormalizada === 'arquiteto'
  ) {
    const das = renda * 0.06;
    const proLabore = Math.max(renda * 0.28, SALARIO_MINIMO);
    const inssSocio = proLabore * 0.11;
    const cpp = 0;
    const irrf = 0;
    const totalTributos = das + inssSocio + cpp + irrf;

    return {
      anexo: 'Anexo III',
      aliquotaDAS: 0.06,
      proLabore: arredondar(proLabore),
      das: arredondar(das),
      inssSocio: arredondar(inssSocio),
      cpp: arredondar(cpp),
      irrf: arredondar(irrf),
      totalTributos: arredondar(totalTributos)
    };
  }

  if (profissaoNormalizada === 'advogado' || profissaoNormalizada === 'advocacia') {
    const das = renda * 0.045;
    const proLabore = SALARIO_MINIMO;
    const inssSocio = proLabore * 0.11;
    const cpp = proLabore * 0.2;
    const irrf = 0;
    const totalTributos = das + inssSocio + cpp + irrf;

    return {
      anexo: 'Anexo IV',
      aliquotaDAS: 0.045,
      proLabore: arredondar(proLabore),
      das: arredondar(das),
      inssSocio: arredondar(inssSocio),
      cpp: arredondar(cpp),
      irrf: arredondar(irrf),
      totalTributos: arredondar(totalTributos)
    };
  }

  throw new Error('Profissão inválida.');
}

function calcularTributacao({ renda, custos, profissao }) {
  if (!renda || renda <= 0) {
    throw new Error('Informe uma renda válida.');
  }

  if (renda > 15000) {
    throw new Error('A renda mensal não pode ultrapassar R$ 15.000,00.');
  }

  if (custos < 0) {
    throw new Error('Os custos não podem ser negativos.');
  }

  const pf = calcularPessoaFisica(renda, custos);
  const pj = calcularPessoaJuridica(renda, profissao);

  const melhorOpcao =
    pf.totalTributos <= pj.totalTributos ? 'Pessoa Física' : 'Pessoa Jurídica';

  const economiaGeral = Math.abs(pf.totalTributos - pj.totalTributos);

  return {
    profissao,
    renda,
    custos,
    pf,
    pj,
    melhorOpcao,
    economiaGeral: arredondar(economiaGeral)
  };
}

module.exports = {
  calcularTributacao
};