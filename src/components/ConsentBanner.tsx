/**
 * ConsentBanner.tsx — Ilha React para banner de consentimento de cookies.
 *
 * Exibido na primeira visita do usuário. Persiste a decisão no localStorage.
 * Carrega o script de analytics apenas se o usuário aceitar.
 *
 * Requisitos: 10.10, 10.11, 11.1
 */

import { useState, useEffect, useRef } from 'react';
import { isConsentGiven, setConsent, loadAnalytics } from '../lib/analytics';

export default function ConsentBanner() {
  // null = ainda verificando; true = mostrar; false = ocultar
  const [visible, setVisible] = useState<boolean>(false);
  const acceptBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Verificar localStorage na montagem
    // Se consentimento já foi dado ou recusado, não exibir o banner
    try {
      const stored = localStorage.getItem('danubia_analytics_consent');
      if (stored === null) {
        // Primeira visita — exibir banner
        setVisible(true);
      }
      // Se já foi aceito anteriormente, carregar analytics silenciosamente
      if (stored === 'true') {
        loadAnalytics();
      }
    } catch {
      // localStorage indisponível — não exibir banner
    }
  }, []);

  // Gerenciar foco: quando o banner aparecer, focar no botão "Aceitar"
  useEffect(() => {
    if (visible && acceptBtnRef.current) {
      acceptBtnRef.current.focus();
    }
  }, [visible]);

  function handleAccept() {
    setConsent(true);
    loadAnalytics();
    setVisible(false);
  }

  function handleDecline() {
    setConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-modal="false"
      aria-describedby="consent-banner-description"
      className="fixed bottom-0 left-0 right-0 z-50 bg-brand-navy text-white shadow-2xl"
    >
      <div className="container-site max-w-site mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          {/* Texto informativo */}
          <p
            id="consent-banner-description"
            className="flex-1 text-sm md:text-base text-gray-200 leading-relaxed"
          >
            Utilizamos cookies para melhorar sua experiência e analisar o
            tráfego do site. Ao aceitar, você concorda com nossa{' '}
            <a
              href="/politica-de-privacidade"
              className="underline text-white hover:text-gray-300 transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1"
            >
              Política de Privacidade
            </a>
            .
          </p>

          {/* Botões de ação */}
          <div className="flex flex-row gap-3 shrink-0">
            {/* Botão Recusar */}
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 md:flex-none px-5 py-2.5 min-h-[44px] rounded-md border border-white/40 text-white text-sm font-medium hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              Recusar
            </button>

            {/* Botão Aceitar */}
            <button
              ref={acceptBtnRef}
              type="button"
              onClick={handleAccept}
              className="flex-1 md:flex-none px-5 py-2.5 min-h-[44px] rounded-md bg-white text-brand-navy text-sm font-semibold hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-brand-navy focus-visible:outline-offset-2"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
