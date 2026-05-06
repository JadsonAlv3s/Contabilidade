/**
 * ContactForm — Ilha React para o formulário de contato.
 *
 * Campos: Nome, E-mail, Telefone, Empresa (opcional), Mensagem, LGPD, Honeypot.
 * Validação client-side via formValidator.ts.
 * Envio via fetch POST /api/contact com body JSON.
 *
 * Requisitos: 6.1–6.9, 9.2, 9.4, 9.5, 9.6, 10.6, 14.1
 */

import { useState } from 'react';
import { validateForm, serializeForm } from '../lib/formValidator';
import type { ContactFormData, ValidationResult } from '../lib/formValidator';
import { siteConfig } from '../config/site';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  lgpdConsent: boolean;
  website: string; // honeypot
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  lgpdConsent: false,
  website: '',
};

// ─── Componente ──────────────────────────────────────────────────────────────

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>('');

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ?? false) : value,
    }));

    // Limpar erro do campo ao editar
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Montar objeto de dados para validação
    const data: ContactFormData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company || undefined,
      message: formData.message,
      lgpdConsent: formData.lgpdConsent,
      honeypot: formData.website,
    };

    // Validação client-side
    const result: ValidationResult = validateForm(data);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setStatus('submitting');
    setErrors({});
    setServerError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: serializeForm(data),
      });

      if (response.ok) {
        setStatus('success');
        setFormData(INITIAL_STATE);
        // Disparar evento de conversão para analytics (Requisito 11.2)
        if (typeof window !== 'undefined' && (window as any).trackEvent) {
          (window as any).trackEvent('form_submit');
        }
      } else {
        const body = await response.json().catch(() => ({}));
        setServerError(
          (body as { error?: string }).error ||
            'Ocorreu um erro ao enviar a mensagem.'
        );
        setStatus('error');
      }
    } catch {
      setServerError('Não foi possível conectar ao servidor. Tente novamente.');
      setStatus('error');
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section id="contato" className="bg-white py-16 px-4" aria-labelledby="contact-heading">
      <div className="container-site max-w-2xl mx-auto">
        {/* Título da seção */}
        <h2 id="contact-heading" className="text-h2 font-bold text-brand-navy mb-2 text-center">
          Entre em Contato
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Preencha o formulário abaixo e entraremos em contato em breve.
        </p>

        {/* Mensagem de sucesso */}
        {status === 'success' && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-lg bg-green-50 border border-green-300 p-4 text-green-800 text-center"
          >
            Mensagem enviada com sucesso! Entraremos em contato em breve.
          </div>
        )}

        {/* Mensagem de erro global */}
        {status === 'error' && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 rounded-lg bg-red-50 border border-red-300 p-4 text-red-800"
          >
            <p className="font-semibold mb-1">Erro ao enviar mensagem</p>
            <p className="mb-2">{serverError}</p>
            <p>
              Você também pode nos contatar diretamente pelo{' '}
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-red-900"
              >
                WhatsApp
              </a>
              .
            </p>
          </div>
        )}

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulário de contato"
        >
          {/* Container de erros para aria-live */}
          <div aria-live="polite" aria-atomic="false" className="sr-only">
            {Object.keys(errors).length > 0 &&
              'Existem erros no formulário. Verifique os campos destacados.'}
          </div>

          {/* Honeypot — campo oculto anti-spam */}
          <div
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 'auto',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
            aria-hidden="true"
          >
            <label htmlFor="website">Não preencha este campo</label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Nome completo */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome completo{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`w-full rounded-md border px-4 py-3 text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:border-brand-navy transition min-h-[44px] ${
                errors.name
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full rounded-md border px-4 py-3 text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:border-brand-navy transition min-h-[44px] ${
                errors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="seu@email.com.br"
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Telefone / WhatsApp */}
          <div className="mb-5">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefone / WhatsApp{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`w-full rounded-md border px-4 py-3 text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:border-brand-navy transition min-h-[44px] ${
                errors.phone
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p
                id="phone-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Empresa (opcional) */}
          <div className="mb-5">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Empresa{' '}
              <span className="text-gray-500 text-xs font-normal">
                (opcional)
              </span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              autoComplete="organization"
              aria-invalid={!!errors.company}
              aria-describedby={errors.company ? 'company-error' : undefined}
              className={`w-full rounded-md border px-4 py-3 text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:border-brand-navy transition min-h-[44px] ${
                errors.company
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="Nome da sua empresa"
            />
            {errors.company && (
              <p
                id="company-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.company}
              </p>
            )}
          </div>

          {/* Mensagem */}
          <div className="mb-5">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mensagem{' '}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`w-full rounded-md border px-4 py-3 text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:border-brand-navy transition resize-y min-h-[120px] ${
                errors.message
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white'
              }`}
              placeholder="Descreva como podemos ajudar você..."
            />
            {errors.message && (
              <p
                id="message-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.message}
              </p>
            )}
          </div>

          {/* Checkbox LGPD */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <input
                id="lgpdConsent"
                name="lgpdConsent"
                type="checkbox"
                checked={formData.lgpdConsent}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.lgpdConsent}
                aria-describedby={
                  errors.lgpdConsent ? 'lgpd-error' : undefined
                }
                className="mt-1 h-5 w-5 min-h-[20px] min-w-[20px] rounded border-gray-300 text-brand-navy focus-visible:ring-brand-navy cursor-pointer"
              />
              <label
                htmlFor="lgpdConsent"
                className="text-sm text-gray-700 cursor-pointer leading-relaxed"
              >
                Concordo com o uso dos meus dados para fins de contato,
                conforme a LGPD
              </label>
            </div>
            {errors.lgpdConsent && (
              <p
                id="lgpd-error"
                role="alert"
                className="mt-1 text-sm text-red-600"
              >
                {errors.lgpdConsent}
              </p>
            )}
          </div>

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            aria-disabled={status === 'submitting'}
            className="w-full bg-brand-navy text-white font-semibold rounded-md px-6 py-3 min-h-[44px] hover:bg-opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                status === 'submitting' ? '#1A2A5E' : undefined,
            }}
          >
            {status === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar Mensagem'
            )}
          </button>

          {/* Link WhatsApp alternativo */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Prefere contato direto?{' '}
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-navy font-semibold underline hover:text-brand-green transition"
            >
              Fale pelo WhatsApp
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
