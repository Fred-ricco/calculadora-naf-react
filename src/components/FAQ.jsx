import { useState } from 'react';

const categorias = [
  {
    id: 'primeiros-passos',
    titulo: 'Primeiros passos',
    icone: '📘',
    descricao: 'Entenda como usar a calculadora NAF.',
    perguntas: [
      'O que é o NAF?',
      'O que é a calculadora NAF?',
      'Quem pode usar a calculadora?'
    ]
  },
  {
    id: 'simulacao',
    titulo: 'Simulação tributária',
    icone: '🧮',
    descricao: 'Veja como os cálculos são feitos.',
    perguntas: [
      'Os cálculos são oficiais?',
      'Quais profissões são aceitas?',
      'O que significa PF e PJ?'
    ]
  },
  {
    id: 'relatorios',
    titulo: 'Relatórios',
    icone: '📄',
    descricao: 'Gere e envie seus resultados.',
    perguntas: [
      'Posso gerar PDF?',
      'Consigo enviar por e-mail?',
      'O relatório fica salvo?'
    ]
  },
  {
    id: 'seguranca',
    titulo: 'Segurança e acesso',
    icone: '🔐',
    descricao: 'Informações sobre dados e login.',
    perguntas: [
      'O sistema salva meus dados?',
      'Preciso estar logado?',
      'Consigo acessar pelo celular?'
    ]
  }
];

const respostas = {
  'O que é o NAF?':
    'O NAF é o Núcleo de Apoio Contábil e Fiscal, uma iniciativa acadêmica voltada à orientação fiscal e cidadã.',
  'O que é a calculadora NAF?':
    'É uma ferramenta acadêmica que simula comparativos tributários entre atuação como Pessoa Física e Pessoa Jurídica.',
  'Quem pode usar a calculadora?':
    'A calculadora pode ser usada por estudantes, professores e usuários interessados em compreender uma estimativa tributária.',
  'Os cálculos são oficiais?':
    'Não. Os cálculos são estimativas acadêmicas e não substituem a análise de um contador ou profissional habilitado.',
  'Quais profissões são aceitas?':
    'Nesta versão, a calculadora aceita Psicólogo, Arquiteto e Advogado.',
  'O que significa PF e PJ?':
    'PF significa Pessoa Física. PJ significa Pessoa Jurídica. A calculadora compara os tributos estimados entre essas duas formas de atuação.',
  'Posso gerar PDF?':
    'Sim. Após realizar a simulação, o sistema permite baixar um relatório em PDF com os dados do comparativo.',
  'Consigo enviar por e-mail?':
    'Sim. Se a opção estiver configurada no projeto, o relatório pode ser enviado ao e-mail informado pelo usuário.',
  'O relatório fica salvo?':
    'O resultado do cálculo é salvo no histórico do usuário autenticado quando a simulação é feita pelo backend.',
  'O sistema salva meus dados?':
    'O sistema salva o histórico de cálculos do usuário autenticado, conforme a integração com o backend.',
  'Preciso estar logado?':
    'Sim. As rotas de cálculo e histórico são protegidas por token JWT.',
  'Consigo acessar pelo celular?':
    'Sim. A interface foi ajustada para funcionar também em telas menores.'
};

function FAQ() {
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [perguntaAberta, setPerguntaAberta] = useState(null);

  function selecionarCategoria(categoria) {
    if (categoriaAtiva?.id === categoria.id) {
      setCategoriaAtiva(null);
      setPerguntaAberta(null);
      return;
    }

    setCategoriaAtiva(categoria);
    setPerguntaAberta(null);
  }

  function alternarPergunta(pergunta) {
    setPerguntaAberta((atual) => (atual === pergunta ? null : pergunta));
  }

  return (
    <section className="faq-help-center">
      <div className="faq-header">
        <span className="faq-tag">Central de ajuda</span>

        <h2>Perguntas frequentes</h2>

        <p>
          Encontre respostas rápidas sobre o uso da calculadora, geração de PDF,
          envio por e-mail e segurança dos dados.
        </p>
      </div>

      <div className="faq-cards">
        {categorias.map((categoria) => (
          <button
            type="button"
            className={`faq-card ${
              categoriaAtiva?.id === categoria.id ? 'ativo' : ''
            }`}
            key={categoria.id}
            onClick={() => selecionarCategoria(categoria)}
          >
            <div className="faq-card-icone">{categoria.icone}</div>

            <h3>{categoria.titulo}</h3>

            <p>{categoria.descricao}</p>
          </button>
        ))}
      </div>

      {!categoriaAtiva && (
        <p className="faq-placeholder">
          Selecione uma categoria acima para visualizar as perguntas frequentes.
        </p>
      )}

      {categoriaAtiva && (
        <div className="faq-painel">
          <div className="faq-painel-info">
            <span className="faq-painel-tag">Categoria selecionada</span>

            <h3>{categoriaAtiva.titulo}</h3>

            <p>{categoriaAtiva.descricao}</p>
          </div>

          <div className="faq-lista-perguntas">
            {categoriaAtiva.perguntas.map((pergunta) => (
              <div className="faq-link-item" key={pergunta}>
                <button
                  type="button"
                  onClick={() => alternarPergunta(pergunta)}
                >
                  <span>{pergunta}</span>
                  <strong>{perguntaAberta === pergunta ? '−' : '+'}</strong>
                </button>

                {perguntaAberta === pergunta && (
                  <p className="faq-link-resposta">
                    {respostas[pergunta]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default FAQ;