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
    instagram: "https://instagram.com/danubia_carvalhoo",
    linkedin: "https://linkedin.com/in/danubiacarvalho",
    whatsapp: "https://wa.me/5581996741683?text=Ol%C3%A1%20Dan%C3%BAbia%2C%20vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20seus%20servi%C3%A7os%20de%20consultoria%20cont%C3%A1bil.",
  },
  /** E-mail de contato */
  email: "dccontabilidadeconsultorias@gmail.com",
  /** Telefone de contato */
  phone: "(81) 99674-1683",
  phoneRaw: "5581996741683",
  /** Número de registro no CRC */
  crc: "CRC-PE 034502",
} as const;

export type SiteConfig = typeof siteConfig;
