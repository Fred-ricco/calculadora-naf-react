import { useState } from 'react';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import { obterToken, removerToken } from './services/api';

function App() {
  const [token, setToken] = useState(obterToken());
  const [telaAuth, setTelaAuth] = useState('login');

  function handleLogin() {
    setToken(obterToken());
  }

  function handleLogout() {
    removerToken();
    setToken(null);
    setTelaAuth('login');
  }

  if (!token) {
    if (telaAuth === 'cadastro') {
      return <CadastroPage onIrParaLogin={() => setTelaAuth('login')} />;
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onIrParaCadastro={() => setTelaAuth('cadastro')}
      />
    );
  }

  return (
    <>
      <header className="auth-header">
        <strong>Calculadora NAF</strong>

        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <Home />
    </>
  );
}

export default App;