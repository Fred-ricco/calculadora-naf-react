import FormCalculadora from '../components/FormCalculadora';
import ResultadoComparativo from '../components/ResultadoComparativo';
import logo from '../assets/logo.png';

function Home() {
  return (
    <main className="app-container">
      <div className="card">

        <img src={logo} alt="Logo Ciências Contábeis" className="logo" />

        <div className="header-text">
          <h1>Calculadora Web PJ e PF do NAF</h1>
          <p>Comparar encargos tributários entre Pessoa Física e Pessoa Jurídica.</p>
        </div>

        <FormCalculadora />
        <ResultadoComparativo />

      </div>
    </main>
  );
}

export default Home;