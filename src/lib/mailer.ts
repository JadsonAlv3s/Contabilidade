/**
 * Módulo de envio de e-mail via Resend.
 *
 * Responsável por formatar e encaminhar os dados do formulário de contato
 * ao endereço configurado via variável de ambiente.
 *
 * Requisitos: 6.2, 12.4, 12.6, 14.3
 */

import { Resend } from 'resend';
import type { ContactFormData } from './formValidator';

/**
 * Envia o e-mail de contato com os dados do formulário.
 *
 * @param data - Dados validados do formulário de contato.
 * @throws {Error} Se o envio falhar ou as variáveis de ambiente não estiverem configuradas.
 *
 * Requisitos: 6.2, 12.4, 12.6, 14.3
 */
export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY as string | undefined;
  const toEmail = import.meta.env.CONTACT_EMAIL as string | undefined;
  const fromEmail =
    (import.meta.env.RESEND_FROM_EMAIL as string | undefined) ||
    'noreply@danubiacarvalho.com.br';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY não configurada.');
  }

  if (!toEmail) {
    throw new Error('CONTACT_EMAIL não configurada.');
  }

  const resend = new Resend(apiKey);

  const html = buildEmailHtml(data);
  const text = buildEmailText(data);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `Nova mensagem de contato — ${data.name}`,
    html,
    text,
  });

  if (error) {
    throw new Error(`Falha ao enviar e-mail: ${error.message}`);
  }
}

// ─── Formatação do e-mail ─────────────────────────────────────────────────────

/**
 * Formata os dados do formulário em HTML legível para o e-mail.
 */
function buildEmailHtml(data: ContactFormData): string {
  const companyRow = data.company
    ? `<tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #374151; white-space: nowrap; vertical-align: top;">Empresa:</td>
        <td style="padding: 8px 12px; color: #374151;">${escapeHtml(data.company)}</td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nova mensagem de contato</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: Inter, system-ui, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 600px; width: 100%;">

          <!-- Cabeçalho -->
          <tr>
            <td style="background-color: #1A2A5E; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700;">
                Nova mensagem de contato
              </h1>
              <p style="margin: 4px 0 0; color: #c7d2fe; font-size: 14px;">
                Danúbia Carvalho — Consultoria Contábil Estratégica
              </p>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; color: #374151; font-size: 15px;">
                Você recebeu uma nova mensagem pelo formulário de contato do site.
              </p>

              <!-- Tabela de dados -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 8px 12px; font-weight: 600; color: #374151; white-space: nowrap; vertical-align: top;">Nome:</td>
                  <td style="padding: 8px 12px; color: #374151;">${escapeHtml(data.name)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-weight: 600; color: #374151; white-space: nowrap; vertical-align: top;">E-mail:</td>
                  <td style="padding: 8px 12px; color: #374151;">
                    <a href="mailto:${escapeHtml(data.email)}" style="color: #1A2A5E;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 8px 12px; font-weight: 600; color: #374151; white-space: nowrap; vertical-align: top;">Telefone:</td>
                  <td style="padding: 8px 12px; color: #374151;">${escapeHtml(data.phone)}</td>
                </tr>
                ${companyRow}
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 8px 12px; font-weight: 600; color: #374151; white-space: nowrap; vertical-align: top;">Mensagem:</td>
                  <td style="padding: 8px 12px; color: #374151; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
                </tr>
              </table>

              <!-- Responder -->
              <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border-left: 4px solid #1A2A5E; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>Responder:</strong> Clique em "Responder" neste e-mail ou escreva para
                  <a href="mailto:${escapeHtml(data.email)}" style="color: #1A2A5E;">${escapeHtml(data.email)}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background-color: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                Esta mensagem foi enviada pelo formulário de contato de
                <a href="https://danubiacarvalho.com.br" style="color: #1A2A5E;">danubiacarvalho.com.br</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Formata os dados do formulário em texto simples para o e-mail.
 */
function buildEmailText(data: ContactFormData): string {
  const lines = [
    'Nova mensagem de contato — Danúbia Carvalho Consultoria Contábil',
    '='.repeat(60),
    '',
    `Nome:      ${data.name}`,
    `E-mail:    ${data.email}`,
    `Telefone:  ${data.phone}`,
  ];

  if (data.company) {
    lines.push(`Empresa:   ${data.company}`);
  }

  lines.push(
    '',
    'Mensagem:',
    '-'.repeat(40),
    data.message,
    '-'.repeat(40),
    '',
    `Para responder, escreva para: ${data.email}`,
    '',
    'Esta mensagem foi enviada pelo formulário de contato de danubiacarvalho.com.br'
  );

  return lines.join('\n');
}

/**
 * Escapa caracteres HTML especiais para evitar XSS no corpo do e-mail.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
