import { useState } from 'react';
import { loginUsuario, salvarToken } from '../services/api';

export default function LoginPage({ onLogin, onIrParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const data = await loginUsuario({ email, senha });
      salvarToken(data.token);
      onLogin(data.usuario);
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
            <span className="auth-tag">Calculadora Tributária</span>
            <h1>Compare PF e PJ com mais clareza.</h1>
            <p>
              Acesse sua conta para simular encargos tributários, consultar
              resultados e acompanhar seus cálculos salvos.
            </p>
          </div>

          <div className="auth-benefits">
            <div>
              <strong>PDF</strong>
              <span>Relatórios acadêmicos</span>
            </div>

            <div>
              <strong>Histórico</strong>
              <span>Cálculos salvos</span>
            </div>

            <div>
              <strong>JWT</strong>
              <span>Acesso autenticado</span>
            </div>
          </div>
        </aside>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-header">
            <span>Bem-vindo de volta</span>
            <h2>Login</h2>
            <p>Entre para continuar usando a Calculadora NAF.</p>
          </div>

          {erro && <p className="auth-error">{erro}</p>}

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
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="auth-switch-text">
            Ainda não tem conta?
            <button type="button" className="link-button" onClick={onIrParaCadastro}>
              Criar cadastro
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}