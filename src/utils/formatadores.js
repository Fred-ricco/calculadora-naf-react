export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function formatarMoedaInput(valor, valorMaximo = null) {
  const apenasNumeros = valor.replace(/\D/g, '');

  if (!apenasNumeros) {
    return '';
  }

  let numero = Number(apenasNumeros) / 100;

  if (valorMaximo !== null && numero > valorMaximo) {
    numero = valorMaximo;
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function converterMoedaParaNumero(valorFormatado) {
  if (!valorFormatado) {
    return 0;
  }

  return Number(
    valorFormatado
      .replace(/\s/g, '')
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
  );
}