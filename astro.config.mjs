import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://danubiacarvalho.com.br',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  // Astro 5: output "static" suporta API Routes nativamente (Requisito 12.4)
  output: 'static',

  /**
   * Headers HTTP de segurança (Requisitos 10.2, 10.3, 10.4, 10.5)
   *
   * Aplicados a todas as rotas via configuração do Astro.
   * Em Vercel/Netlify, estes headers são injetados automaticamente
   * a partir desta configuração.
   */
  headers: [
    {
      source: '/(.*)',
      headers: [
        // Requisito 10.2 — HSTS com max-age mínimo de 31536000 segundos
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        // Requisito 10.3 — CSP restritivo
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            // Permite scripts inline necessários para JSON-LD e Astro hydration
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
            // Estilos: self + Google Fonts
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            // Fontes: self + Google Fonts
            "font-src 'self' https://fonts.gstatic.com",
            // Imagens: self + data URIs
            "img-src 'self' data: https:",
            // Conexões: self + analytics + Resend
            "connect-src 'self' https://www.google-analytics.com https://api.resend.com",
            // Frames: nenhum (reforça X-Frame-Options)
            "frame-src 'none'",
            // Objetos: nenhum
            "object-src 'none'",
            // Base URI: apenas self
            "base-uri 'self'",
            // Form action: apenas self
            "form-action 'self'",
          ].join('; '),
        },
        // Requisito 10.4 — Prevenir clickjacking
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        // Requisito 10.5 — Prevenir MIME sniffing
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        // Política de referrer
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        // Política de permissões — desabilitar APIs sensíveis
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ],
});
