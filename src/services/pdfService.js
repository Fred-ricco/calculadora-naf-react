import jsPDF from 'jspdf';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatarEnquadramentoPJ(anexo) {
  return anexo ? `Simples Nacional - ${anexo}` : '-';
}

function escreverLinha(doc, label, valor, x, y) {
  doc.setFont('helvetica', 'bold');
  doc.text(label, x, y);
  doc.setFont('helvetica', 'normal');
  doc.text(String(valor ?? '-'), x + 55, y);
}

function desenharCard(doc, titulo, linhas, x, y, largura) {
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(x, y, largura, 12 + linhas.length * 9, 3, 3, 'FD');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text(titulo, x + 6, y + 9);

  doc.setFontSize(10);

  let linhaY = y + 20;

  linhas.forEach((linha) => {
    doc.setFont('helvetica', 'bold');
    doc.text(linha.label, x + 6, linhaY);

    doc.setFont('helvetica', 'normal');
    doc.text(String(linha.valor ?? '-'), x + largura - 6, linhaY, {
      align: 'right'
    });

    linhaY += 9;
  });
}

function gerarDocumento(resultado) {
  const doc = new jsPDF('p', 'mm', 'a4');

  const completa = resultado.pf?.completa || {};
  const simplificada = resultado.pf?.simplificada || {};
  const pj = resultado.pj || {};

  const dataAtual = new Date().toLocaleDateString('pt-BR');

  doc.setFillColor(31, 41, 55);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('RELATÓRIO DE SIMULAÇÃO TRIBUTÁRIA', 15, 17);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Calculadora Tributária NAF', 15, 25);
  doc.text(`Gerado em: ${dataAtual}`, 195, 25, { align: 'right' });

  doc.setTextColor(20, 20, 20);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Dados da simulação', 15, 48);

  doc.setFontSize(10);
escreverLinha(
  doc,
  'Profissão:',
  capitalizarTexto(resultado.profissao),
  15,
  60
);
  escreverLinha(doc, 'Renda mensal:', formatarMoeda(resultado.renda), 15, 69);
  escreverLinha(doc, 'Custos mensais:', formatarMoeda(resultado.custos), 15, 78);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Comparativo como Pessoa Física', 15, 96);

  desenharCard(
    doc,
    'Declaração completa',
    [
      {
        label: 'Base de cálculo',
        valor: formatarMoeda(completa.baseCalculo)
      },
      {
        label: 'Imposto pela tabela',
        valor: formatarMoeda(completa.impostoTabela)
      },
      {
        label: 'Redutor 2026',
        valor: formatarMoeda(completa.redutor)
      },
      {
        label: 'IRRF devido',
        valor: formatarMoeda(completa.impostoDevido)
      }
    ],
    15,
    104,
    85
  );

  desenharCard(
    doc,
    'Declaração simplificada',
    [
      {
        label: 'Base de cálculo',
        valor: formatarMoeda(simplificada.baseCalculo)
      },
      {
        label: 'Imposto pela tabela',
        valor: formatarMoeda(simplificada.impostoTabela)
      },
      {
        label: 'Redutor 2026',
        valor: formatarMoeda(simplificada.redutor)
      },
      {
        label: 'IRRF devido',
        valor: formatarMoeda(simplificada.impostoDevido)
      }
    ],
    110,
    104,
    85
  );

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Modalidade PF mais vantajosa: ${resultado.pf?.modalidadeMaisVantajosa || '-'}`,
    15,
    158
  );

  doc.text(
    `Total estimado PF: ${formatarMoeda(resultado.pf?.totalTributos)}`,
    15,
    167
  );

  doc.setFontSize(14);
  doc.text('3. Comparativo como Pessoa Jurídica', 15, 187);

  desenharCard(
    doc,
    'Pessoa Jurídica',
    [
      {
        label: 'Enquadramento PJ',
        valor: formatarEnquadramentoPJ(pj.anexo)
      },
      {
        label: 'DAS',
        valor: formatarMoeda(pj.das)
      },
      {
        label: 'Pró-labore',
        valor: formatarMoeda(pj.proLabore)
      },
      {
        label: 'INSS sócio',
        valor: formatarMoeda(pj.inssSocio)
      },
      {
        label: 'CPP',
        valor: formatarMoeda(pj.cpp)
      },
      {
        label: 'Total PJ',
        valor: formatarMoeda(pj.totalTributos)
      }
    ],
    15,
    195,
    180
  );

  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(15, 266, 180, 20, 3, 3, 'FD');

  doc.setTextColor(22, 101, 52);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Melhor opção geral: ${resultado.melhorOpcao || '-'}`, 20, 274);

  doc.text(
    `Economia estimada: ${formatarMoeda(resultado.economiaGeral)}`,
    20,
    281
  );

  doc.setTextColor(90, 90, 90);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Relatório gerado automaticamente para fins acadêmicos pelo sistema Calculadora Tributária NAF.',
    105,
    294,
    { align: 'center' }
  );

  return doc;
}

export function gerarPdf(resultado) {
  const doc = gerarDocumento(resultado);

const nomeProfissao = String(
  capitalizarTexto(resultado.profissao) || 'Relatorio'
)
  .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();

  doc.save(`relatorio-tributario-${nomeProfissao}.pdf`);
}

export function gerarPdfBase64(resultado) {
  const doc = gerarDocumento(resultado);
  const dataUri = doc.output('datauristring');
  return dataUri.split(',')[1] || dataUri;
}

import { capitalizarTexto } from '../utils/formatadores';
