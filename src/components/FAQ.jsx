import { useState } from 'react'

function FAQ() {
  const [aberta, setAberta] = useState(null)

  const perguntas = [
    {
      pergunta: 'O que é o NAF?',
      resposta:
        'NAF, significa Núcleo de Apoio Contábil e Fiscal, um projeto de orientação fiscal e contábil à comunidade.'
    },
    {
      pergunta: 'O que é a calculadora NAF?',
      resposta:
        'É uma ferramenta para comparar cenários tributários e auxiliar na tomada de decisão.'
    },
    {
      pergunta: 'Os cálculos são oficiais?',
      resposta:
        'Os resultados são estimativas e recomenda-se procurar um profissional da área contábil para análise.'
    },
    {
      pergunta: 'Posso gerar PDF?',
      resposta:
        'Sim, o sistema possui funcionalidade de geração de PDF.'
    },
    {
      pergunta: 'O sistema salva meus dados?',
      resposta:
        'Não, as informações preenchidas são utilizadas apenas para realizar os cálculos.'
    },
    {
      pergunta: 'Consigo acessar a calculadora pelo celular?',
      resposta:
        'Sim, a aplicação foi desenvolvida para funcionar em computadores e dispositivos móveis.'
    }
  ]

  const togglePergunta = (index) => {
    setAberta(aberta === index ? null : index)
  }

  return (
    <section className="faq-container">
      <h2>Perguntas Frequentes</h2>

      {perguntas.map((item, index) => (
        <div key={index} className="faq-item">
          <button
            className="faq-pergunta"
            onClick={() => togglePergunta(index)}
          >
            <span>{item.pergunta}</span>

            <span>
              {aberta === index ? '−' : '+'}
            </span>
          </button>

          {aberta === index && (
            <p className="faq-resposta">
              {item.resposta}
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

export default FAQ
