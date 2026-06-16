const express = require('express');

const router = express.Router();

function limparNomeArquivo(texto) {
  return String(texto || 'naf')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

router.post('/enviar', async (req, res) => {
  try {
    const { emailUsuario, profissao, pdfBase64, mensagemNAF } = req.body;

    if (!emailUsuario) {
      return res.status(400).json({
        erro: 'E-mail do usuário não informado.'
      });
    }

    if (!pdfBase64) {
      return res.status(400).json({
        erro: 'PDF não informado.'
      });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        erro: 'Chave RESEND_API_KEY não configurada.'
      });
    }

    const remetente = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const profissaoTexto = profissao || 'não informada';
    const mensagemTexto = mensagemNAF
      ? `
        <p><strong>Mensagem enviada ao NAF:</strong></p>
        <p>${mensagemNAF}</p>
      `
      : '';

    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: remetente,
        to: [emailUsuario],
        subject: 'Resultado do comparativo tributário - Calculadora NAF',
        html: `
          <h2>Calculadora Tributária NAF</h2>

          <p>Olá!</p>

          <p>
            Segue em anexo o relatório do comparativo tributário referente à profissão:
            <strong>${profissaoTexto}</strong>.
          </p>

          ${mensagemTexto}

          <p>
            Este relatório foi gerado automaticamente pela Calculadora Tributária NAF.
          </p>
        `,
        attachments: [
          {
            filename: `comparativo-tributario-${limparNomeArquivo(profissaoTexto)}.pdf`,
            content: pdfBase64
          }
        ]
      })
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        erro: 'Erro ao enviar e-mail.',
        detalhes:
          dados.message ||
          dados.error ||
          dados.name ||
          JSON.stringify(dados)
      });
    }

    return res.status(200).json({
      mensagem: 'E-mail enviado com sucesso.',
      resposta: dados
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);

    return res.status(500).json({
      erro: 'Erro ao enviar e-mail.',
      detalhes: error.message
    });
  }
});

module.exports = router;
