# Plano de Implementação: Danúbia Carvalho — Consultoria Contábil Estratégica

## Visão Geral

Implementação incremental da landing page usando Astro (SSG) + Tailwind CSS + React (Astro Islands) + Resend. Cada tarefa constrói sobre a anterior, garantindo que nenhum código fique órfão ou desconectado.

## Tarefas

- [x] 1. Configurar projeto Astro e sistema de design
  - Inicializar projeto Astro com suporte a TypeScript e integração React
  - Instalar e configurar Tailwind CSS com tema customizado (tokens de cor `brand.navy`, `brand.green`, `brand.gray`, `brand.white`, tipografia Inter)
  - Criar `tailwind.config.ts` com a paleta completa e breakpoints definidos no design
  - Criar `src/config/site.ts` com todas as configurações centralizadas (nome, título, descrição, URL, OG image, social links, CRC)
  - Criar `src/lib/socialLinks.ts` com função de validação de URL e exportação dos links configurados
  - Criar `.env.example` com todas as variáveis de ambiente necessárias (`CONTACT_EMAIL`, `RESEND_API_KEY`, etc.)
  - Criar `src/styles/global.css` com reset, `font-display: swap` e `scroll-behavior: smooth`
  - _Requisitos: 1.2, 1.3, 1.6, 12.1, 12.2, 12.6, 13.1_

- [x] 2. Implementar módulo de validação do formulário
  - [x] 2.1 Criar `src/lib/formValidator.ts` com interfaces `FormData` e `ValidationResult`
    - Implementar `validateEmail(email)` conforme RFC 5322
    - Implementar `validatePhone(phone)` para formatos brasileiros com DDD
    - Implementar `validateForm(data)` verificando todos os campos obrigatórios e o consentimento LGPD
    - Implementar `serializeForm(data)` e `deserializeForm(json)` para round-trip JSON
    - _Requisitos: 6.2, 6.3, 6.4, 6.5, 6.8, 6.9, 14.1, 14.2, 14.3, 14.4_

  - [ ]* 2.2 Escrever property test para round-trip de serialização
    - **Propriedade P1: Round-Trip de Serialização do Formulário**
    - **Valida: Requisito 14.4**
    - Para qualquer `FormData` válido `F`, `deserializeForm(serializeForm(F))` deve ser estruturalmente equivalente a `F`

  - [ ]* 2.3 Escrever property test para idempotência da validação
    - **Propriedade P2: Idempotência da Validação**
    - **Valida: Requisito 6.3**
    - `validateForm(I)` chamado múltiplas vezes deve produzir o mesmo `ValidationResult`

  - [ ]* 2.4 Escrever property test para invariante de campos obrigatórios
    - **Propriedade P3: Invariante de Campos Obrigatórios**
    - **Valida: Requisitos 6.2, 6.3**
    - Qualquer submissão com campo obrigatório vazio/inválido deve resultar em `isValid === false`; todos válidos → `isValid === true`

  - [ ]* 2.5 Escrever property test metamórfico para validação de e-mail
    - **Propriedade P4: Propriedade Metamórfica de Validação de E-mail**
    - **Valida: Requisito 6.4**
    - Para qualquer e-mail válido `e`, inserir caracteres inválidos deve sempre resultar em `validateEmail(mutate(e)) === false`

  - [ ]* 2.6 Escrever property test para invariante de consentimento LGPD
    - **Propriedade P5: Invariante de Consentimento LGPD**
    - **Valida: Requisitos 6.8, 6.9**
    - Para qualquer `FormData` com `lgpdConsent === false`, `validateForm(I).isValid` deve ser `false`

- [ ] 3. Checkpoint — Validar módulo de formulário
  - Garantir que todos os testes do módulo `formValidator.ts` passam. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 4. Implementar layout base e metadados SEO
  - [x] 4.1 Criar `src/layouts/BaseLayout.astro`
    - Gerar `<html lang="pt-BR">` e estrutura semântica completa
    - Implementar `<title>` (≤ 60 chars), meta description (120–160 chars), `<link rel="canonical">`
    - Implementar meta tags Open Graph (`og:title`, `og:description`, `og:image` 1200×630px, `og:url`, `og:type`)
    - Implementar meta tags Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
    - Gerar JSON-LD `Schema_Person` com `sameAs` apontando para perfis sociais
    - Gerar JSON-LD `Schema_LocalBusiness` (subtipo `AccountingService`) com `aggregateRating`
    - Incluir `<link rel="preload">` para fonte Inter e imagem hero
    - Configurar headers HTTP de segurança (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) via `astro.config.mjs`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.9, 7.10, 7.11, 8.7, 8.8, 9.3, 10.1, 10.2, 10.3, 10.4, 10.5, 16.7, 16.9_

  - [ ]* 4.2 Escrever testes unitários para geração de metadados
    - Verificar que `<title>` tem ≤ 60 caracteres
    - Verificar que meta description tem entre 120 e 160 caracteres
    - Verificar presença de todas as meta tags OG e Twitter Card
    - Verificar que `lang="pt-BR"` está presente no elemento `<html>`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.10_

- [x] 5. Implementar componentes estáticos da página
  - [x] 5.1 Criar `src/components/SocialLinks.astro`
    - Ler URLs de `socialLinks.ts`; omitir links com URL inválida/ausente
    - Renderizar ícones SVG com `aria-label`, `target="_blank"`, `rel="noopener noreferrer"`
    - _Requisitos: 16.1, 16.2, 16.3, 16.8_

  - [ ]* 5.2 Escrever property test para URLs de perfil social malformadas
    - **Propriedade P11: Condição de Erro para URLs de Perfil Social Malformadas**
    - **Valida: Requisito 16.8**
    - Para qualquer URL inválida/ausente, nenhum `<a>` deve ser renderizado; número de links = número de URLs válidas

  - [x] 5.3 Criar `src/components/Header.astro`
    - Logo "DG" com asas (SVG, `alt` descritivo), links de navegação âncora, `SocialLinks.astro`
    - Menu hambúrguer responsivo em mobile (44×44px mínimo)
    - _Requisitos: 1.1, 1.4, 1.5, 9.2, 9.3, 16.1_

  - [x] 5.4 Criar `src/components/Hero.astro`
    - H1 "Danúbia Carvalho", subtítulo "Consultoria Contábil Estratégica", proposta de valor
    - Indicadores de credibilidade (10+ anos, regimes tributários)
    - CTA primário "Fale Comigo" com âncora `#contato` e `scroll-behavior: smooth`
    - CTA secundário WhatsApp com `target="_blank"` e evento de analytics
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 7.7, 9.3_

  - [x] 5.5 Criar `src/components/Services.astro`
    - H2 "Serviços", 6 cards com ícone SVG, título e descrição
    - Grid responsivo: 1 coluna (mobile) → 2–3 colunas (desktop)
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 9.3, 9.8_

  - [x] 5.6 Criar `src/components/Benefits.astro`
    - H2 "Por que terceirizar o departamento contábil?", 5 itens com ícone e descrição
    - _Requisitos: 4.1, 4.2, 4.3, 9.3_

  - [x] 5.7 Criar `src/components/About.astro`
    - Foto profissional (WebP + fallback JPEG, `loading="lazy"`, `alt` descritivo)
    - Lista de credenciais acadêmicas e profissionais
    - Regimes tributários e sistemas contábeis como diferencial
    - CTA "Vamos transformar a contabilidade do seu negócio!" com âncora `#contato`
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5, 8.5, 9.8_

- [x] 6. Implementar seção de depoimentos
  - [x] 6.1 Criar `src/components/StarRating.astro`
    - Renderizar ícones de estrela com `aria-label="Avaliação: {r} de 5 estrelas"`
    - Aceitar `rating` como prop e validar `1 ≤ rating ≤ 5`
    - _Requisitos: 15.2, 15.3_

  - [ ]* 6.2 Escrever property test para invariante de avaliação de depoimentos
    - **Propriedade P8: Invariante de Avaliação de Depoimentos**
    - **Valida: Requisito 15.2**
    - Para qualquer depoimento renderizado, `1 ≤ rating ≤ 5`

  - [ ]* 6.3 Escrever property test para acessibilidade das estrelas
    - **Propriedade P9: Invariante de Acessibilidade das Estrelas**
    - **Valida: Requisito 15.3**
    - Para qualquer `r ∈ [1,5]`, o `aria-label` deve ser `"Avaliação: {r} de 5 estrelas"`

  - [x] 6.4 Criar `src/components/Testimonials.astro`
    - H2 "Depoimentos", 3+ depoimentos com nome, empresa, texto, avaliação e avatar
    - Avatar por iniciais quando foto ausente
    - Truncamento de texto > 200 chars com controle "Ler mais" (sem reload)
    - Mobile: carrossel/lista vertical; Desktop: grade 2–3 colunas
    - JSON-LD `Schema.org/Review` e `Schema.org/AggregateRating`
    - Placeholders estruturados substituíveis sem alteração de código
    - _Requisitos: 15.1, 15.2, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 10.8_

  - [ ]* 6.5 Escrever testes unitários para truncamento e "Ler mais"
    - Verificar que texto > 200 chars é truncado com reticências
    - Verificar que controle "Ler mais" expande o conteúdo completo
    - _Requisito: 15.7_

- [x] 7. Implementar formulário de contato (ilha React)
  - [x] 7.1 Criar `src/components/ContactForm.tsx`
    - Campos: Nome, E-mail, Telefone, Empresa (opcional), Mensagem
    - Checkbox LGPD com texto conforme requisito
    - Honeypot field oculto (anti-spam)
    - Validação client-side usando `formValidator.ts`
    - Serialização JSON antes do envio via `fetch` para `/api/contact`
    - Mensagem de sucesso e mensagem de erro inline (incluindo fallback WhatsApp)
    - `aria-live="polite"` para anúncio de erros a leitores de tela
    - Labels associados via `for`/`id` em todos os campos
    - Elementos interativos com mínimo 44×44px
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 9.2, 9.4, 9.5, 9.6, 14.1_

  - [ ]* 7.2 Escrever testes unitários para ContactForm
    - Testar exibição de erros inline para campos inválidos
    - Testar bloqueio de envio sem consentimento LGPD
    - Testar mensagem de sucesso após envio bem-sucedido
    - Testar mensagem de erro com fallback WhatsApp quando Mailer falha
    - _Requisitos: 6.2, 6.3, 6.7, 6.9_

- [x] 8. Implementar API Route do Mailer
  - [x] 8.1 Criar `src/lib/mailer.ts` com função de envio via Resend
    - Configurar Resend com `RESEND_API_KEY` via variável de ambiente
    - Formatar e-mail legível com todos os campos identificados por rótulo
    - _Requisitos: 6.2, 12.4, 12.6, 14.3_

  - [x] 8.2 Criar `src/pages/api/contact.ts`
    - Parse do body JSON (retornar 400 se malformado, sem expor detalhes internos)
    - Validação server-side via `validateForm`
    - Verificação do honeypot
    - Envio via `mailer.ts`; retornar 200 `{ success: true }` ou 500 com mensagem genérica
    - _Requisitos: 6.2, 6.7, 10.6, 14.2, 14.5_

  - [ ]* 8.3 Escrever property test para payloads malformados
    - **Propriedade P7: Condição de Erro para Payloads Malformados**
    - **Valida: Requisito 14.5**
    - Para qualquer string não-JSON enviada ao endpoint, resposta deve ter status 400 sem stack trace

  - [ ]* 8.4 Escrever testes unitários para a API Route
    - Testar resposta 200 para payload válido
    - Testar resposta 400 para JSON malformado
    - Testar resposta 400 para campos inválidos
    - Testar que honeypot preenchido retorna 400
    - _Requisitos: 6.2, 6.7, 14.5_

- [ ] 9. Checkpoint — Validar formulário e Mailer
  - Garantir que todos os testes do formulário e da API Route passam. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 10. Implementar banner de consentimento e analytics
  - [x] 10.1 Criar `src/lib/analytics.ts`
    - Funções `trackEvent(name, params)`, `loadAnalytics()`, `isConsentGiven()`
    - Carregar GA4 ou Plausible de forma assíncrona somente após consentimento
    - _Requisitos: 11.1, 11.4_

  - [x] 10.2 Criar `src/components/ConsentBanner.tsx` (ilha React)
    - Exibir na primeira visita (verificar `localStorage`)
    - Aceitar → chamar `loadAnalytics()` e persistir consentimento
    - Recusar → persistir recusa sem carregar nenhum script de rastreamento
    - _Requisitos: 10.10, 10.11, 11.1_

  - [x] 10.3 Integrar eventos de analytics nos CTAs
    - Disparar `form_submit` no envio bem-sucedido do formulário
    - Disparar `whatsapp_click` no CTA WhatsApp da Hero e do Footer
    - Disparar `share_click` nos botões de compartilhamento
    - _Requisitos: 11.2, 11.3, 16.10_

  - [ ]* 10.4 Escrever testes unitários para ConsentBanner e analytics
    - Verificar que analytics não é carregado antes do consentimento
    - Verificar que recusa impede carregamento de scripts de rastreamento
    - Verificar que eventos são disparados corretamente após consentimento
    - _Requisitos: 10.10, 10.11, 11.1, 11.2, 11.3_

- [x] 11. Implementar Footer e botões de compartilhamento
  - [x] 11.1 Criar `src/components/Footer.astro`
    - Links de navegação, `SocialLinks.astro`, link para Política de Privacidade
    - Número CRC (quando disponível), widget/link Instagram
    - Botões de compartilhamento WhatsApp e LinkedIn com URL encoding correto
    - _Requisitos: 10.7, 10.9, 16.1, 16.4, 16.5, 16.6_

  - [ ]* 11.2 Escrever property test para codificação de URLs de compartilhamento
    - **Propriedade P10: Round-Trip de Codificação de URLs de Compartilhamento**
    - **Valida: Requisito 16.5**
    - Para qualquer URL `U` e texto `T`, `decodeURIComponent(encodeURIComponent(U)) === U` e `decodeURIComponent(encodeURIComponent(T)) === T`

- [x] 12. Montar página principal e assets estáticos
  - [x] 12.1 Criar `src/pages/index.astro`
    - Compor todos os componentes na ordem: Header → Hero → Services → Benefits → About → Testimonials → ContactForm → Footer
    - Incluir `ConsentBanner` via `BaseLayout`
    - Garantir exatamente um H1 na página
    - _Requisitos: 1.1, 7.7, 9.3_

  - [x] 12.2 Adicionar assets estáticos em `public/`
    - `robots.txt` permitindo indexação por crawlers
    - `favicon.svg`
    - Imagem OG (`og-image.jpg`, 1200×630px)
    - Logo "DG" com asas (`logo-dg.svg`)
    - Foto profissional de Danúbia (`danubia-foto.webp` + fallback JPEG)
    - _Requisitos: 1.1, 7.3, 8.6, 12.7, 16.7_

  - [x] 12.3 Configurar `astro.config.mjs`
    - Habilitar integração React, Tailwind, sitemap automático
    - Configurar headers HTTP de segurança
    - Configurar compressão gzip/brotli e cache de assets estáticos
    - _Requisitos: 8.9, 8.10, 10.2, 10.3, 10.4, 10.5, 12.1, 12.8_

- [x] 13. Validar acessibilidade e performance
  - [x] 13.1 Auditar contraste de cores em todos os componentes
    - Verificar contraste mínimo 4,5:1 para texto normal e 3:1 para texto grande
    - Corrigir quaisquer violações identificadas
    - _Requisitos: 9.1_

  - [x] 13.2 Auditar navegação por teclado e foco visível
    - Verificar que todos os elementos interativos são alcançáveis via Tab
    - Verificar que o foco visível está presente em todos os elementos interativos
    - _Requisitos: 9.2_

  - [x] 13.3 Verificar atributos ARIA e semântica HTML
    - Confirmar uso de `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`
    - Confirmar `aria-label`, `aria-describedby`, `role` nos componentes interativos
    - Confirmar `aria-live="polite"` no formulário
    - _Requisitos: 9.3, 9.4, 9.6_

  - [x] 13.4 Verificar lazy loading e formatos de imagem
    - Confirmar `loading="lazy"` em todas as imagens abaixo da dobra
    - Confirmar uso de WebP com fallback JPEG/PNG
    - _Requisitos: 8.5, 8.6_

  - [ ]* 13.5 Escrever testes unitários para invariante de tokens de design
    - **Propriedade P6: Invariante de Tokens de Design**
    - **Valida: Requisito 1.2**
    - Verificar que os tokens de cor do tema Tailwind correspondem exatamente à paleta definida (`#1A2A5E`, `#2D5A3D`, `#F5F5F5`, `#FFFFFF`)

- [ ] 14. Checkpoint final — Garantir que todos os testes passam
  - Executar suite completa de testes (unitários e property-based)
  - Verificar build de produção sem erros (`astro build`)
  - Confirmar geração de `sitemap.xml` e `robots.txt`
  - Perguntar ao usuário se há ajustes finais antes da entrega.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental a cada fase
- Property tests validam propriedades universais de corretude
- Testes unitários validam exemplos específicos e casos de borda
- Placeholders de depoimentos e dados fictícios devem ser claramente identificados no código como substituíveis
- Todas as configurações sensíveis devem estar exclusivamente em variáveis de ambiente (nunca em código versionado)
