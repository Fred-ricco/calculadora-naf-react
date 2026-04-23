import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { emailUsuario, pdfBase64, profissao } = req.body || {};

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY não configurada.' });
    }

    if (!process.env.EMAIL_FROM) {
      return res.status(500).json({ error: 'EMAIL_FROM não configurado.' });
    }

    if (!emailUsuario || !pdfBase64) {
      return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const base64Limpo = pdfBase64.includes(',')
      ? pdfBase64.split(',')[1]
      : pdfBase64;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [emailUsuario],
      subject: 'Seu comparativo tributário',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #222;">
          <h2 style="margin-top: 0;">Comparativo Tributário</h2>
          <p>Olá!</p>
          <p>Segue em anexo o PDF com o resultado da sua simulação tributária.</p>
          ${
            profissao
              ? `<p><strong>Profissão:</strong> ${profissao}</p>`
              : ''
          }
          <p>Atenciosamente,<br />Calculadora NAF</p>
        </div>
      `,
      attachments: [
        {
          filename: `comparativo-${profissao || 'tributario'}.pdf`,
          content: base64Limpo
        }
      ]
    });

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({
      error: 'Erro ao enviar email',
      detail: error?.message || 'Erro desconhecido'
    });
  }
}