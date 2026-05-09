import FormCalculadora from '../components/FormCalculadora';
import ResultadoComparativo from '../components/ResultadoComparativo';
import logo from '../assets/logo.png';
import FAQ from '../components/FAQ'

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
        <FAQ />

      </div>
    </main>
  );
}

export default Home;
