/**
 * Configurações centralizadas da landing page de Danúbia Carvalho.
 * Todas as configurações de conteúdo, SEO e redes sociais ficam aqui.
 * Configurações sensíveis (chaves de API, e-mail) devem ser definidas
 * exclusivamente via variáveis de ambiente (.env).
 */
export const siteConfig = {
  name: "Danúbia Carvalho",
  title: "Danúbia Carvalho | Consultoria Contábil Estratégica",
  description:
    "Consultoria, Assessoria e Treinamento Contábil para otimizar o seu departamento contábil. Mais de 10 anos de experiência.",
  url: "https://danubiacarvalho.com.br",
  ogImage: "/images/og-image.jpg",
  social: {
    instagram: "https://instagram.com/danubiacarvalho",
    linkedin: "https://linkedin.com/in/danubiacarvalho",
    whatsapp: "https://wa.me/5511999999999",
  },
  /** E-mail de destino para o formulário de contato — definido via variável de ambiente */
  email: import.meta.env.CONTACT_EMAIL as string | undefined,
  /** Número de registro no CRC — substituir pelo número real antes do deploy */
  crc: "CRC-SP 123456/O-1",
} as const;

export type SiteConfig = typeof siteConfig;
