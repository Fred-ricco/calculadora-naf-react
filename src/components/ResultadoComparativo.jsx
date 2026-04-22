import { formatarMoeda } from '../utils/formatadores';
import { gerarPdfComparativo } from '../services/pdfService';

function ResultadoComparativo({ resultado }) {
  if (!resultado) {
    return null;
  }

  const completa = resultado.pf.modalidades.completa;
  const simplificada = resultado.pf.modalidades.simplificada;
  const completaVantajosa = resultado.pf.modalidadeIRRF === 'Declaração completa';
  const simplificadaVantajosa = resultado.pf.modalidadeIRRF === 'Declaração simplificada';

  return (
    <section
      style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        marginTop: '24px'
      }}
    >
      <h2>Resultado do Comparativo</h2>

      <p><strong>Profissão:</strong> {resultado.profissao}</p>
      <p><strong>Renda Mensal:</strong> {formatarMoeda(resultado.renda)}</p>
      <p><strong>Custos Mensais:</strong> {formatarMoeda(resultado.custos)}</p>

      <hr style={{ margin: '20px 0' }} />

      <h3>Pessoa Física</h3>

      <div
        style={{
          border: completaVantajosa ? '2px solid #16a34a' : '1px solid #d1d5db',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '16px',
          background: completaVantajosa ? '#f0fdf4' : '#ffffff'
        }}
      >
        <h4>
          Declaração completa
          {completaVantajosa && (
            <span style={{ color: '#16a34a', marginLeft: '8px' }}>
              (Mais vantajosa)
            </span>
          )}
        </h4>
        <p><strong>Base de cálculo:</strong> {formatarMoeda(completa.baseCalculo)}</p>
        <p><strong>Imposto pela tabela:</strong> {formatarMoeda(completa.impostoTabela)}</p>
        <p><strong>Redutor 2026:</strong> {formatarMoeda(completa.redutor)}</p>
        <p><strong>IRRF devido:</strong> {formatarMoeda(completa.impostoDevido)}</p>
      </div>

      <div
        style={{
          border: simplificadaVantajosa ? '2px solid #16a34a' : '1px solid #d1d5db',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '16px',
          background: simplificadaVantajosa ? '#f0fdf4' : '#ffffff'
        }}
      >
        <h4>
          Declaração simplificada
          {simplificadaVantajosa && (
            <span style={{ color: '#16a34a', marginLeft: '8px' }}>
              (Mais vantajosa)
            </span>
          )}
        </h4>
        <p><strong>Base de cálculo:</strong> {formatarMoeda(simplificada.baseCalculo)}</p>
        <p><strong>Imposto pela tabela:</strong> {formatarMoeda(simplificada.impostoTabela)}</p>
        <p><strong>Redutor 2026:</strong> {formatarMoeda(simplificada.redutor)}</p>
        <p><strong>IRRF devido:</strong> {formatarMoeda(simplificada.impostoDevido)}</p>
      </div>

      <p>
        <strong>Modalidade mais vantajosa:</strong>{' '}
        <span style={{ color: '#2563eb' }}>{resultado.pf.modalidadeIRRF}</span>
      </p>

      <p>
        <strong>Economia obtida:</strong>{' '}
        <span style={{ color: '#16a34a' }}>{formatarMoeda(resultado.pf.economia)}</span>
      </p>

      <p><strong>Total PF:</strong> {formatarMoeda(resultado.pf.totalTributos)}</p>

      <hr style={{ margin: '20px 0' }} />

      <h3>Pessoa Jurídica</h3>
      <p><strong>Pró-labore:</strong> {formatarMoeda(resultado.pj.proLabore)}</p>
      <p><strong>DAS:</strong> {formatarMoeda(resultado.pj.das)}</p>
      <p><strong>INSS sócio:</strong> {formatarMoeda(resultado.pj.inssSocio)}</p>
      <p><strong>CPP:</strong> {formatarMoeda(resultado.pj.cpp)}</p>
      <p><strong>IRRF pró-labore:</strong> {formatarMoeda(resultado.pj.irrf)}</p>
      <p><strong>Total PJ:</strong> {formatarMoeda(resultado.pj.totalTributos)}</p>

      <hr style={{ margin: '20px 0' }} />

      <p>
        <strong>Melhor opção geral:</strong>{' '}
        <span style={{ color: '#2563eb' }}>{resultado.melhorOpcao}</span>
      </p>

      <div style={{ marginTop: '24px' }}>
        <button
          type="button"
          onClick={() => gerarPdfComparativo(resultado)}
          style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 18px',
            cursor: 'pointer'
          }}
        >
          Baixar PDF
        </button>
      </div>
    </section>
  );
}

export default ResultadoComparativo;