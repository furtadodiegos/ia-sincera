export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Ironizi',
    description:
      'Aplicativo de humor com IA que gera zoeiras e conselhos para o drama do seu amigo. Escolha entre Tio do Churrasco, Coach Quântico ou Amigo Sincero.',
    url: 'https://ironizi.app',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    author: {
      '@type': 'Person',
      name: 'Diego Furtado',
      url: 'https://github.com/diegofurtado',
    },
    inLanguage: 'pt-BR',
    keywords: 'zoeira, zueira, humor, ia, conselho, drama, amigo, tio do churrasco, coach quantico, sarcasmo',
  }

  // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires innerHTML for structured data
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
