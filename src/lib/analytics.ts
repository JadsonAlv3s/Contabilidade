/**
 * analytics.ts — Módulo de analytics com consentimento do usuário.
 *
 * Suporta Google Analytics 4 (GA4) e Plausible Analytics.
 * Nenhum script é carregado sem consentimento explícito do usuário.
 *
 * Requisitos: 10.10, 10.11, 11.1, 11.2, 11.3, 11.4
 */

/** Chave usada no localStorage para persistir consentimento */
const CONSENT_KEY = 'danubia_analytics_consent';

/** Flag interna para saber se o script de analytics já foi carregado */
let analyticsLoaded = false;

/**
 * Verifica se o usuário já concedeu consentimento para analytics.
 * Retorna false se o consentimento ainda não foi dado ou foi recusado.
 */
export function isConsentGiven(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Persiste a decisão de consentimento do usuário no localStorage.
 * @param value true = aceito, false = recusado
 */
export function setConsent(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_KEY, String(value));
  } catch {
    // localStorage pode estar indisponível (modo privado restrito, etc.)
  }
}

/**
 * Carrega o script de analytics de forma assíncrona, apenas se:
 * 1. O consentimento foi dado
 * 2. O script ainda não foi carregado
 *
 * Suporta GA4 (PUBLIC_GA4_ID) e Plausible (PUBLIC_PLAUSIBLE_DOMAIN).
 * Os scripts são inseridos com async/defer para não bloquear a renderização.
 */
export function loadAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (!isConsentGiven()) return;
  if (analyticsLoaded) return;

  const ga4Id = (import.meta.env as Record<string, string>).PUBLIC_GA4_ID;
  const plausibleDomain = (import.meta.env as Record<string, string>).PUBLIC_PLAUSIBLE_DOMAIN;

  if (ga4Id) {
    // Carrega Google Analytics 4
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    script.async = true;
    document.head.appendChild(script);

    // Inicializa gtag
    (window as Record<string, unknown>).dataLayer =
      (window as Record<string, unknown>).dataLayer || [];
    function gtag(...args: unknown[]) {
      ((window as Record<string, unknown>).dataLayer as unknown[]).push(args);
    }
    (window as Record<string, unknown>).gtag = gtag;
    gtag('js', new Date());
    gtag('config', ga4Id);

    analyticsLoaded = true;
  } else if (plausibleDomain) {
    // Carrega Plausible Analytics
    const script = document.createElement('script');
    script.src = 'https://plausible.io/js/script.js';
    script.defer = true;
    script.setAttribute('data-domain', plausibleDomain);
    document.head.appendChild(script);

    analyticsLoaded = true;
  }

  // Expõe trackEvent globalmente após carregar o script
  exposeTrackEvent();
}

/**
 * Dispara um evento de analytics para o provedor ativo.
 * - GA4: window.gtag('event', name, params)
 * - Plausible: window.plausible(name, { props: params })
 *
 * Não faz nada se nenhum script de analytics estiver carregado.
 *
 * @param name Nome do evento (ex.: 'whatsapp_click', 'form_submit')
 * @param params Parâmetros adicionais do evento (opcional)
 */
export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  const win = window as Record<string, unknown>;

  if (typeof win.gtag === 'function') {
    // GA4
    (win.gtag as (...args: unknown[]) => void)('event', name, params ?? {});
  } else if (typeof win.plausible === 'function') {
    // Plausible
    (win.plausible as (name: string, opts?: unknown) => void)(name, {
      props: params,
    });
  }
}

/**
 * Expõe trackEvent globalmente em window.trackEvent para uso em
 * atributos onclick inline (ex.: Hero.astro).
 */
function exposeTrackEvent(): void {
  if (typeof window === 'undefined') return;
  (window as Record<string, unknown>).trackEvent = trackEvent;
}

// Expõe imediatamente para que onclick inline funcione mesmo antes
// de loadAnalytics() ser chamado (o evento será silenciosamente ignorado
// se nenhum provedor estiver carregado).
if (typeof window !== 'undefined') {
  exposeTrackEvent();
}
