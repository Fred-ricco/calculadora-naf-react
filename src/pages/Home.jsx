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
    
        <img src={logo} alt="Logo Ciências Contábeis" className="logo" />

        <div className="header-text">
          <h1>Calculadora Web PJ e PF do NAF</h1>
          <p>Comparar encargos tributários entre Pessoa Física e Pessoa Jurídica.</p>
        </div>

        <div className="menu-telas">
          <button
            type="button"
            onClick={() => setTelaAtual('calculadora')}
          >
            Calculadora
          </button>

          <button
            type="button"
            onClick={() => setTelaAtual('historico')}
          >
            Historico
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
