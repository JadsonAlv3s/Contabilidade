# Documento de Design

## Danúbia Carvalho — Consultoria Contábil Estratégica

---

## Visão Geral

Este documento descreve a arquitetura técnica e o design de implementação da landing page profissional de Danúbia Carvalho. A solução utiliza **Astro** (SSG) como framework principal, **Tailwind CSS** para estilização, **React/Preact** para ilhas de interatividade e **Resend** como serviço de envio de e-mail.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Astro (SSG) |
| Estilização | Tailwind CSS v3+ com tema customizado |
| Interatividade | React (Astro Islands) |
| Envio de e-mail | Resend (API Route Astro) |
| Hospedagem | Vercel / Netlify / Cloudflare Pages |
| Linguagem | TypeScript |

---

## Estrutura de Diretórios

```
/
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── images/
│       ├── logo-dg.svg
│       ├── danubia-foto.webp
│       └── og-image.jpg          # 1200×630px
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── Benefits.astro
│   │   ├── About.astro
│   │   ├── Testimonials.astro
│   │   ├── ContactForm.tsx        # Ilha React
│   │   ├── ConsentBanner.tsx      # Ilha React
│   │   ├── Footer.astro
│   │   ├── StarRating.astro
│   │   └── SocialLinks.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── api/
│   │       └── contact.ts         # API Route (Mailer)
│   ├── lib/
│   │   ├── formValidator.ts       # Formulário_Validator
│   │   ├── mailer.ts              # Mailer helper
│   │   ├── socialLinks.ts         # Social_Link config
│   │   └── analytics.ts           # Analytics helper
│   ├── config/
│   │   └── site.ts                # Configurações centralizadas
│   └── styles/
│       └── global.css
├── tailwind.config.ts
├── astro.config.mjs
└── .env.example
```

---

## Tokens de Design

### Paleta de Cores

```typescript
// tailwind.config.ts
colors: {
  brand: {
    navy:  '#1A2A5E',   // Azul marinho primário
    green: '#2D5A3D',   // Verde escuro secundário
    gray:  '#F5F5F5',   // Cinza claro de fundo
    white: '#FFFFFF',   // Branco
  }
}
```

### Tipografia

- **H1**: 3rem / 700 / navy
- **H2**: 2rem / 700 / navy
- **H3**: 1.25rem / 600 / navy
- **Body**: 1rem / 400 / #374151
- **Small**: 0.875rem / 400 / #6B7280
- Fonte: Inter (Google Fonts, `font-display: swap`)

### Espaçamento e Breakpoints

- Mobile: < 768px (coluna única)
- Tablet: 768px–1024px
- Desktop: > 1024px (até 1440px)
- Elemento interativo mínimo: 44×44px

---

## Componentes e Responsabilidades

### `BaseLayout.astro`

Responsável por:
- `<html lang="pt-BR">`
- `<head>` com `<title>`, meta description, Open Graph, Twitter Card, canonical
- JSON-LD (Schema_Person + Schema_LocalBusiness)
- Carregamento de fontes com `font-display: swap`
- Headers HTTP de segurança (via `astro.config.mjs` ou middleware)
- `ConsentBanner` como ilha React

### `Header.astro`

- Logo "DG" com asas (SVG, `alt` descritivo)
- Links de navegação âncora para seções
- `SocialLinks.astro` (Instagram, LinkedIn)
- Responsivo: menu hambúrguer em mobile

### `Hero.astro`

- H1: "Danúbia Carvalho"
- Subtítulo: "Consultoria Contábil Estratégica"
- Proposta de valor
- Indicadores de credibilidade (10+ anos, regimes tributários)
- CTA primário "Fale Comigo" → âncora `#contato` com `scroll-behavior: smooth`
- CTA secundário WhatsApp

### `Services.astro`

- H2: "Serviços"
- 6 cards com ícone SVG, título e descrição
- Grid: 1 coluna (mobile) → 2–3 colunas (desktop)

### `Benefits.astro`

- H2: "Por que terceirizar o departamento contábil?"
- 5 itens com ícone e descrição

### `About.astro`

- Foto profissional (WebP + fallback JPEG, `loading="lazy"`, `alt` descritivo)
- Lista de credenciais
- Regimes tributários
- CTA "Vamos transformar a contabilidade do seu negócio!"

### `Testimonials.astro`

- H2: "Depoimentos"
- 3+ depoimentos com: nome, empresa, texto, avaliação (1–5 estrelas)
- `StarRating.astro` com `aria-label="Avaliação: {r} de 5 estrelas"`
- Avatar por iniciais quando foto ausente
- Truncamento de texto > 200 chars com "Ler mais"
- Mobile: carrossel / lista vertical
- Desktop: grade 2–3 colunas
- JSON-LD Schema.org/Review + AggregateRating
- Placeholders substituíveis sem alteração de código

### `ContactForm.tsx` (Ilha React)

- Campos: Nome, E-mail, Telefone, Empresa (opcional), Mensagem
- Checkbox LGPD
- Honeypot field (anti-spam)
- Validação client-side via `formValidator.ts`
- Serialização JSON antes do envio
- Mensagem de sucesso / erro inline
- `aria-live="polite"` para erros
- Labels associados via `for`/`id`

### `ConsentBanner.tsx` (Ilha React)

- Exibido na primeira visita (localStorage)
- Aceitar → carrega Analytics_Script
- Recusar → não carrega nenhum script de rastreamento
- Dispara evento de conversão ao aceitar

### `Footer.astro`

- Links de navegação
- `SocialLinks.astro`
- Link para Política de Privacidade
- Número CRC (quando disponível)
- Botões de compartilhamento (WhatsApp, LinkedIn)

### `SocialLinks.astro`

- Lê URLs de `socialLinks.ts` (configuração centralizada)
- Omite links com URL inválida/ausente
- `target="_blank" rel="noopener noreferrer"`
- Ícones SVG com `aria-label`

---

## Módulo `formValidator.ts`

```typescript
export interface FormData {
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

export function validateForm(data: FormData): ValidationResult
export function validateEmail(email: string): boolean   // RFC 5322
export function validatePhone(phone: string): boolean   // DDD brasileiro
export function serializeForm(data: FormData): string   // JSON.stringify
export function deserializeForm(json: string): FormData // JSON.parse + validação
```

**Regras de validação:**
- `name`: obrigatório, não vazio
- `email`: obrigatório, RFC 5322
- `phone`: obrigatório, formato brasileiro com DDD
- `message`: obrigatório, não vazio
- `lgpdConsent`: deve ser `true`
- `honeypot`: deve ser vazio (anti-spam)

---

## API Route `pages/api/contact.ts` (Mailer)

```
POST /api/contact
Content-Type: application/json

Body: FormData (JSON)

Responses:
  200 OK       → { success: true }
  400 Bad Request → { error: "Descrição do erro" }  (sem stack trace)
  500 Internal Server Error → { error: "Erro interno. Tente novamente." }
```

**Fluxo:**
1. Parse do body JSON (se malformado → 400)
2. Validação server-side via `validateForm`
3. Verificação do honeypot
4. Envio via Resend (ou Nodemailer SMTP)
5. Retorno 200 com `{ success: true }`

---

## Configuração Centralizada `config/site.ts`

```typescript
export const siteConfig = {
  name: "Danúbia Carvalho",
  title: "Danúbia Carvalho | Consultoria Contábil Estratégica",
  description: "Consultoria, Assessoria e Treinamento Contábil para otimizar o seu departamento contábil. Mais de 10 anos de experiência.",
  url: "https://danubiacarvalho.com.br",
  ogImage: "/images/og-image.jpg",
  social: {
    instagram: "https://instagram.com/danubiacarvalho",
    linkedin: "https://linkedin.com/in/danubiacarvalho",
    whatsapp: "https://wa.me/5511999999999",
  },
  email: process.env.CONTACT_EMAIL,
  crc: "CRC-SP 123456/O-1",  // substituir pelo número real
}
```

---

## SEO e Metadados

### `<title>`
`Danúbia Carvalho | Consultoria Contábil Estratégica` (≤ 60 chars)

### Meta Description
`Consultoria, Assessoria e Treinamento Contábil para otimizar o seu departamento contábil. Mais de 10 anos de experiência.` (120–160 chars)

### JSON-LD Schema_Person
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Danúbia Carvalho",
  "jobTitle": "Consultora Contábil",
  "url": "https://danubiacarvalho.com.br",
  "sameAs": ["<instagram>", "<linkedin>"]
}
```

### JSON-LD Schema_LocalBusiness
```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "Danúbia Carvalho Consultoria Contábil",
  "description": "...",
  "url": "https://danubiacarvalho.com.br",
  "telephone": "...",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "3" }
}
```

---

## Performance

- SSG: HTML gerado em build time
- Imagens: WebP + fallback JPEG/PNG, `loading="lazy"` abaixo da dobra
- Fontes: `font-display: swap`
- Assets: minificados e comprimidos (Astro built-in)
- Cache: `Cache-Control: public, max-age=31536000, immutable` para assets com hash
- `<link rel="preload">` para imagem hero e fonte principal

---

## Segurança

Headers HTTP (via `astro.config.mjs` ou middleware Vercel/Netlify):

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

---

## Analytics

- GA4 ou Plausible carregado condicionalmente após consentimento
- Eventos rastreados:
  - `form_submit` → envio bem-sucedido do formulário
  - `whatsapp_click` → clique no CTA WhatsApp
  - `share_click` → clique em botão de compartilhamento
- Scripts carregados de forma assíncrona (`async` / `defer`)

---

## Propriedades de Corretude

As propriedades abaixo derivam dos requisitos e guiam os testes baseados em propriedades (PBT).

### P1 — Round-Trip de Serialização do Formulário
**Propriedade:** Para qualquer `FormData` válido `F`, `deserializeForm(serializeForm(F))` deve ser estruturalmente equivalente a `F`.
**Tipo:** Round-Trip
**Módulo:** `formValidator.ts`

### P2 — Idempotência da Validação
**Propriedade:** Para qualquer entrada `I`, `validateForm(I)` chamado uma ou múltiplas vezes deve produzir o mesmo `ValidationResult`.
**Tipo:** Idempotência
**Módulo:** `formValidator.ts`

### P3 — Invariante de Campos Obrigatórios
**Propriedade:** Se qualquer campo obrigatório estiver vazio ou inválido, `validateForm(I).isValid === false`. Se todos os campos obrigatórios forem válidos, `validateForm(I).isValid === true`.
**Tipo:** Invariante
**Módulo:** `formValidator.ts`

### P4 — Propriedade Metamórfica de Validação de E-mail
**Propriedade:** Para qualquer e-mail válido `e`, `validateEmail(mutate(e)) === false` onde `mutate` insere caracteres inválidos.
**Tipo:** Metamórfica
**Módulo:** `formValidator.ts`

### P5 — Invariante de Consentimento LGPD
**Propriedade:** Para qualquer `FormData` com `lgpdConsent === false`, `validateForm(I).isValid === false`.
**Tipo:** Invariante
**Módulo:** `formValidator.ts`

### P6 — Invariante de Tokens de Design
**Propriedade:** Todos os valores de cor aplicados nos componentes devem pertencer ao conjunto de tokens definidos no tema Tailwind.
**Tipo:** Invariante
**Módulo:** `tailwind.config.ts` / componentes

### P7 — Condição de Erro para Payloads Malformados
**Propriedade:** Para qualquer string não-JSON enviada ao endpoint `/api/contact`, a resposta deve ter status 400 sem expor detalhes internos.
**Tipo:** Condição de Erro
**Módulo:** `pages/api/contact.ts`

### P8 — Invariante de Avaliação de Depoimentos
**Propriedade:** Para qualquer depoimento renderizado, `1 ≤ rating ≤ 5`.
**Tipo:** Invariante
**Módulo:** `Testimonials.astro`

### P9 — Invariante de Acessibilidade das Estrelas
**Propriedade:** Para qualquer `r ∈ [1,5]`, o `aria-label` gerado deve ser `"Avaliação: {r} de 5 estrelas"`.
**Tipo:** Invariante
**Módulo:** `StarRating.astro`

### P10 — Round-Trip de Codificação de URLs de Compartilhamento
**Propriedade:** Para qualquer URL `U` e texto `T`, `decodeURIComponent(encodeURIComponent(U)) === U` e `decodeURIComponent(encodeURIComponent(T)) === T`.
**Tipo:** Round-Trip
**Módulo:** `Footer.astro` / botões de compartilhamento

### P11 — Condição de Erro para URLs de Perfil Social Malformadas
**Propriedade:** Para qualquer URL de perfil social inválida/ausente, nenhum elemento `<a>` deve ser renderizado com aquele `href`. O número de links renderizados deve igualar o número de URLs válidas configuradas.
**Tipo:** Condição de Erro / Invariante
**Módulo:** `SocialLinks.astro` / `socialLinks.ts`
