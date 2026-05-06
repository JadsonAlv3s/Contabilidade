import { siteConfig } from '../config/site';

/**
 * Valida se uma string é uma URL válida com protocolo http ou https.
 * Retorna false para strings vazias, undefined, ou URLs malformadas.
 *
 * Requisito 16.8: URLs inválidas/ausentes não devem gerar elementos <a>.
 */
export function isValidUrl(url: string | undefined | null): url is string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface SocialLink {
  /** Identificador da rede social */
  id: string;
  /** URL do perfil — pode ser undefined se não configurado */
  url: string;
  /** Rótulo acessível para o link */
  label: string;
  /** Nome da plataforma para exibição */
  platform: string;
}

/**
 * Lista de links de redes sociais configurados.
 * Apenas links com URL válida devem ser renderizados.
 *
 * Requisito 16.3: URLs geradas a partir de configuração centralizada.
 */
const allSocialLinks: SocialLink[] = [
  {
    id: 'instagram',
    url: siteConfig.social.instagram,
    label: 'Perfil de Danúbia Carvalho no Instagram',
    platform: 'Instagram',
  },
  {
    id: 'linkedin',
    url: siteConfig.social.linkedin,
    label: 'Perfil de Danúbia Carvalho no LinkedIn',
    platform: 'LinkedIn',
  },
  {
    id: 'whatsapp',
    url: siteConfig.social.whatsapp,
    label: 'Contato via WhatsApp com Danúbia Carvalho',
    platform: 'WhatsApp',
  },
];

/**
 * Retorna apenas os links de redes sociais com URLs válidas.
 * Links com URL inválida ou ausente são omitidos automaticamente.
 *
 * Requisito 16.8: Omitir links com URL inválida/ausente.
 */
export function getValidSocialLinks(): SocialLink[] {
  return allSocialLinks.filter((link) => isValidUrl(link.url));
}

/**
 * Exporta todos os links configurados (incluindo inválidos) para uso em testes.
 */
export { allSocialLinks };
