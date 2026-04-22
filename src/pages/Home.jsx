import FormCalculadora from '../components/FormCalculadora';

function Home() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
      <h1>Calculadora Web PJ e PF do NAF</h1>
      <p>Comparar encargos tributários entre Pessoa Física e Pessoa Jurídica.</p>

      <FormCalculadora />
    </main>
  );
}

export default Home;