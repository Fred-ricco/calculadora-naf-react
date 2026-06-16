import { useEffect, useMemo, useState } from 'react';
import { listarHistorico } from '../services/api';
import { formatarMoeda, formatarProfissao } from '../utils/formatadores';

function normalizarProfissao(profissao) {
  return String(profissao || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function obterMelhorOpcao(calculo) {
  const totalPF = calculo.resultadoPF?.totalTributos;
  const totalPJ = calculo.resultadoPJ?.totalTributos;

  if (totalPF == null || totalPJ == null) {
    return 'Não informado';
  }

  return totalPJ < totalPF ? 'PJ' : 'PF';
}

function formatarData(data) {
  if (!data) {
    return 'Não informada';
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
        setErro('Não foi possível carregar o histórico de cálculos.');
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
      (calculo) => normalizarProfissao(calculo.profissao) === profissaoFiltro
    );
  }, [historico, profissaoFiltro]);

  return (
    <section className="historico-container">
      <h2>Histórico de cálculos</h2>

      <label>
        Filtrar por profissão
        <select
          value={profissaoFiltro}
          onChange={(event) => setProfissaoFiltro(event.target.value)}
        >
          <option value="">Todas</option>
          <option value="psicologo">Psicólogo</option>
          <option value="arquiteto">Arquiteto</option>
          <option value="advogado">Advogado</option>
        </select>
      </label>

      {carregando && (
        <p>Carregando histórico...</p>
      )}

      {erro && (
        <p className="mensagem-erro">{erro}</p>
      )}

      {!carregando && !erro && historicoFiltrado.length === 0 && (
        <p>Nenhum cálculo encontrado.</p>
      )}

      {!carregando && !erro && historicoFiltrado.length > 0 && (
        <div className="historico-lista">
          {historicoFiltrado.map((calculo) => (
            <article className="historico-item" key={calculo.id}>
              <h3>{formatarProfissao(calculo.profissao)}</h3>

              <p>
                <strong>Renda:</strong> {formatarMoeda(calculo.renda)}
              </p>

              <p>
                <strong>Custos:</strong> {formatarMoeda(calculo.custos)}
              </p>

              <p>
                <strong>Melhor opção:</strong> {obterMelhorOpcao(calculo)}
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
