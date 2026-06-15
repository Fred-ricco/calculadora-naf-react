import { formatarMoeda, formatarProfissao } from '../utils/formatadores';
import { gerarPdf } from '../services/pdfService';

function obterValor(objeto, caminho, valorPadrao = 0) {
  return caminho.reduce((valorAtual, chave) => {
    if (valorAtual && valorAtual[chave] !== undefined) {
      return valorAtual[chave];
    }

    return undefined;
  }, objeto) ?? valorPadrao;
}

function ResultadoComparativo({ resultado }) {
  if (!resultado) {
    return null;
  }

  const completa = resultado.pf?.completa || {};
  const simplificada = resultado.pf?.simplificada || {};
  const pj = resultado.pj || {};

  const modalidadeMaisVantajosa =
    resultado.pf?.modalidadeMaisVantajosa || 'Não informada';

  const completaVantajosa =
    modalidadeMaisVantajosa.toLowerCase().includes('completa');

  const simplificadaVantajosa =
    modalidadeMaisVantajosa.toLowerCase().includes('simplificada');

  return (
    <section className="resultado-comparativo">
      <div className="resultado-cabecalho">
        <div>
          <p className="resultado-subtitulo">Resultado da simulação</p>
          <h2>Comparativo Tributário</h2>
        </div>

        <span className="badge-economia">
          Economia geral: {formatarMoeda(resultado.economiaGeral)}
        </span>
      </div>

      <div className="resumo-simulacao">
        <p className="linha-resultado">
          <strong>Profissão</strong>
          <span>{formatarProfissao(resultado.profissao)}</span>
        </p>

        <p className="linha-resultado">
          <strong>Renda mensal</strong>
          <span>{formatarMoeda(resultado.renda)}</span>
        </p>

        <p className="linha-resultado">
          <strong>Custos mensais</strong>
          <span>{formatarMoeda(resultado.custos)}</span>
        </p>
      </div>

      <div className="bloco-resultado">
        <h3>Pessoa Física</h3>

        <div className="grid-modalidades">
          <div className={`card-modalidade ${completaVantajosa ? 'vantajosa' : ''}`}>
            <h4>
              Declaração completa
              {completaVantajosa && <span>Mais vantajosa</span>}
            </h4>

            <p className="linha-resultado">
              <strong>Base de cálculo</strong>
              <span>{formatarMoeda(completa.baseCalculo)}</span>
            </p>

            <p className="linha-resultado">
              <strong>Imposto pela tabela</strong>
              <span>{formatarMoeda(completa.impostoTabela)}</span>
            </p>

            <p className="linha-resultado">
              <strong>Redutor 2026</strong>
              <span>{formatarMoeda(completa.redutor)}</span>
            </p>

            <p className="linha-resultado destaque">
              <strong>IRRF devido</strong>
              <span>{formatarMoeda(completa.impostoDevido)}</span>
            </p>
          </div>

          <div className={`card-modalidade ${simplificadaVantajosa ? 'vantajosa' : ''}`}>
            <h4>
              Declaração simplificada
              {simplificadaVantajosa && <span>Mais vantajosa</span>}
            </h4>

            <p className="linha-resultado">
              <strong>Base de cálculo</strong>
              <span>{formatarMoeda(simplificada.baseCalculo)}</span>
            </p>

            <p className="linha-resultado">
              <strong>Imposto pela tabela</strong>
              <span>{formatarMoeda(simplificada.impostoTabela)}</span>
            </p>

            <p className="linha-resultado">
              <strong>Redutor 2026</strong>
              <span>{formatarMoeda(simplificada.redutor)}</span>
            </p>

            <p className="linha-resultado destaque">
              <strong>IRRF devido</strong>
              <span>{formatarMoeda(simplificada.impostoDevido)}</span>
            </p>
          </div>
        </div>

        <div className="resumo-simulacao compacto">
          <p className="linha-resultado">
            <strong>Modalidade mais vantajosa</strong>
            <span>{modalidadeMaisVantajosa}</span>
          </p>

          <p className="linha-resultado destaque">
            <strong>Total PF</strong>
            <span>{formatarMoeda(resultado.pf?.totalTributos)}</span>
          </p>
        </div>
      </div>

      <div className="bloco-resultado">
        <h3>Pessoa Jurídica</h3>

        <div className="resumo-simulacao">
          <p className="linha-resultado">
            <strong>Anexo</strong>
            <span>{pj.anexo || '-'}</span>
          </p>

          <p className="linha-resultado">
            <strong>DAS</strong>
            <span>{formatarMoeda(pj.das)}</span>
          </p>

          <p className="linha-resultado">
            <strong>Pró-labore</strong>
            <span>{formatarMoeda(pj.proLabore)}</span>
          </p>

          <p className="linha-resultado">
            <strong>INSS sócio</strong>
            <span>{formatarMoeda(pj.inssSocio)}</span>
          </p>

          <p className="linha-resultado">
            <strong>CPP</strong>
            <span>{formatarMoeda(pj.cpp)}</span>
          </p>

          <p className="linha-resultado destaque">
            <strong>Total PJ</strong>
            <span>{formatarMoeda(pj.totalTributos)}</span>
          </p>
        </div>
      </div>

      <div className="resultado-final">
        <p className="linha-resultado destaque">
          <strong>Melhor opção geral</strong>
          <span>{resultado.melhorOpcao || '-'}</span>
        </p>
      </div>

      <button
        type="button"
        className="botao-pdf"
        onClick={() => gerarPdf(resultado)}
      >
        Baixar PDF acadêmico
      </button>
    </section>
  );
}

export default ResultadoComparativo;