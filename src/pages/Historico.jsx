import { useEffect, useMemo, useState } from 'react';
import { listarHistorico } from '../services/api';
import { formatarMoeda } from '../utils/formatadores';

function obterMelhorOpcao(calculo) {
  const totalPF = calculo.resultadoPF?.totalTributos;
  const totalPJ = calculo.resultadoPJ?.totalTributos;

  if (totalPF == null || totalPJ == null) {
    return 'Nao informado';
  }

  return totalPJ < totalPF ? 'PJ' : 'PF';
}

function formatarData(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}

function Historico() {
  const [historico, setHistorico] = useState([]);
  const [profissaoFiltro, setProfissaoFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await listarHistorico();

        setHistorico(resposta.data || []);
      } catch (error) {
        setErro('Nao foi possivel carregar o historico de calculos.');
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();
  }, []);

  const historicoFiltrado = useMemo(() => {
    if (!profissaoFiltro) {
      return historico;
    }

    return historico.filter(
      (calculo) => calculo.profissao === profissaoFiltro
    );
  }, [historico, profissaoFiltro]);

  return (
    <section className="historico-container">
      <h2>Historico de calculos</h2>

      <label>
        Filtrar por profissao
        <select
          value={profissaoFiltro}
          onChange={(event) => setProfissaoFiltro(event.target.value)}
        >
          <option value="">Todas</option>
          <option value="Psicólogo">Psicologo</option>
          <option value="Arquiteto">Arquiteto</option>
          <option value="Advogado">Advogado</option>
        </select>
      </label>

      {carregando && (
        <p>Carregando historico...</p>
      )}

      {erro && (
        <p className="mensagem-erro">{erro}</p>
      )}

      {!carregando && !erro && historicoFiltrado.length === 0 && (
        <p>Nenhum calculo encontrado.</p>
      )}

      {!carregando && !erro && historicoFiltrado.length > 0 && (
        <div className="historico-lista">
          {historicoFiltrado.map((calculo) => (
            <article className="historico-item" key={calculo.id}>
              <h3>{calculo.profissao}</h3>

              <p>
                <strong>Renda:</strong> {formatarMoeda(calculo.renda)}
              </p>

              <p>
                <strong>Custos:</strong> {formatarMoeda(calculo.custos)}
              </p>

              <p>
                <strong>Melhor opcao:</strong> {obterMelhorOpcao(calculo)}
              </p>

              <p>
                <strong>Economia:</strong> {formatarMoeda(calculo.economia)}
              </p>

              <p>
                <strong>Data:</strong> {formatarData(calculo.createdAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Historico;