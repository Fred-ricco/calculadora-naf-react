Acesso ao sistema:

Aplicação publicada em:
https://calculadora-naf-react.vercel.app/


----------------------------------------------------------------------------------------------------
## Autores

Projeto acadêmico desenvolvido pela equipe da disciplina de **Desenvolvimento de Aplicações com Frameworks Web**.

Repositório:
https://github.com/Fred-ricco/calculadora-naf-react

----------------------------------------------------------------------------------------------------
# Calculadora Tributária NAF — Comparativo PF x PJ

Projeto acadêmico desenvolvido para a disciplina de **Desenvolvimento de Aplicações com Frameworks Web**.

A aplicação permite simular e comparar a tributação de profissionais como **Pessoa Física (PF)** e **Pessoa Jurídica (PJ)**, indicando a alternativa tributária mais vantajosa com base na renda mensal, custos e profissão informados.

## Visão Geral

A Calculadora Tributária NAF é uma aplicação full stack que auxilia na comparação entre regimes tributários para profissionais liberais.

O sistema permite:

- cadastro e login de usuário;
- autenticação via JWT;
- simulação tributária entre PF e PJ;
- cálculo centralizado no backend;
- persistência do histórico de cálculos;
- consulta ao histórico por usuário autenticado;
- geração de relatório em PDF;
- envio do relatório por e-mail.

## Funcionalidades

- Cadastro de usuário.
- Login com autenticação JWT.
- Simulação tributária PF x PJ.
- Validação de renda máxima de R$ 15.000,00.
- Cálculo de IRRF 2026 para Pessoa Física.
- Comparação entre declaração completa e simplificada.
- Cálculo de Pessoa Jurídica conforme profissão.
- Comparação automática entre PF e PJ.
- Indicação da opção mais vantajosa.
- Cálculo da economia estimada.
- Histórico de cálculos por usuário autenticado.
- Filtro do histórico por profissão.
- Geração de relatório em PDF.
- Envio do relatório por e-mail.
- FAQ explicativo.

## Profissões contempladas

- Psicólogo;
- Arquiteto;
- Advogado.

## Arquitetura

```text
Frontend React/Vite
        ↓
API REST Node.js/Express
        ↓
Prisma ORM
        ↓
PostgreSQL Neon
```

O frontend é responsável pela interface, autenticação visual, formulário, resultado, histórico, PDF e consumo da API. O backend é responsável pela autenticação, JWT, cálculo tributário, persistência, histórico, envio de e-mail e comunicação com o banco.

## Tecnologias utilizadas

### Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3
- jsPDF

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Neon Database
- JWT
- bcryptjs
- Resend

### Controle de versão

- Git
- GitHub

## Estrutura do projeto

```text
calculadora-naf-react/
├── api/
│   ├── .env.example
│   └── enviar-email.js
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## Regras de negócio

### Pessoa Física

O cálculo de Pessoa Física considera:

- tabela progressiva mensal do IRRF 2026;
- redutor aplicável conforme faixa de renda;
- comparação entre declaração completa e simplificada;
- seleção automática da modalidade mais vantajosa.

### Psicólogo e Arquiteto como Pessoa Jurídica

- Anexo III;
- DAS de 6%;
- pró-labore de 28% da receita, respeitando o salário mínimo de R$ 1.621,00;
- INSS do sócio de 11%;
- CPP considerada como embutida no DAS.

### Advogado como Pessoa Jurídica

- Anexo IV;
- DAS de 4,5%;
- pró-labore fixado no salário mínimo de R$ 1.621,00;
- INSS do sócio de 11%;
- CPP patronal de 20% calculada separadamente.

### Limite de renda

```text
R$ 15.000,00
```

## APIs principais

### Cadastro

```http
POST /auth/cadastro
```

```json
{
  "nome": "Nome do usuário",
  "email": "usuario@email.com",
  "senha": "123456"
}
```

### Login

```http
POST /auth/login
```

```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

### Perfil autenticado

```http
GET /auth/perfil
```

```text
Authorization: Bearer TOKEN
```

### Simular cálculo

```http
POST /calculos/simular
```

```text
Authorization: Bearer TOKEN
```

```json
{
  "profissao": "Psicólogo",
  "renda": 15000,
  "custos": 3000
}
```

### Listar histórico

```http
GET /calculos
```

```text
Authorization: Bearer TOKEN
```

### Enviar relatório por e-mail

```http
POST /email/enviar
```

```json
{
  "emailUsuario": "usuario@email.com",
  "profissao": "Psicólogo",
  "pdfBase64": "arquivo_pdf_em_base64",
  "mensagemNAF": "Mensagem opcional"
}
```

## Configuração do ambiente

### Requisitos

Recomendado:

- Node.js 20 LTS;
- npm;
- Git;
- acesso ao banco Neon;
- chave de API do Resend, caso deseje testar envio de e-mail.

## Como executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/Fred-ricco/calculadora-naf-react.git
```

### 2. Acessar a pasta

```bash
cd calculadora-naf-react
```

### 3. Acessar a branch principal

```bash
git checkout main
```

Ou, para desenvolvimento:

```bash
git checkout develop
```

## Configurar o backend

### 1. Acessar a pasta backend

```bash
cd backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Criar arquivo `.env`

Crie um arquivo chamado:

```text
backend/.env
```

Use como base o arquivo:

```text
backend/.env.example
```

Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@host/neondb?sslmode=require"
PORT=3001
JWT_SECRET="sua_chave_secreta"
RESEND_API_KEY="sua_chave_resend"
EMAIL_FROM="Calculadora NAF <remetente@seudominio.com>"
```

Observação: no Neon, caso ocorra erro de conexão com `channel_binding=require`, utilize a string sem esse parâmetro:

```env
DATABASE_URL="postgresql://usuario:senha@host/neondb?sslmode=require"
```

### 4. Gerar Prisma Client

```bash
npx prisma generate
```

### 5. Validar conexão com o banco

```bash
npx prisma db pull
```

### 6. Rodar backend

```bash
npm run dev
```

O backend deve iniciar em:

```text
http://localhost:3001
```

## Configurar o frontend

Abra outro terminal na raiz do projeto.

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar frontend

```bash
npm run dev
```

O frontend deve iniciar em:

```text
http://localhost:5173
```

## Testes manuais recomendados

1. Acessar `http://localhost:3001` e confirmar a mensagem do backend.
2. Realizar cadastro ou login.
3. Simular cálculo para Psicólogo, Arquiteto e Advogado.
4. Validar histórico.
5. Validar filtro por profissão.
6. Gerar PDF.
7. Testar envio de e-mail, se o Resend estiver configurado.
8. Verificar se não há erros no console do navegador nem no terminal do backend.

## Fluxo Git da equipe

```text
feature/* → develop → main
```

### Branches principais

- `main`: versão estável/final;
- `develop`: branch de integração;
- `feature/*`: branches de desenvolvimento individual.

### Antes de iniciar uma tarefa

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-tarefa
```

### Após finalizar uma tarefa

```bash
git status
git add .
git commit -m "feat: descrição objetiva da alteração"
git push -u origin feature/nome-da-tarefa
```

A branch deve ser homologada antes de ser incorporada à `develop`.

## Observações importantes

- O arquivo `.env` não deve ser enviado para o GitHub.
- O cálculo tributário oficial está centralizado no backend.
- O frontend deve apenas consumir a API e exibir os resultados.
- O projeto possui finalidade acadêmica.
- As regras tributárias foram simplificadas para fins didáticos.
- Recomenda-se utilizar Node.js 20 LTS para evitar incompatibilidades com Prisma.

## Status final do projeto

- Frontend React/Vite concluído.
- Backend Express concluído.
- Banco PostgreSQL Neon configurado.
- Prisma ORM configurado.
- Autenticação JWT implementada.
- Histórico de cálculos implementado.
- PDF implementado.
- Envio de e-mail implementado.
- Fluxo Git com branches de equipe aplicado.
