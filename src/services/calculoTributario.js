const DESCONTO_SIMPLIFICADO_MENSAL = 607.20;
const SALARIO_MINIMO_2026 = 1621.00;

const TABELA_IR_MENSAL_2026 = [
  { limite: 2428.80, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 182.16 },
  { limite: 3751.05, aliquota: 0.15, deducao: 394.16 },
  { limite: 4664.68, aliquota: 0.225, deducao: 675.49 },
  { limite: Infinity, aliquota: 0.275, deducao: 908.73 }
];

function arredondar(valor) {
  return Number(valor.toFixed(2));
}

function calcularImpostoTabelaProgressiva(baseCalculo) {
  const base = Math.max(Number(baseCalculo) || 0, 0);
  const faixa = TABELA_IR_MENSAL_2026.find((item) => base <= item.limite);

  const imposto = base * faixa.aliquota - faixa.deducao;

  return arredondar(Math.max(imposto, 0));
}

function calcularRedutorIR2026(rendimentoMensal, impostoApurado) {
  const renda = Number(rendimentoMensal) || 0;
  const imposto = Number(impostoApurado) || 0;

  if (renda <= 5000) {
    return arredondar(Math.min(imposto, 312.89));
  }

  if (renda <= 7350) {
    const redutor = 978.62 - (0.133145 * renda);
    return arredondar(Math.min(imposto, Math.max(redutor, 0)));
  }

  return 0;
}

function calcularIRRF2026({ baseCalculo, rendimentoMensal }) {
  const base = arredondar(Math.max(Number(baseCalculo) || 0, 0));
  const impostoTabela = calcularImpostoTabelaProgressiva(base);
  const redutor = calcularRedutorIR2026(rendimentoMensal, impostoTabela);
  const impostoDevido = arredondar(Math.max(impostoTabela - redutor, 0));

  return {
    baseCalculo: base,
    impostoTabela,
    redutor,
    impostoDevido
  };
}

function calcularPessoaFisica(renda, custos) {
  const receita = Number(renda) || 0;
  const despesas = Number(custos) || 0;

  const calculoDeducoes = calcularIRRF2026({
    baseCalculo: receita - despesas,
    rendimentoMensal: receita
  });

  const calculoSimplificado = calcularIRRF2026({
    baseCalculo: receita - DESCONTO_SIMPLIFICADO_MENSAL,
    rendimentoMensal: receita
  });

  const irrfDeducoes = calculoDeducoes.impostoDevido;
  const irrfSimplificado = calculoSimplificado.impostoDevido;

  const usarDeducoes = irrfDeducoes <= irrfSimplificado;
  const modalidadeMaisVantajosa = usarDeducoes
    ? 'Declaração completa'
    : 'Declaração simplificada';

  const menorValor = Math.min(irrfDeducoes, irrfSimplificado);
  const maiorValor = Math.max(irrfDeducoes, irrfSimplificado);
  const economia = arredondar(maiorValor - menorValor);

  return {
    regime: 'PF',
    receitaMensal: arredondar(receita),
    custosMensais: arredondar(despesas),
    inss: 0,
    irrf: menorValor,
    totalTributos: menorValor,
    modalidadeIRRF: modalidadeMaisVantajosa,
    economia,
    modalidades: {
      completa: {
        nome: 'Declaração completa',
        baseCalculo: calculoDeducoes.baseCalculo,
        impostoTabela: calculoDeducoes.impostoTabela,
        redutor: calculoDeducoes.redutor,
        impostoDevido: irrfDeducoes
      },
      simplificada: {
        nome: 'Declaração simplificada',
        baseCalculo: calculoSimplificado.baseCalculo,
        impostoTabela: calculoSimplificado.impostoTabela,
        redutor: calculoSimplificado.redutor,
        impostoDevido: irrfSimplificado
      }
    }
  };
}

function calcularProLaborePsicologiaArquitetura(receita) {
  return arredondar(Math.max(receita * 0.28, SALARIO_MINIMO_2026));
}

function calcularIRRFProLabore(proLabore) {
  return calcularIRRF2026({
    baseCalculo: proLabore - DESCONTO_SIMPLIFICADO_MENSAL,
    rendimentoMensal: proLabore
  });
}

function calcularPessoaJuridicaPsicologiaArquitetura(renda, profissao) {
  const receita = Number(renda) || 0;
  const proLabore = calcularProLaborePsicologiaArquitetura(receita);
  const das = arredondar(receita * 0.06);
  const inssSocio = arredondar(proLabore * 0.11);
  const irrfProLabore = calcularIRRFProLabore(proLabore);

  const totalTributos = arredondar(
    das + inssSocio + irrfProLabore.impostoDevido
  );

  return {
    regime: 'PJ',
    profissao,
    anexo: 'Anexo III',
    receitaMensal: arredondar(receita),
    proLabore,
    das,
    inssSocio,
    cpp: 0,
    irrf: irrfProLabore.impostoDevido,
    totalTributos,
    detalhes: {
      irrfProLabore
    }
  };
}

function calcularPessoaJuridicaAdvocacia(renda) {
  const receita = Number(renda) || 0;
  const proLabore = arredondar(SALARIO_MINIMO_2026);
  const das = arredondar(receita * 0.045);
  const inssSocio = arredondar(proLabore * 0.11);
  const cpp = arredondar(proLabore * 0.20);
  const irrfProLabore = calcularIRRFProLabore(proLabore);

  const totalTributos = arredondar(
    das + inssSocio + cpp + irrfProLabore.impostoDevido
  );

  return {
    regime: 'PJ',
    profissao: 'advogado',
    anexo: 'Anexo IV',
    receitaMensal: arredondar(receita),
    proLabore,
    das,
    inssSocio,
    cpp,
    irrf: irrfProLabore.impostoDevido,
    totalTributos,
    detalhes: {
      irrfProLabore
    }
  };
}

function calcularPessoaJuridica(renda, profissao) {
  if (profissao === 'advogado') {
    return calcularPessoaJuridicaAdvocacia(renda);
  }

  return calcularPessoaJuridicaPsicologiaArquitetura(renda, profissao);
}

export function calcularTributacao({ renda, custos, profissao }) {
  const pf = calcularPessoaFisica(renda, custos);
  const pj = calcularPessoaJuridica(renda, profissao);

  const melhorOpcao = pf.totalTributos <= pj.totalTributos ? 'PF' : 'PJ';

  return {
    profissao,
    renda: arredondar(Number(renda) || 0),
    custos: arredondar(Number(custos) || 0),
    pf,
    pj,
    melhorOpcao
  };
}