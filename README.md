Calculadora Tributária NAF (PF x PJ)

Descrição:

Aplicação web desenvolvida em React para simulação e comparação de tributação entre Pessoa Física (PF) e Pessoa Jurídica (PJ).

O sistema calcula automaticamente os tributos com base na renda, custos e profissão informados, destacando a opção mais vantajosa e permitindo a geração de um relatório em PDF.

----------------------------------------------------------------------------------------------------

Objetivo:

Apoiar atividades do Núcleo de Apoio Fiscal (NAF), auxiliando na análise comparativa entre regimes tributários de forma didática e automatizada.

----------------------------------------------------------------------------------------------------

Funcionalidades:

* Entrada de renda mensal (com máscara monetária)
* Entrada de custos mensais
* Seleção de profissão
* Validação de dados (incluindo limite de R$ 15.000,00)
* Cálculo de IRRF (2026) para Pessoa Física:

  * Declaração completa
  * Declaração simplificada
* Comparação automática entre modalidades
* Cálculo de tributos para Pessoa Jurídica (Simples Nacional)
* Comparativo entre PF x PJ
* Destaque da melhor opção
* Cálculo da economia
* Geração de relatório em PDF

----------------------------------------------------------------------------------------------------

Acesso ao sistema:

Aplicação publicada em:
https://calculadora-naf-react-i5xb.vercel.app/

----------------------------------------------------------------------------------------------------

Tecnologias Utilizadas:

* React
* Vite
* JavaScript
* jsPDF
* HTML5
* CSS3

----------------------------------------------------------------------------------------------------

Como executar o projeto

1. Clonar o repositório

bash:
git clone https://github.com/Fred-ricco/calculadora-naf-react.git


2. Acessar a pasta

bash:
cd calculadora-naf-react

3. Instalar dependências

bash:
npm install


4. Rodar o projeto

bash:
npm run dev


5. Acessar no navegador

text:
http://localhost:5173



Regras de Negócio:

* Limite máximo de renda: R$ 15.000,00
* Comparação automática entre declaração completa e simplificada
* Seleção da modalidade mais vantajosa
* Comparação entre PF e PJ com base no menor custo tributário

----------------------------------------------------------------------------------------------------

Geração de PDF

O sistema permite gerar um relatório completo com:

* Dados informados
* Cálculos de PF e PJ
* Modalidade mais vantajosa
* Resultado final do comparativo

----------------------------------------------------------------------------------------------------

Autor

Desenvolvido por: Equipe trabalho 1
Projeto acadêmico – Calculadora Tributária NAF

----------------------------------------------------------------------------------------------------

Observações:

Este projeto possui finalidade acadêmica e utiliza regras simplificadas para simulação tributária.
