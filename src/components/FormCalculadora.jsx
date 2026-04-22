import { useState } from 'react';
import { PROFISSOES } from '../data/profissoes';
import { validarFormulario } from '../utils/validacoes';
import { calcularTributacao } from '../services/calculoTributario';
import ResultadoComparativo from './ResultadoComparativo';
import {
  formatarMoedaInput,
  converterMoedaParaNumero
} from '../utils/formatadores';

const LIMITE_MENSAGEM_NAF = 500;
const LIMITE_RENDA = 15000;

function FormCalculadora() {
  const [form, setForm] = useState({
    renda: '',
    custos: '',
    profissao: '',
    enviarEmail: false,
    emailUsuario: '',
    mensagemNAF: ''
  });

  const [rendaExcedida, setRendaExcedida] = useState(false);
  const [erros, setErros] = useState({});
  const [resultado, setResultado] = useState(null);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    if (name === 'renda') {
      const valorFormatadoTentativa = formatarMoedaInput(value);
      const valorDigitado = converterMoedaParaNumero(valorFormatadoTentativa);

      setForm((prev) => ({
        ...prev,
        renda: valorFormatadoTentativa
      }));

      if (valorDigitado > LIMITE_RENDA) {
        setRendaExcedida(true);
        setErros((prev) => ({
          ...prev,
          renda: 'A renda mensal não pode ultrapassar R$ 15.000,00.'
        }));
        setResultado(null);
      } else {
        setRendaExcedida(false);
        setErros((prev) => ({
          ...prev,
          renda: ''
        }));
      }

      return;
    }

    if (name === 'custos') {
      const valorFormatado = formatarMoedaInput(value);

      setForm((prev) => ({
        ...prev,
        custos: valorFormatado
      }));

      return;
    }

    if (name === 'mensagemNAF') {
      if (value.length > LIMITE_MENSAGEM_NAF) {
        return;
      }

      setForm((prev) => ({
        ...prev,
        mensagemNAF: value
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (rendaExcedida) {
      setErros((prev) => ({
        ...prev,
        renda: 'A renda mensal não pode ultrapassar R$ 15.000,00.'
      }));
      setResultado(null);
      return;
    }

    const rendaNumero = converterMoedaParaNumero(form.renda);

    if (rendaNumero > LIMITE_RENDA) {
      setRendaExcedida(true);
      setErros((prev) => ({
        ...prev,
        renda: 'A renda mensal não pode ultrapassar R$ 15.000,00.'
      }));
      setResultado(null);
      return;
    }

    const novosErros = validarFormulario(form);
    setErros(novosErros);

    if (Object.keys(novosErros).some((chave) => novosErros[chave])) {
      setResultado(null);
      return;
    }

    const calculo = calcularTributacao({
      ...form,
      renda: rendaNumero,
      custos: converterMoedaParaNumero(form.custos)
    });

    setResultado(calculo);
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div>
          <label>Renda mensal (valor bruto)</label>
          <input
            type="text"
            name="renda"
            value={form.renda}
            onChange={handleChange}
            placeholder="R$ 0,00"
            inputMode="numeric"
            style={{
              border: erros.renda ? '1px solid red' : '1px solid #ccc'
            }}
          />
          <small
            style={{
              display: 'block',
              marginTop: '-10px',
              marginBottom: '12px',
              color: '#6b7280'
            }}
          >
            Limite máximo: R$ 15.000,00
          </small>
          {erros.renda && <p style={{ color: 'red' }}>{erros.renda}</p>}
        </div>

        <div>
          <label>Total de custos mensais</label>
          <input
            type="text"
            name="custos"
            value={form.custos}
            onChange={handleChange}
            placeholder="R$ 0,00"
          />
          {erros.custos && <p style={{ color: 'red' }}>{erros.custos}</p>}
        </div>

        <div>
          <label>Profissão</label>
          <select
            name="profissao"
            value={form.profissao}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            {PROFISSOES.map((profissao) => (
              <option key={profissao.value} value={profissao.value}>
                {profissao.label}
              </option>
            ))}
          </select>
          {erros.profissao && <p style={{ color: 'red' }}>{erros.profissao}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>
            <input
              type="checkbox"
              name="enviarEmail"
              checked={form.enviarEmail}
              onChange={handleChange}
              style={{ width: 'auto', marginRight: '8px' }}
            />
            Desejo receber os cálculos por e-mail
          </label>
        </div>

        {form.enviarEmail && (
          <div>
            <label>E-mail do usuário</label>
            <input
              type="email"
              name="emailUsuario"
              value={form.emailUsuario}
              onChange={handleChange}
            />
            {erros.emailUsuario && (
              <p style={{ color: 'red' }}>{erros.emailUsuario}</p>
            )}
          </div>
        )}

        <div>
          <label>Mensagem para o NAF</label>
          <textarea
            name="mensagemNAF"
            value={form.mensagemNAF}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '8px',
              marginBottom: '8px'
            }}
            placeholder="Digite sua dúvida ou mensagem"
          />
          <small
            style={{ display: 'block', marginBottom: '12px', color: '#6b7280' }}
          >
            Máximo de {LIMITE_MENSAGEM_NAF} caracteres.{' '}
            {form.mensagemNAF.length}/{LIMITE_MENSAGEM_NAF}
          </small>
          {erros.mensagemNAF && (
            <p style={{ color: 'red' }}>{erros.mensagemNAF}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={rendaExcedida}
          style={{
            opacity: rendaExcedida ? 0.6 : 1,
            cursor: rendaExcedida ? 'not-allowed' : 'pointer'
          }}
        >
          Calcular
        </button>
      </form>

      <ResultadoComparativo resultado={resultado} />
    </>
  );
}

export default FormCalculadora;