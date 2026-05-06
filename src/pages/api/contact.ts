/**
 * API Route — POST /api/contact
 *
 * Recebe os dados do formulário de contato, valida e encaminha via Resend.
 *
 * Fluxo:
 * 1. Parse do body JSON (400 se malformado)
 * 2. Verificação do honeypot (400 silencioso se preenchido)
 * 3. Validação server-side via validateForm (400 com erros se inválido)
 * 4. Envio via sendContactEmail (500 com mensagem genérica se falhar)
 * 5. Sucesso → 200 { success: true }
 *
 * IMPORTANTE: Nunca expor stack traces ou detalhes internos nas respostas.
 *
 * Requisitos: 6.2, 6.7, 10.6, 14.2, 14.5
 */

import type { APIRoute } from 'astro';
import { validateForm, deserializeForm } from '../../lib/formValidator';
import { sendContactEmail } from '../../lib/mailer';

export const POST: APIRoute = async ({ request }) => {
  // ── 1. Parse do body JSON ──────────────────────────────────────────────────
  let data: ReturnType<typeof deserializeForm>;

  try {
    const text = await request.text();
    data = deserializeForm(text);
  } catch {
    // JSON malformado ou campos obrigatórios ausentes — não expor detalhes
    return new Response(
      JSON.stringify({ error: 'Requisição inválida.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // ── 2. Verificação do honeypot ─────────────────────────────────────────────
  // Se o campo honeypot estiver preenchido, retornar 400 silenciosamente
  // (sem revelar ao bot que foi detectado)
  if (data.honeypot !== undefined && data.honeypot !== '') {
    return new Response(
      JSON.stringify({ error: 'Requisição inválida.' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // ── 3. Validação server-side ───────────────────────────────────────────────
  const validation = validateForm(data);

  if (!validation.isValid) {
    return new Response(
      JSON.stringify({ error: 'Dados inválidos.', errors: validation.errors }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // ── 4. Envio via Resend ────────────────────────────────────────────────────
  try {
    await sendContactEmail(data);
  } catch {
    // Não expor detalhes do erro interno
    return new Response(
      JSON.stringify({
        error: 'Erro interno ao processar sua mensagem. Tente novamente mais tarde.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // ── 5. Sucesso ─────────────────────────────────────────────────────────────
  return new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
