# Documento de Requisitos

## Introdução

Este documento especifica os requisitos para a landing page profissional de **Danúbia Carvalho — Consultoria Contábil Estratégica**. O objetivo é criar uma presença digital de alta qualidade que transmita credibilidade, autoridade técnica e confiança, convertendo visitantes em leads qualificados por meio de uma experiência de usuário clara, acessível e otimizada para mecanismos de busca.

A página deve comunicar a proposta de valor da consultoria, apresentar os serviços oferecidos, destacar as credenciais da profissional e facilitar o contato direto com potenciais clientes.

---

## Glossário

- **Landing_Page**: Página web de destino única, sem navegação para subpáginas, focada em conversão.
- **CTA** (Call to Action): Elemento interativo que convida o visitante a realizar uma ação específica (ex.: "Entre em contato").
- **Hero_Section**: Seção principal e de maior destaque visual no topo da página.
- **Lead**: Visitante que demonstra interesse e fornece dados de contato.
- **Formulário_de_Contato**: Componente de interface para coleta de dados do Lead.
- **SEO** (Search Engine Optimization): Conjunto de práticas para melhorar o posicionamento da página em mecanismos de busca.
- **Structured_Data**: Marcação semântica em formato JSON-LD seguindo o vocabulário Schema.org.
- **WCAG**: Web Content Accessibility Guidelines — diretrizes de acessibilidade do W3C.
- **LCP** (Largest Contentful Paint): Métrica de performance que mede o tempo de renderização do maior elemento visível.
- **CLS** (Cumulative Layout Shift): Métrica de estabilidade visual da página.
- **FID** / **INP** (Interaction to Next Paint): Métrica de responsividade a interações do usuário.
- **Core_Web_Vitals**: Conjunto de métricas LCP, CLS e INP definidas pelo Google.
- **HTTPS**: Protocolo de transferência segura de dados via TLS.
- **LGPD**: Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
- **Schema_LocalBusiness**: Tipo de Structured_Data do Schema.org para negócios locais.
- **Schema_Person**: Tipo de Structured_Data do Schema.org para pessoas.
- **Renderer**: Componente responsável por gerar o HTML final da página.
- **Formulário_Validator**: Componente responsável por validar os dados do Formulário_de_Contato antes do envio.
- **Mailer**: Serviço responsável por encaminhar os dados do formulário ao destinatário configurado.
- **Analytics_Script**: Script de terceiro para coleta de métricas de uso (ex.: Google Analytics, Plausible).
- **Consent_Banner**: Componente de interface que solicita consentimento do usuário para uso de cookies e Analytics_Script.
- **Depoimento**: Registro estruturado contendo nome do cliente, empresa ou segmento, texto avaliativo e avaliação numérica de 1 a 5.
- **Schema_Review**: Tipo de Structured_Data do Schema.org para avaliações e depoimentos individuais.
- **Schema_AggregateRating**: Tipo de Structured_Data do Schema.org para avaliação agregada de um negócio ou serviço.
- **Social_Link**: URL de perfil em rede social (Instagram, LinkedIn, etc.) configurada centralmente e exibida no cabeçalho e rodapé.

---

## Requisitos

### Requisito 1: Estrutura e Identidade Visual da Página

**User Story:** Como visitante, quero encontrar uma página visualmente coerente com a identidade da marca Danúbia Carvalho, para que eu perceba profissionalismo e confiança desde o primeiro acesso.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir o logotipo "DG" com asas na Hero_Section, com texto alternativo descritivo para leitores de tela.
2. THE Landing_Page SHALL aplicar a paleta de cores primária composta por azul marinho (`#1A2A5E`), verde escuro (`#2D5A3D`), cinza claro (`#F5F5F5`) e branco (`#FFFFFF`) em todos os componentes visuais.
3. THE Landing_Page SHALL utilizar tipografia com hierarquia clara, definindo tamanhos distintos para títulos (H1, H2, H3), subtítulos e corpo de texto.
4. THE Landing_Page SHALL ser responsiva, adaptando o layout para viewports de largura mínima de 320px e máxima de 1440px sem perda de conteúdo ou funcionalidade.
5. WHEN o visitante acessa a Landing_Page em dispositivo móvel, THE Renderer SHALL exibir o layout em coluna única com espaçamento adequado para toque (mínimo de 44×44px por elemento interativo).
6. THE Landing_Page SHALL manter consistência visual entre todas as seções, utilizando os mesmos tokens de design (cores, espaçamentos, tipografia) definidos no sistema de design.

---

### Requisito 2: Hero Section e Proposta de Valor

**User Story:** Como visitante, quero compreender imediatamente o que Danúbia Carvalho oferece e para quem, para que eu decida em segundos se o serviço é relevante para mim.

#### Critérios de Aceitação

1. THE Hero_Section SHALL exibir o nome "Danúbia Carvalho" como título principal (H1) e a tagline "Consultoria Contábil Estratégica" como subtítulo imediatamente abaixo.
2. THE Hero_Section SHALL exibir a proposta de valor principal: "Consultoria, Assessoria e Treinamento Contábil para otimizar o seu departamento contábil."
3. THE Hero_Section SHALL conter ao menos um CTA primário com texto "Fale Comigo" ou equivalente, que ao ser acionado redireciona o visitante para o Formulário_de_Contato ou abre o WhatsApp em nova aba.
4. WHEN o visitante aciona o CTA primário da Hero_Section, THE Landing_Page SHALL rolar suavemente até o Formulário_de_Contato ou abrir o canal de contato configurado em menos de 300ms.
5. THE Hero_Section SHALL exibir indicadores de credibilidade, incluindo "Mais de 10 anos de experiência" e ao menos dois regimes tributários atendidos (Lucro Real, Lucro Presumido, Simples Nacional, Entidades Sem Fins Lucrativos).

---

### Requisito 3: Seção de Serviços

**User Story:** Como potencial cliente, quero ver claramente quais serviços são oferecidos, para que eu possa avaliar se atendem às necessidades do meu negócio.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir uma seção dedicada a serviços com título H2 "Serviços" ou equivalente.
2. THE Landing_Page SHALL listar os seguintes seis serviços, cada um com título e descrição breve:
   - Escrituração e Conciliação de Contas
   - Conferência de Balancetes e Encerramento de Balanços
   - Elaboração de Demonstrações Contábeis e Envio de Obrigações Acessórias
   - Treinamentos e Capacitações no Departamento Contábil
   - Consultorias e Análises Contábeis
   - Elaboração de Balanços para Licitações
3. WHEN o visitante acessa a seção de serviços em dispositivo móvel, THE Renderer SHALL exibir os cards de serviço em grade de uma coluna, e em desktop em grade de duas ou três colunas.
4. THE Landing_Page SHALL associar um ícone ou elemento visual distinto a cada serviço listado para facilitar a identificação rápida.

---

### Requisito 4: Seção de Vantagens da Terceirização

**User Story:** Como gestor de empresa, quero entender os benefícios de terceirizar o departamento contábil, para que eu possa justificar a decisão de contratar a consultoria.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir uma seção com título H2 "Por que terceirizar o departamento contábil?" ou equivalente.
2. THE Landing_Page SHALL listar as seguintes cinco vantagens, cada uma com título e descrição:
   - Redução de custos com pessoal
   - Profissionais altamente especializados
   - Maior foco na atração de clientes
   - Consultoria estratégica e personalizada
   - Elaboração de balanços para licitações
3. THE Landing_Page SHALL apresentar as vantagens com elementos visuais de destaque (ícones, numeração ou marcadores) que diferenciem cada item.

---

### Requisito 5: Seção de Credenciais e Sobre

**User Story:** Como visitante, quero conhecer a formação e experiência de Danúbia Carvalho, para que eu confie na qualidade técnica dos serviços oferecidos.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir uma seção "Sobre" com foto profissional de Danúbia Carvalho acompanhada de texto alternativo descritivo.
2. THE Landing_Page SHALL listar as seguintes credenciais acadêmicas e profissionais:
   - Bacharel em Ciências Contábeis
   - Especialista em Auditoria e Controladoria
   - MBA em Contabilidade, Direito Tributário e Compliance
   - Formação em Auditoria Interna pela Cenofisco SP
   - Curso de LGPD pela FGV
   - Mais de 10 anos de experiência no departamento contábil
3. THE Landing_Page SHALL mencionar os regimes tributários atendidos: Lucro Real, Lucro Presumido, Simples Nacional e Entidades Sem Fins Lucrativos.
4. THE Landing_Page SHALL mencionar o conhecimento em sistemas contábeis do mercado como diferencial competitivo.
5. THE Landing_Page SHALL exibir o CTA "Vamos transformar a contabilidade do seu negócio!" com link para o Formulário_de_Contato na seção "Sobre".

---

### Requisito 6: Formulário de Contato e Conversão

**User Story:** Como visitante interessado, quero entrar em contato de forma simples e segura, para que eu possa solicitar uma consultoria sem fricção.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir um Formulário_de_Contato com os campos: Nome completo (obrigatório), E-mail (obrigatório), Telefone/WhatsApp (obrigatório), Empresa (opcional) e Mensagem (obrigatório).
2. WHEN o visitante submete o Formulário_de_Contato com todos os campos obrigatórios preenchidos corretamente, THE Mailer SHALL encaminhar os dados ao endereço de e-mail configurado e THE Landing_Page SHALL exibir uma mensagem de confirmação de envio bem-sucedido.
3. IF o visitante submete o Formulário_de_Contato com campos obrigatórios vazios ou com formato inválido, THEN THE Formulário_Validator SHALL exibir mensagens de erro inline específicas para cada campo inválido sem recarregar a página.
4. THE Formulário_Validator SHALL validar o campo E-mail conforme o padrão RFC 5322 antes de permitir o envio.
5. THE Formulário_Validator SHALL validar o campo Telefone aceitando formatos brasileiros com DDD (ex.: (11) 99999-9999 ou +55 11 99999-9999).
6. THE Landing_Page SHALL exibir um link ou botão de contato via WhatsApp como canal alternativo ao Formulário_de_Contato.
7. IF o Mailer falhar ao encaminhar os dados, THEN THE Landing_Page SHALL exibir uma mensagem de erro orientando o visitante a tentar novamente ou usar o contato via WhatsApp.
8. THE Formulário_de_Contato SHALL incluir um checkbox de consentimento LGPD com texto "Concordo com o uso dos meus dados para fins de contato, conforme a LGPD" antes do botão de envio.
9. WHEN o visitante não marca o checkbox de consentimento LGPD, THE Formulário_Validator SHALL impedir o envio e exibir mensagem de erro no campo de consentimento.

---

### Requisito 7: SEO On-Page e Metadados

**User Story:** Como proprietária do negócio, quero que a página apareça nos resultados de busca para termos relevantes, para que potenciais clientes me encontrem organicamente.

#### Critérios de Aceitação

1. THE Renderer SHALL gerar um elemento `<title>` único com até 60 caracteres contendo o nome "Danúbia Carvalho" e o termo "Consultoria Contábil".
2. THE Renderer SHALL gerar uma meta description com entre 120 e 160 caracteres descrevendo a proposta de valor da consultoria.
3. THE Renderer SHALL gerar meta tags Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) para compartilhamento em redes sociais.
4. THE Renderer SHALL gerar meta tags Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) para compartilhamento no Twitter/X.
5. THE Renderer SHALL gerar um bloco de Structured_Data em JSON-LD do tipo `Schema_Person` contendo nome, cargo, formação e URL da página.
6. THE Renderer SHALL gerar um bloco de Structured_Data em JSON-LD do tipo `Schema_LocalBusiness` (subtipo `AccountingService`) contendo nome do negócio, descrição, URL e informações de contato.
7. THE Landing_Page SHALL conter exatamente um elemento H1 por página.
8. THE Landing_Page SHALL utilizar atributos `alt` descritivos em todas as imagens.
9. THE Renderer SHALL gerar um elemento `<link rel="canonical">` apontando para a URL canônica da página.
10. THE Renderer SHALL gerar o atributo `lang="pt-BR"` no elemento `<html>`.
11. THE Landing_Page SHALL utilizar URLs amigáveis e sem parâmetros desnecessários.

---

### Requisito 8: Performance e Core Web Vitals

**User Story:** Como visitante, quero que a página carregue rapidamente, para que eu não abandone o site antes de ver o conteúdo.

#### Critérios de Aceitação

1. THE Landing_Page SHALL atingir pontuação mínima de 90 no Google PageSpeed Insights para dispositivos móveis e desktop.
2. THE Renderer SHALL gerar HTML com LCP inferior a 2,5 segundos em conexão 4G simulada.
3. THE Landing_Page SHALL manter CLS inferior a 0,1 durante todo o carregamento da página.
4. THE Landing_Page SHALL atingir INP inferior a 200ms para interações do usuário.
5. THE Renderer SHALL aplicar lazy loading em todas as imagens abaixo da dobra (atributo `loading="lazy"`).
6. THE Renderer SHALL servir imagens nos formatos WebP ou AVIF com fallback para JPEG/PNG.
7. THE Renderer SHALL gerar o HTML da página de forma estática (SSG) ou com renderização no servidor (SSR) para garantir First Contentful Paint rápido.
8. THE Landing_Page SHALL carregar fontes tipográficas com `font-display: swap` para evitar bloqueio de renderização.
9. THE Landing_Page SHALL minificar e comprimir (gzip ou brotli) todos os assets CSS e JavaScript.
10. THE Landing_Page SHALL implementar cache de assets estáticos com headers `Cache-Control` de longa duração (mínimo 1 ano para assets com hash no nome).

---

### Requisito 9: Acessibilidade (WCAG 2.1 Nível AA)

**User Story:** Como visitante com necessidades especiais, quero acessar o conteúdo da página com tecnologias assistivas, para que eu não seja excluído da experiência.

#### Critérios de Aceitação

1. THE Landing_Page SHALL garantir contraste mínimo de 4,5:1 entre texto e fundo para texto normal, e 3:1 para texto grande (acima de 18pt ou 14pt negrito), conforme WCAG 2.1 critério 1.4.3.
2. THE Landing_Page SHALL ser completamente navegável via teclado, com foco visível em todos os elementos interativos.
3. THE Landing_Page SHALL utilizar elementos HTML semânticos (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`) para estruturar o conteúdo.
4. THE Landing_Page SHALL incluir atributos ARIA (`aria-label`, `aria-describedby`, `role`) nos componentes interativos que não possuem texto visível suficiente.
5. THE Formulário_de_Contato SHALL associar cada campo ao seu `<label>` correspondente via atributo `for`/`id`.
6. IF o Formulário_Validator exibe mensagens de erro, THEN THE Formulário_de_Contato SHALL anunciar os erros via `aria-live="polite"` para leitores de tela.
7. THE Landing_Page SHALL não utilizar conteúdo que pisca mais de três vezes por segundo, conforme WCAG 2.1 critério 2.3.1.
8. THE Landing_Page SHALL fornecer texto alternativo para todos os elementos não textuais (imagens, ícones, gráficos).
9. THE Landing_Page SHALL permitir que o usuário aumente o tamanho do texto em até 200% sem perda de conteúdo ou funcionalidade.

---

### Requisito 10: Segurança e Sinais de Confiança

**User Story:** Como visitante, quero perceber que o site é seguro e legítimo, para que eu me sinta confortável em fornecer meus dados de contato.

#### Critérios de Aceitação

1. THE Landing_Page SHALL ser servida exclusivamente via HTTPS com certificado TLS válido.
2. THE Renderer SHALL incluir o header HTTP `Strict-Transport-Security` (HSTS) com `max-age` mínimo de 31536000 segundos.
3. THE Renderer SHALL incluir o header HTTP `Content-Security-Policy` restringindo fontes de scripts, estilos e imagens a origens confiáveis.
4. THE Renderer SHALL incluir o header HTTP `X-Frame-Options: DENY` para prevenir clickjacking.
5. THE Renderer SHALL incluir o header HTTP `X-Content-Type-Options: nosniff`.
6. THE Formulário_de_Contato SHALL implementar proteção contra spam por meio de honeypot field ou integração com serviço CAPTCHA.
7. THE Landing_Page SHALL exibir o número de registro no CRC (Conselho Regional de Contabilidade) quando disponível, como sinal de credibilidade regulatória.
8. THE Landing_Page SHALL exibir depoimentos ou casos de sucesso de clientes (social proof) em seção dedicada, quando disponíveis.
9. THE Landing_Page SHALL exibir link para a Política de Privacidade no rodapé, descrevendo o tratamento de dados conforme a LGPD.
10. THE Consent_Banner SHALL ser exibido na primeira visita do usuário solicitando consentimento para uso de Analytics_Script, antes que qualquer script de rastreamento seja carregado.
11. WHEN o visitante recusa o consentimento no Consent_Banner, THE Landing_Page SHALL não carregar nenhum Analytics_Script de rastreamento.

---

### Requisito 11: Analytics e Rastreamento de Conversão

**User Story:** Como proprietária do negócio, quero medir o desempenho da página e rastrear conversões, para que eu possa tomar decisões baseadas em dados.

#### Critérios de Aceitação

1. WHERE o visitante concede consentimento no Consent_Banner, THE Landing_Page SHALL carregar o Analytics_Script configurado (Google Analytics 4 ou Plausible Analytics).
2. WHEN o visitante submete o Formulário_de_Contato com sucesso, THE Landing_Page SHALL disparar um evento de conversão para o Analytics_Script ativo.
3. WHEN o visitante aciona o CTA de WhatsApp, THE Landing_Page SHALL disparar um evento de clique para o Analytics_Script ativo.
4. THE Analytics_Script SHALL ser carregado de forma assíncrona para não bloquear a renderização da página.

---

### Requisito 12: Stack Tecnológica e Arquitetura

**User Story:** Como desenvolvedor responsável pela implementação, quero utilizar tecnologias modernas e bem suportadas, para que a página seja fácil de manter, performática e segura.

#### Critérios de Aceitação

1. THE Renderer SHALL ser implementado utilizando **Astro** (versão estável mais recente) como framework principal, com geração estática (SSG) como modo padrão.
2. THE Landing_Page SHALL utilizar **Tailwind CSS** (versão estável mais recente) para estilização, com configuração de tema personalizado contendo os tokens de design da marca.
3. WHERE componentes interativos (formulário, banner de consentimento) exigirem JavaScript no cliente, THE Landing_Page SHALL utilizar **React** ou **Preact** como ilha de interatividade via Astro Islands.
4. THE Mailer SHALL ser implementado como API Route do Astro utilizando **Resend** ou **Nodemailer** com SMTP configurado via variáveis de ambiente.
5. THE Landing_Page SHALL ser hospedada em plataforma com suporte a CDN global, HTTPS automático e deploy contínuo (ex.: Vercel, Netlify ou Cloudflare Pages).
6. THE Landing_Page SHALL armazenar todas as configurações sensíveis (chaves de API, credenciais SMTP, endereço de e-mail de destino) exclusivamente em variáveis de ambiente, nunca em código-fonte versionado.
7. THE Landing_Page SHALL incluir um arquivo `robots.txt` permitindo indexação por crawlers de mecanismos de busca.
8. THE Landing_Page SHALL incluir um arquivo `sitemap.xml` gerado automaticamente pelo Astro com a URL canônica da página.

---

### Requisito 13: Internacionalização e Localização

**User Story:** Como visitante brasileiro, quero que todo o conteúdo esteja em português do Brasil com formatações locais corretas, para que a experiência seja natural e profissional.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir todo o conteúdo textual em português do Brasil (pt-BR).
2. THE Landing_Page SHALL formatar números de telefone no padrão brasileiro com DDD.
3. THE Formulário_de_Contato SHALL aceitar e validar CEP no formato brasileiro (XXXXX-XXX) caso o campo de endereço seja incluído.

---

### Requisito 14: Parser e Serialização de Dados do Formulário

**User Story:** Como desenvolvedor, quero garantir que os dados do formulário sejam corretamente serializados e desserializados entre o cliente e o servidor, para que nenhuma informação seja perdida ou corrompida no envio.

#### Critérios de Aceitação

1. WHEN o Formulário_de_Contato é submetido, THE Formulário_Validator SHALL serializar os dados do formulário em formato JSON antes do envio ao servidor.
2. WHEN o servidor recebe os dados do formulário, THE Mailer SHALL desserializar o JSON e extrair todos os campos corretamente.
3. THE Mailer SHALL formatar os dados desserializados em um e-mail legível com todos os campos identificados por rótulo.
4. FOR ALL conjuntos válidos de dados de formulário, serializar e desserializar os dados SHALL produzir um objeto equivalente ao original (propriedade de round-trip).
5. IF o servidor recebe um payload JSON malformado, THEN THE Mailer SHALL retornar HTTP 400 com mensagem de erro descritiva sem expor detalhes internos da implementação.

---

### Requisito 15: Seção de Depoimentos de Clientes

**User Story:** Como visitante em fase de avaliação, quero ler depoimentos de clientes reais de Danúbia Carvalho, para que eu tenha evidências sociais que reforcem minha confiança antes de entrar em contato.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir uma seção dedicada a depoimentos com título H2 "Depoimentos" ou equivalente, posicionada após a seção de serviços e antes do Formulário_de_Contato.
2. THE Landing_Page SHALL exibir ao menos três depoimentos, cada um contendo: nome do cliente, empresa ou segmento de atuação, texto do depoimento e avaliação numérica de 1 a 5 representada visualmente por ícones de estrela.
3. THE Renderer SHALL renderizar os ícones de estrela de forma acessível, incluindo atributo `aria-label` com o valor numérico da avaliação (ex.: `aria-label="Avaliação: 5 de 5 estrelas"`).
4. WHEN o visitante acessa a seção de depoimentos em dispositivo móvel, THE Renderer SHALL exibir os depoimentos em carrossel ou lista de rolagem vertical com no máximo um depoimento visível por vez.
5. WHEN o visitante acessa a seção de depoimentos em desktop, THE Renderer SHALL exibir os depoimentos em grade de duas ou três colunas.
6. THE Landing_Page SHALL exibir a foto ou avatar do cliente em cada depoimento, com texto alternativo descritivo; WHERE a foto não estiver disponível, THE Renderer SHALL exibir um avatar gerado a partir das iniciais do nome do cliente.
7. IF um depoimento contiver texto com mais de 200 caracteres, THEN THE Renderer SHALL truncar o texto com reticências e exibir um controle "Ler mais" que expande o conteúdo completo sem recarregar a página.
8. THE Landing_Page SHALL marcar a seção de depoimentos com Structured_Data do tipo `Schema.org/Review` ou `Schema.org/AggregateRating` para enriquecimento dos resultados de busca.
9. WHERE depoimentos reais não estiverem disponíveis no momento do desenvolvimento, THE Landing_Page SHALL exibir placeholders estruturados com dados fictícios claramente identificados como exemplos, substituíveis por conteúdo real sem alteração de código.

---

### Requisito 16: Integração com Redes Sociais

**User Story:** Como visitante, quero acessar os perfis profissionais de Danúbia Carvalho nas redes sociais e compartilhar o conteúdo da página, para que eu possa verificar a presença digital da profissional e recomendar os serviços à minha rede.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir links para os perfis sociais configurados (Instagram e LinkedIn, no mínimo) tanto no cabeçalho (`<header>`) quanto no rodapé (`<footer>`), representados por ícones SVG com texto alternativo acessível.
2. WHEN o visitante aciona um link de rede social, THE Landing_Page SHALL abrir o perfil correspondente em nova aba (`target="_blank"`) com os atributos de segurança `rel="noopener noreferrer"`.
3. THE Renderer SHALL gerar os links de redes sociais a partir de variáveis de configuração centralizadas, de modo que a atualização de uma URL de perfil não exija alteração em múltiplos locais do código.
4. THE Landing_Page SHALL exibir botões de compartilhamento para WhatsApp e LinkedIn na seção de depoimentos ou próximo ao CTA principal, permitindo que o visitante compartilhe a página com texto pré-definido.
5. WHEN o visitante aciona um botão de compartilhamento, THE Landing_Page SHALL abrir o canal de compartilhamento correspondente com URL da página e texto pré-definido corretamente codificados (URL encoding).
6. WHERE a URL do perfil do Instagram estiver configurada, THE Landing_Page SHALL exibir um widget ou link de destaque para o perfil do Instagram na seção de rodapé ou em seção dedicada, incentivando o seguimento do perfil.
7. THE Renderer SHALL incluir as meta tags Open Graph e Twitter Card (já definidas no Requisito 7.3 e 7.4) com imagem de compartilhamento (`og:image`) de dimensões mínimas de 1200×630px para garantir exibição correta em todas as plataformas.
8. IF uma URL de perfil social configurada estiver malformada ou ausente, THEN THE Renderer SHALL omitir o link correspondente sem exibir elemento quebrado ou erro visível ao visitante.
9. THE Landing_Page SHALL incluir Structured_Data do tipo `Schema_Person` (já definido no Requisito 7.5) com os campos `sameAs` apontando para as URLs dos perfis sociais configurados.
10. WHEN o visitante aciona o botão de compartilhamento via WhatsApp, THE Landing_Page SHALL disparar um evento de clique para o Analytics_Script ativo (conforme Requisito 11.3).

---

## Propriedades de Corretude para Property-Based Testing

As propriedades abaixo são derivadas dos critérios de aceitação e destinam-se a guiar a implementação de testes baseados em propriedades (PBT) nas partes lógicas do sistema.

### P1 — Round-Trip de Serialização do Formulário (Requisito 14.4)
**Propriedade:** Para qualquer conjunto válido de dados de formulário `F` (nome, e-mail, telefone, empresa, mensagem), `deserialize(serialize(F))` deve ser estruturalmente equivalente a `F`.
**Tipo:** Round-Trip
**Aplicável a:** `Formulário_Validator` e `Mailer`

### P2 — Idempotência da Validação (Requisito 6.3)
**Propriedade:** Para qualquer entrada de formulário `I`, aplicar `Formulário_Validator.validate(I)` uma ou múltiplas vezes deve produzir o mesmo resultado: `validate(I) === validate(validate_result(I))`.
**Tipo:** Idempotência
**Aplicável a:** `Formulário_Validator`

### P3 — Invariante de Campos Obrigatórios (Requisito 6.2 e 6.3)
**Propriedade:** Para qualquer submissão onde ao menos um campo obrigatório esteja vazio ou inválido, `Formulário_Validator.validate(I).isValid` deve ser `false`. Para qualquer submissão onde todos os campos obrigatórios estejam preenchidos com valores válidos, `validate(I).isValid` deve ser `true`.
**Tipo:** Invariante
**Aplicável a:** `Formulário_Validator`

### P4 — Propriedade Metamórfica de Validação de E-mail (Requisito 6.4)
**Propriedade:** Para qualquer e-mail válido `e`, inserir caracteres inválidos (espaços, `@` duplo, domínio ausente) deve sempre resultar em `validate_email(mutate(e)).isValid === false`.
**Tipo:** Metamórfica
**Aplicável a:** `Formulário_Validator`

### P5 — Invariante de Consentimento LGPD (Requisito 6.8 e 6.9)
**Propriedade:** Para qualquer submissão de formulário onde `consentimento_lgpd === false`, `Formulário_Validator.validate(I).isValid` deve ser `false`, independentemente dos demais campos.
**Tipo:** Invariante
**Aplicável a:** `Formulário_Validator`

### P6 — Invariante de Tokens de Design (Requisito 1.2)
**Propriedade:** Para qualquer componente renderizado da Landing_Page, os valores de cor aplicados devem pertencer ao conjunto de tokens de design definidos (`#1A2A5E`, `#2D5A3D`, `#F5F5F5`, `#FFFFFF` e suas variações documentadas). Nenhum componente deve utilizar cor fora deste conjunto.
**Tipo:** Invariante
**Aplicável a:** `Renderer` / sistema de design Tailwind

### P7 — Propriedade de Erro para Payloads Malformados (Requisito 14.5)
**Propriedade:** Para qualquer string que não seja JSON válido enviada ao endpoint do Mailer, a resposta HTTP deve ter status 400 e o corpo deve conter uma mensagem de erro sem stack trace ou detalhes internos.
**Tipo:** Condição de Erro
**Aplicável a:** `Mailer` (API Route)

### P8 — Invariante de Avaliação de Depoimentos (Requisito 15.2)
**Propriedade:** Para qualquer depoimento `D` renderizado na seção de depoimentos, o valor numérico da avaliação `D.rating` deve satisfazer `1 ≤ D.rating ≤ 5`. Nenhum depoimento pode ser renderizado com avaliação fora deste intervalo.
**Tipo:** Invariante
**Aplicável a:** `Renderer` (seção de depoimentos)

### P9 — Invariante de Acessibilidade das Estrelas (Requisito 15.3)
**Propriedade:** Para qualquer avaliação `r` no intervalo `[1, 5]`, o `aria-label` gerado pelo `Renderer` para os ícones de estrela deve conter o valor `r` e o total `5`, na forma `"Avaliação: {r} de 5 estrelas"`. A propriedade deve valer para todos os inteiros de 1 a 5.
**Tipo:** Invariante
**Aplicável a:** `Renderer` (ícones de estrela)

### P10 — Propriedade de Codificação de URLs de Compartilhamento (Requisito 16.5)
**Propriedade:** Para qualquer URL de página `U` e texto de compartilhamento `T`, a URL de compartilhamento gerada deve ser tal que `decodeURIComponent(encode(U)) === U` e `decodeURIComponent(encode(T)) === T`. Caracteres especiais (espaços, acentos, `&`, `?`) devem ser corretamente codificados e decodificáveis sem perda.
**Tipo:** Round-Trip
**Aplicável a:** `Renderer` (botões de compartilhamento)

### P11 — Condição de Erro para URLs de Perfil Social Malformadas (Requisito 16.8)
**Propriedade:** Para qualquer valor de URL de perfil social `S` que não seja uma URL válida (vazia, sem protocolo, com caracteres inválidos), o `Renderer` não deve gerar nenhum elemento `<a>` com `href` apontando para `S`. O número de links de redes sociais renderizados deve ser igual ao número de URLs válidas configuradas.
**Tipo:** Condição de Erro / Invariante
**Aplicável a:** `Renderer` (links de redes sociais)
