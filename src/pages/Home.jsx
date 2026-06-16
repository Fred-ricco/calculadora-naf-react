import { useState } from 'react';
import logo from '../assets/logo.png';
import FormCalculadora from '../components/FormCalculadora';
import FAQ from '../components/FAQ';
import Historico from './Historico';

function Home() {
  const [telaAtual, setTelaAtual] = useState('calculadora');

  return (
    <main className="app-container">
      <div className="card">
        <header className="app-hero">
          <div className="brand-lockup">
            <img src={logo} alt="Logo Ciências Contábeis" className="logo" />

            <div className="header-text">
              <span className="app-eyebrow">Núcleo de Apoio Contábil e Fiscal</span>
              <h1>Calculadora PF x PJ</h1>
              <p>
                Compare encargos tributários, gere relatórios em PDF e acompanhe
                simulações salvas em uma experiência mais clara.
              </p>
            </div>
          </div>
        </header>

        <div className="menu-telas">
          <button
            type="button"
            className={telaAtual === 'calculadora' ? 'ativo' : ''}
            aria-pressed={telaAtual === 'calculadora'}
            onClick={() => setTelaAtual('calculadora')}
          >
            Calculadora
          </button>

          <button
            type="button"
            className={telaAtual === 'historico' ? 'ativo' : ''}
            aria-pressed={telaAtual === 'historico'}
            onClick={() => setTelaAtual('historico')}
          >
            Histórico
          </button>
        </div>

        {telaAtual === 'calculadora' && (
          <>
            <FormCalculadora />
            <FAQ />
          </>
        )}

        {telaAtual === 'historico' && (
          <Historico />
        )}

      </div>
    </main>
  );
}

export default Home;
