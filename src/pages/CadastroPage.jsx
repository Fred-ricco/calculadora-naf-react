import { useState } from 'react';
import { cadastrarUsuario } from '../services/api';

export default function CadastroPage({ onIrParaLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setMensagem('');
    setCarregando(true);

    try {
      await cadastrarUsuario({ nome, email, senha });
      setMensagem('Cadastro realizado com sucesso. Faça login para continuar.');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-hero">
          <div className="auth-logo-mark">NAF</div>

          <div>
            <span className="auth-tag">Acesso ao sistema</span>
            <h1>Crie sua conta e comece a simular.</h1>
            <p>
              Cadastre-se para acessar a calculadora, gerar comparativos entre
              Pessoa Física e Pessoa Jurídica e acompanhar seus resultados.
            </p>
          </div>

          <div className="auth-benefits">
            <div>
              <strong>PF x PJ</strong>
              <span>Comparativo tributário</span>
            </div>

            <div>
              <strong>NAF</strong>
              <span>Apoio acadêmico</span>
            </div>

            <div>
              <strong>Seguro</strong>
              <span>Acesso com token</span>
            </div>
          </div>
        </aside>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-header">
            <span>Novo usuário</span>
            <h2>Cadastro</h2>
            <p>Preencha os dados para criar seu acesso.</p>
          </div>

          {erro && <p className="auth-error">{erro}</p>}
          {mensagem && <p className="auth-success">{mensagem}</p>}

          <label>
            Nome
            <input
              placeholder="Seu nome completo"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <p className="auth-switch-text">
            Já possui conta?
            <button type="button" className="link-button" onClick={onIrParaLogin}>
              Voltar para login
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}