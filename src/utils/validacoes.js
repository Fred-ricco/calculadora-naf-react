import { converterMoedaParaNumero } from './formatadores';

export function validarFormulario({
  renda,
  custos,
  profissao,
  enviarEmail,
  emailUsuario,
  mensagemNAF
}) {
  const erros = {};

  const rendaNumero = converterMoedaParaNumero(renda);
  const custosNumero = converterMoedaParaNumero(custos);

  if (!renda || rendaNumero <= 0) {
    erros.renda = 'Informe uma renda mensal válida.';
  }

  if (rendaNumero > 15000) {
    erros.renda = 'A renda mensal não pode ultrapassar R$ 15.000,00.';
  }

  if (!custos && custos !== 'R$ 0,00') {
    erros.custos = 'Informe um valor de custos mensais válido.';
  }

  if (custosNumero < 0) {
    erros.custos = 'Informe um valor de custos mensais válido.';
  }

  if (!profissao) {
    erros.profissao = 'Selecione uma profissão.';
  }

  if (enviarEmail && !emailUsuario) {
    erros.emailUsuario = 'Informe o e-mail para envio dos cálculos.';
  }

  if (mensagemNAF && mensagemNAF.length > 500) {
    erros.mensagemNAF = 'A mensagem para o NAF deve ter no máximo 500 caracteres.';
  }

  return erros;
}