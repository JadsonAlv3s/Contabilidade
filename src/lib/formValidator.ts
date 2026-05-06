/**
 * Módulo de validação do formulário de contato.
 *
 * Responsável por validar, serializar e desserializar os dados do formulário
 * antes do envio ao servidor.
 *
 * Requisitos: 6.2, 6.3, 6.4, 6.5, 6.8, 6.9, 14.1, 14.2, 14.3, 14.4
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  lgpdConsent: boolean;
  honeypot?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

/**
 * Regex de e-mail baseado em RFC 5322 (simplificado mas robusto).
 * Cobre a grande maioria dos endereços de e-mail válidos do mundo real.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Regex para telefone brasileiro com DDD.
 *
 * Formatos aceitos (exemplos):
 *   (11) 99999-9999
 *   (11) 9999-9999
 *   +55 11 99999-9999
 *   +55 11 9999-9999
 *   +5511999999999
 *   11999999999
 *   11 99999-9999
 *   11 9999-9999
 *
 * Requisito 6.5: aceitar formatos brasileiros com DDD.
 */
const PHONE_REGEX =
  /^(?:(?:\+55\s?)?(?:\(?\d{2}\)?[\s-]?)(?:9\d{4}|\d{4})[\s-]?\d{4})$/;

// ─── Funções de validação individuais ────────────────────────────────────────

/**
 * Valida um endereço de e-mail conforme RFC 5322.
 *
 * @param email - String a ser validada.
 * @returns `true` se o e-mail for válido, `false` caso contrário.
 *
 * Requisito 6.4
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Valida um número de telefone brasileiro com DDD.
 *
 * @param phone - String a ser validada.
 * @returns `true` se o telefone for válido, `false` caso contrário.
 *
 * Requisito 6.5
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  // Remove espaços extras nas extremidades antes de testar
  return PHONE_REGEX.test(phone.trim());
}

// ─── Validação completa do formulário ────────────────────────────────────────

/**
 * Valida todos os campos do formulário de contato.
 *
 * Regras:
 * - `name`: obrigatório, não vazio após trim
 * - `email`: obrigatório, RFC 5322
 * - `phone`: obrigatório, formato brasileiro com DDD
 * - `message`: obrigatório, não vazio após trim
 * - `lgpdConsent`: deve ser `true`
 * - `honeypot`: deve ser vazio ou undefined (anti-spam)
 * - `company`: opcional, sem validação
 *
 * @param data - Dados do formulário a serem validados.
 * @returns `ValidationResult` com `isValid` e mapa de erros por campo.
 *
 * Requisitos: 6.2, 6.3, 6.8, 6.9, 10.6
 */
export function validateForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Honeypot — campo oculto anti-spam; deve estar vazio
  if (data.honeypot !== undefined && data.honeypot !== '') {
    // Retorna silenciosamente como inválido sem revelar o motivo ao usuário
    return { isValid: false, errors: {} };
  }

  // Nome
  if (!data.name || data.name.trim() === '') {
    errors.name = 'O nome é obrigatório.';
  }

  // E-mail
  if (!data.email || data.email.trim() === '') {
    errors.email = 'O e-mail é obrigatório.';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  // Telefone
  if (!data.phone || data.phone.trim() === '') {
    errors.phone = 'O telefone é obrigatório.';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Informe um telefone válido com DDD (ex.: (11) 99999-9999).';
  }

  // Mensagem
  if (!data.message || data.message.trim() === '') {
    errors.message = 'A mensagem é obrigatória.';
  }

  // Consentimento LGPD
  if (!data.lgpdConsent) {
    errors.lgpdConsent =
      'É necessário concordar com o uso dos dados conforme a LGPD para enviar o formulário.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ─── Serialização / Desserialização ──────────────────────────────────────────

/**
 * Serializa os dados do formulário em uma string JSON.
 *
 * @param data - Dados do formulário.
 * @returns String JSON representando os dados.
 *
 * Requisito 14.1
 */
export function serializeForm(data: ContactFormData): string {
  return JSON.stringify(data);
}

/**
 * Desserializa uma string JSON e retorna os dados do formulário.
 *
 * Lança um erro se:
 * - A string não for JSON válido.
 * - Os campos obrigatórios estiverem ausentes no objeto desserializado.
 *
 * @param json - String JSON a ser desserializada.
 * @returns `ContactFormData` com os dados extraídos.
 * @throws `Error` se o JSON for inválido ou os campos obrigatórios estiverem ausentes.
 *
 * Requisito 14.2
 */
export function deserializeForm(json: string): ContactFormData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Payload JSON inválido.');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('O payload deve ser um objeto JSON.');
  }

  const obj = parsed as Record<string, unknown>;

  // Validação dos campos obrigatórios
  const requiredFields: Array<keyof ContactFormData> = [
    'name',
    'email',
    'phone',
    'message',
    'lgpdConsent',
  ];

  for (const field of requiredFields) {
    if (!(field in obj)) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  // Verificação de tipos básicos
  if (typeof obj.name !== 'string') throw new Error('Campo "name" deve ser string.');
  if (typeof obj.email !== 'string') throw new Error('Campo "email" deve ser string.');
  if (typeof obj.phone !== 'string') throw new Error('Campo "phone" deve ser string.');
  if (typeof obj.message !== 'string') throw new Error('Campo "message" deve ser string.');
  if (typeof obj.lgpdConsent !== 'boolean')
    throw new Error('Campo "lgpdConsent" deve ser boolean.');

  const result: ContactFormData = {
    name: obj.name,
    email: obj.email,
    phone: obj.phone,
    message: obj.message,
    lgpdConsent: obj.lgpdConsent,
  };

  // Campos opcionais
  if ('company' in obj && obj.company !== undefined) {
    if (typeof obj.company !== 'string') throw new Error('Campo "company" deve ser string.');
    result.company = obj.company;
  }

  if ('honeypot' in obj && obj.honeypot !== undefined) {
    if (typeof obj.honeypot !== 'string') throw new Error('Campo "honeypot" deve ser string.');
    result.honeypot = obj.honeypot;
  }

  return result;
}
