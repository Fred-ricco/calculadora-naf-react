import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      erro: 'Método não permitido.'
    });
  }

  try {
    const { emailUsuario, profissao, pdfBase64 } = req.body;

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

    const remetente = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    const resposta = await resend.emails.send({
      from: remetente,
      to: emailUsuario,
      subject: 'Resultado do comparativo tributário - Calculadora NAF',
      html: `
        <h2>Calculadora Tributária NAF</h2>
        <p>Olá!</p>
        <p>Segue em anexo o resultado do comparativo tributário referente à profissão: <strong>${profissao}</strong>.</p>
        <p>Este relatório foi gerado automaticamente pela Calculadora Tributária NAF.</p>
      `,
      attachments: [
        {
          filename: comparativo-tributario-${profissao || 'naf'}.pdf,
          content: pdfBase64
        }
      ]
    });

    return res.status(200).json({
      mensagem: 'E-mail enviado com sucesso.',
      resposta
    });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);

    return res.status(500).json({
      erro: 'Erro ao enviar e-mail.',
      detalhes: error.message
    });
  }
}