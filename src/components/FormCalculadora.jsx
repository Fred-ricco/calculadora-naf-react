import { useState } from 'react';
import { PROFISSOES } from '../data/profissoes';
import { validarFormulario } from '../utils/validacoes';
import api from '../services/api';
import ResultadoComparativo from './ResultadoComparativo';
import { gerarPdfBase64 } from '../services/pdfService';
import {
  formatarMoedaInput,
  converterMoedaParaNumero
} from '../utils/formatadores';

const LIMITE_MENSAGEM_NAF = 500;
const LIMITE_RENDA = 15000;
const EMAIL_API_URL =
  import.meta.env.VITE_EMAIL_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3001/email/enviar'
    : '/api/enviar-email');

function obterMensagemErro(error) {
  return (
    error?.response?.data?.erro ||
    error?.response?.data?.message ||
    error?.message ||
    'Não foi possível concluir a operação. Verifique os dados e tente novamente.'
  );
}

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
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  function limparMensagem() {
    if (mensagem) {
      setMensagem(null);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    limparMensagem();

    if (name === 'renda') {
      const valorFormatado = formatarMoedaInput(value);
      const valorDigitado = converterMoedaParaNumero(valorFormatado);

      setForm((prev) => ({
        ...prev,
        renda: valorFormatado
      }));

      if (valorDigitado > LIMITE_RENDA) {
        setRendaExcedida(true);
        setResultado(null);
        setErros((prev) => ({
          ...prev,
          renda: 'A renda mensal não pode ultrapassar R$ 15.000,00.'
        }));
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
      setForm((prev) => ({
        ...prev,
        custos: formatarMoedaInput(value)
      }));

      setErros((prev) => ({
        ...prev,
        custos: ''
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

    if (name === 'profissao' || name === 'emailUsuario') {
      setErros((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  }

  async function enviarRelatorioPorEmail(resultadoCalculado) {
    const pdfBase64 = gerarPdfBase64(resultadoCalculado);

    const resposta = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailUsuario: form.emailUsuario,
        pdfBase64,
        profissao: resultadoCalculado.profissao,
        mensagemNAF: form.mensagemNAF
      })
    });

    const tipoConteudo = resposta.headers.get('content-type') || '';
    const corpoResposta = tipoConteudo.includes('application/json')
      ? await resposta.json().catch(() => ({}))
      : await resposta.text().catch(() => '');

    if (!resposta.ok) {
      const mensagemErro =
        corpoResposta?.detalhes ||
        corpoResposta?.erro ||
        corpoResposta?.message ||
        (typeof corpoResposta === 'string' ? corpoResposta.trim() : '') ||
        `Erro ao enviar e-mail. Status HTTP ${resposta.status}.`;

      throw new Error(mensagemErro);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setMensagem(null);

    const rendaNumero = converterMoedaParaNumero(form.renda);

    if (rendaExcedida || rendaNumero > LIMITE_RENDA) {
      setRendaExcedida(true);
      setResultado(null);
      setErros((prev) => ({
        ...prev,
        renda: 'A renda mensal não pode ultrapassar R$ 15.000,00.'
      }));
      return;
    }

    const novosErros = validarFormulario(form);
    setErros(novosErros);

    if (Object.keys(novosErros).some((chave) => novosErros[chave])) {
      setResultado(null);
      setMensagem({
        tipo: 'erro',
        texto: 'Revise os campos destacados antes de calcular.'
      });
      return;
    }

    try {
      setLoading(true);
      setResultado(null);

      const token = localStorage.getItem('token');

      if (!token) {
        setMensagem({
          tipo: 'erro',
          texto: 'Token de autenticação não encontrado. Faça login ou insira o token temporário no localStorage.'
        });
        return;
      }

      const response = await api.post(
        '/calculos/simular',
        {
          profissao: form.profissao,
          renda: rendaNumero,
          custos: converterMoedaParaNumero(form.custos)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const resultadoCalculado = response.data.resultado;
      setResultado(resultadoCalculado);

      if (form.enviarEmail) {
        try {
          await enviarRelatorioPorEmail(resultadoCalculado);
          setMensagem({
            tipo: 'sucesso',
            texto: 'Cálculo realizado e e-mail enviado com sucesso.'
          });
        } catch (emailError) {
          console.error('Erro ao enviar e-mail:', emailError);
          setMensagem({
            tipo: 'erro',
            texto: `Cálculo realizado, mas não foi possível enviar o e-mail. ${obterMensagemErro(emailError)}`
          });
        }
      } else {
        setMensagem({
          tipo: 'sucesso',
          texto: 'Cálculo realizado com sucesso.'
        });
      }
    } catch (error) {
      console.error(error);

      setResultado(null);
      setMensagem({
        tipo: 'erro',
        texto: obterMensagemErro(error)
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {mensagem && (
        <div className={`mensagem ${mensagem.tipo}`} role="status">
          {mensagem.texto}
        </div>
      )}

      <form className="form-calculadora" onSubmit={handleSubmit}>
        <div className="campo-formulario">
          <label htmlFor="renda">Renda mensal (valor bruto)</label>
          <input
            id="renda"
            type="text"
            name="renda"
            value={form.renda}
            onChange={handleChange}
            placeholder="R$ 0,00"
            inputMode="numeric"
            aria-invalid={Boolean(erros.renda)}
          />
          <small>Limite máximo: R$ 15.000,00</small>
          {erros.renda && <p className="erro-campo">{erros.renda}</p>}
        </div>

        <div className="campo-formulario">
          <label htmlFor="custos">Total de custos mensais</label>
          <input
            id="custos"
            type="text"
            name="custos"
            value={form.custos}
            onChange={handleChange}
            placeholder="R$ 0,00"
            inputMode="numeric"
            aria-invalid={Boolean(erros.custos)}
          />
          {erros.custos && <p className="erro-campo">{erros.custos}</p>}
        </div>

        <div className="campo-formulario">
          <label htmlFor="profissao">Profissão</label>
          <select
            id="profissao"
            name="profissao"
            value={form.profissao}
            onChange={handleChange}
            aria-invalid={Boolean(erros.profissao)}
          >
            <option value="">Selecione</option>
            {PROFISSOES.map((profissao) => (
              <option key={profissao.value} value={profissao.value}>
                {profissao.label}
              </option>
            ))}
          </select>
          {erros.profissao && <p className="erro-campo">{erros.profissao}</p>}
        </div>

        <label className="checkbox-email">
          <input
            type="checkbox"
            name="enviarEmail"
            checked={form.enviarEmail}
            onChange={handleChange}
          />
          <span>Desejo receber os cálculos por e-mail</span>
        </label>

        {form.enviarEmail && (
          <div className="campo-formulario">
            <label htmlFor="emailUsuario">E-mail do usuário</label>
            <input
              id="emailUsuario"
              type="email"
              name="emailUsuario"
              value={form.emailUsuario}
              onChange={handleChange}
              placeholder="exemplo@email.com"
              aria-invalid={Boolean(erros.emailUsuario)}
            />
            {erros.emailUsuario && (
              <p className="erro-campo">{erros.emailUsuario}</p>
            )}
          </div>
        )}

        <div className="campo-formulario">
          <label htmlFor="mensagemNAF">Mensagem para o NAF</label>
          <textarea
            id="mensagemNAF"
            name="mensagemNAF"
            value={form.mensagemNAF}
            onChange={handleChange}
            rows="4"
            placeholder="Digite sua dúvida ou mensagem"
            aria-invalid={Boolean(erros.mensagemNAF)}
          />
          <small>
            Máximo de {LIMITE_MENSAGEM_NAF} caracteres.{' '}
            {form.mensagemNAF.length}/{LIMITE_MENSAGEM_NAF}
          </small>
          {erros.mensagemNAF && (
            <p className="erro-campo">{erros.mensagemNAF}</p>
          )}
        </div>

        <button type="submit" disabled={rendaExcedida || loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </button>

        {loading && (
          <div className="loading-calculo" aria-live="polite">
            <span className="spinner" />
            Processando cálculo no backend...
          </div>
        )}
      </form>

      <ResultadoComparativo resultado={resultado} />
    </>
  );
}

export default FormCalculadora;
