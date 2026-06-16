import { Resend } from 'resend';

function limparNomeArquivo(texto) {
  return String(texto || 'naf')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      erro: 'Método não permitido.'
    });
  }

  try {
    const {
      emailUsuario,
      profissao,
      pdfBase64,
      mensagemNAF
    } = req.body;

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

    const resend = new Resend(apiKey);
    const remetente = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const profissaoTexto = profissao || 'não informada';

    const mensagemTexto = mensagemNAF
      ? `
        <p><strong>Mensagem enviada ao NAF:</strong></p>
        <p>${mensagemNAF}</p>
      `
      : '';

    const { data, error } = await resend.emails.send({
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
    });

    if (error) {
      const mensagemErro =
        error.message ||
        error.name ||
        JSON.stringify(error);

      throw new Error(mensagemErro);
    }

    return res.status(200).json({
      mensagem: 'E-mail enviado com sucesso.',
      resposta: data
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);

    return res.status(500).json({
      erro: 'Erro ao enviar e-mail.',
      detalhes: error.message
    });
  }
}
