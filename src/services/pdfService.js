import { jsPDF } from 'jspdf';

function formatarMoedaPdf(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function adicionarTitulo(doc, titulo, subtitulo) {
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(titulo, 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(subtitulo, 14, 21);

  doc.setTextColor(0, 0, 0);
}

function adicionarSecao(doc, titulo, y) {
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(14, y, 182, 10, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(titulo, 18, y + 7);

  return y + 16;
}

function adicionarLinhaTexto(doc, rotulo, valor, y, negrito = false) {
  doc.setFont('helvetica', negrito ? 'bold' : 'normal');
  doc.setFontSize(10);
  doc.text(`${rotulo} ${valor}`, 18, y);
  return y + 7;
}

function adicionarLinhaDestaque(doc, rotulo, valor, y, corFundo = [240, 253, 244], corTexto = [22, 163, 74]) {
  doc.setFillColor(...corFundo);
  doc.roundedRect(18, y - 5, 174, 10, 2, 2, 'F');

  doc.setTextColor(...corTexto);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`${rotulo} ${valor}`, 22, y + 1);

  doc.setTextColor(0, 0, 0);
  return y + 12;
}

function verificarQuebraPagina(doc, y, alturaMinima = 20) {
  if (y > 270 - alturaMinima) {
    doc.addPage();
    return 20;
  }
  return y;
}

export function gerarPdfComparativo(resultado) {
  const doc = new jsPDF();
  const completa = resultado.pf.modalidades.completa;
  const simplificada = resultado.pf.modalidades.simplificada;
  const dataGeracao = new Date().toLocaleString('pt-BR');

  let y = 0;

  adicionarTitulo(
    doc,
    'Comparativo Tributário - Calculadora NAF',
    'Relatório acadêmico de simulação tributária entre Pessoa Física e Pessoa Jurídica'
  );

  y = 38;

  y = adicionarSecao(doc, '1. Identificação da simulação', y);
  y = adicionarLinhaTexto(doc, 'Profissão:', resultado.profissao, y);
  y = adicionarLinhaTexto(doc, 'Renda mensal:', formatarMoedaPdf(resultado.renda), y);
  y = adicionarLinhaTexto(doc, 'Total de custos mensais:', formatarMoedaPdf(resultado.custos), y);

  y += 4;
  y = verificarQuebraPagina(doc, y);

  y = adicionarSecao(doc, '2. Pessoa Física', y);
  y = adicionarLinhaTexto(doc, 'Modalidade mais vantajosa:', resultado.pf.modalidadeIRRF, y, true);
  y = adicionarLinhaTexto(doc, 'Economia obtida:', formatarMoedaPdf(resultado.pf.economia), y, true);
  y = adicionarLinhaTexto(doc, 'Total PF:', formatarMoedaPdf(resultado.pf.totalTributos), y, true);

  y += 4;
  y = verificarQuebraPagina(doc, y);

  y = adicionarSecao(doc, '2.1 Declaração completa', y);
  y = adicionarLinhaTexto(doc, 'Base de cálculo:', formatarMoedaPdf(completa.baseCalculo), y);
  y = adicionarLinhaTexto(doc, 'Imposto pela tabela:', formatarMoedaPdf(completa.impostoTabela), y);
  y = adicionarLinhaTexto(doc, 'Redutor 2026:', formatarMoedaPdf(completa.redutor), y);
  y = adicionarLinhaTexto(doc, 'IRRF devido:', formatarMoedaPdf(completa.impostoDevido), y);
  if (resultado.pf.modalidadeIRRF === 'Declaração completa') {
    y = adicionarLinhaDestaque(doc, 'Situação:', 'Mais vantajosa', y);
  }

  y += 2;
  y = verificarQuebraPagina(doc, y);

  y = adicionarSecao(doc, '2.2 Declaração simplificada', y);
  y = adicionarLinhaTexto(doc, 'Base de cálculo:', formatarMoedaPdf(simplificada.baseCalculo), y);
  y = adicionarLinhaTexto(doc, 'Imposto pela tabela:', formatarMoedaPdf(simplificada.impostoTabela), y);
  y = adicionarLinhaTexto(doc, 'Redutor 2026:', formatarMoedaPdf(simplificada.redutor), y);
  y = adicionarLinhaTexto(doc, 'IRRF devido:', formatarMoedaPdf(simplificada.impostoDevido), y);
  if (resultado.pf.modalidadeIRRF === 'Declaração simplificada') {
    y = adicionarLinhaDestaque(doc, 'Situação:', 'Mais vantajosa', y);
  }

  y += 4;
  y = verificarQuebraPagina(doc, y);

  y = adicionarSecao(doc, '3. Pessoa Jurídica', y);
  y = adicionarLinhaTexto(doc, 'Pró-labore:', formatarMoedaPdf(resultado.pj.proLabore), y);
  y = adicionarLinhaTexto(doc, 'DAS:', formatarMoedaPdf(resultado.pj.das), y);
  y = adicionarLinhaTexto(doc, 'INSS sócio:', formatarMoedaPdf(resultado.pj.inssSocio), y);
  y = adicionarLinhaTexto(doc, 'CPP:', formatarMoedaPdf(resultado.pj.cpp), y);
  y = adicionarLinhaTexto(doc, 'IRRF pró-labore:', formatarMoedaPdf(resultado.pj.irrf), y);
  y = adicionarLinhaTexto(doc, 'Total PJ:', formatarMoedaPdf(resultado.pj.totalTributos), y, true);

  y += 6;
  y = verificarQuebraPagina(doc, y);

  y = adicionarSecao(doc, '4. Resultado final do comparativo', y);
  y = adicionarLinhaDestaque(
    doc,
    'Melhor opção geral:',
    resultado.melhorOpcao,
    y,
    [239, 246, 255],
    [37, 99, 235]
  );

  y += 8;
  doc.setDrawColor(209, 213, 219);
  doc.line(14, y, 196, y);

  y += 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(`Documento gerado em: ${dataGeracao}`, 14, y);
  doc.text('Calculadora Web PJ e PF do NAF', 14, y + 6);

  doc.save(`comparativo-tributario-${resultado.profissao}.pdf`);
}