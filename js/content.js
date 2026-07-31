/**
 * Fonte única de verdade para dados de contato e conteúdo dinâmico do site.
 * Edite aqui para atualizar telefone, WhatsApp, Instagram, endereço e depoimentos
 * em todas as páginas — os elementos marcados com data-wa, data-tel, data-instagram
 * etc. são preenchidos automaticamente por js/app.js.
 */

export const CONTACT = {
  phoneDisplay: "(11) 94262-6054",
  phoneTel: "+5511942626054",
  whatsappNumber: "5511942626054",
  whatsappMessage:
    "Olá, Tatiana. Gostaria de saber mais sobre a avaliação fonoaudiológica infantil.",
  instagramHandle: "@tatianamurarifono",
  instagramUrl: "https://www.instagram.com/tatianamurarifono/",
  address: {
    line1: "Av. Imperatriz Leopoldina, 957 — Conjunto 2506",
    line2: "Vila Leopoldina, São Paulo — SP",
    cep: "CEP 05305-011",
    // Usado para montar links do Google Maps (busca e embed sob demanda)
    searchQuery:
      "Av. Imperatriz Leopoldina, 957, Vila Leopoldina, São Paulo - SP, 05305-011",
  },
};

export function buildWhatsappLink(customMessage) {
  const text = encodeURIComponent(customMessage || CONTACT.whatsappMessage);
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${text}`;
}

export function buildMapsSearchUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONTACT.address.searchQuery
  )}`;
}

export function buildMapsEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    CONTACT.address.searchQuery
  )}&output=embed`;
}

/**
 * Confirmado via Google (busca por "Tatiana Murari Fonoaudiologia São
 * Paulo" — painel de dados da empresa): 5,0 · 11 avaliações no Google.
 * Se o número mudar, atualize `count` aqui.
 */
export const GOOGLE_RATING = {
  confirmed: true,
  value: 5.0,
  count: 11,
  placeholderLabel: "Avaliação no Google — aguardando confirmação do dado real",
};

/**
 * Depoimentos reais, publicados no Google e fornecidos pela cliente em
 * artes prontas (IMAGEM DEPOIMENTO 01–04). Texto transcrito literalmente,
 * sem edições. Todos 5 estrelas.
 */
export const TESTIMONIALS = [
  {
    id: "ingrid-vicente",
    quote:
      "A Tati... ah, a Tati! Ela não só trouxe de volta o brilho no olhar da minha filha, mas reacendeu a alegria dela em ser entendida. É um presente ver minha pequena se expressar e o mundo a acolher. A Tati acompanha a gente desde que ela era bem pequena, e o que nos conecta é um laço de amor, carinho e uma dedicação que transborda em cada consulta. Ela é, sem dúvidas, a resposta de uma oração para a nossa família. Eu jamais vou esquecer tudo o que ela fez e continua fazendo por nós.",
    author: "Ingrid Vicente",
    rating: 5,
    source: "Google",
  },
  {
    id: "denis-casita",
    quote:
      "Minha filha e meu filho fizeram acompanhamento com a Tatiana e tivemos uma experiência excelente. O tratamento foi muito eficiente e os resultados apareceram de forma rápida. Além da competência técnica, ela sempre foi atenciosa, cuidadosa e muito clara nas explicações sobre cada etapa. Um ponto que fez muita diferença foi a flexibilidade, inclusive realizando alguns atendimentos em casa quando precisamos. Sou muito grato por tudo que ela fez pelas crianças e recomendo de verdade.",
    author: "Denis Casita",
    rating: 5,
    source: "Google",
  },
  {
    id: "larissa-castilho",
    quote:
      "A Tatiana é uma profissional excelente. Desde que iniciamos as sessões, temos visto uma dedicação e um carinho incríveis, que fazem toda a diferença na jornada do nosso filho. Ela é uma profissional atenciosa e a forma como ela conduz as sessões deixa nosso filho sempre à vontade. É muito gratificante vê-lo ir e voltar animado dos atendimentos. A evolução dele é celebrada! A melhora na fala, na comunicação e na autoconfiança é visível. Recomendo a Tatiana de olhos fechados para qualquer família que precise de um apoio fonoaudiológico.",
    author: "Larissa Castilho",
    rating: 5,
    source: "Google",
  },
  {
    id: "fagna-albino",
    quote:
      "Tatiana é a profissional que sabe unir conhecimento técnico e acolhimento ao paciente. Profissional que entrega com excelência pois tem paixão pela fonoaudiologia e propósito na entrega. Conhece do que faz e como faz. Fique tranquilo(a), seu filho(a) está em excelente mãos.",
    author: "Fágna Albino",
    rating: 5,
    source: "Google",
  },
  {
    id: "katia-nakamura",
    quote:
      "Tatiana é uma profissional excelente, super indico! Fez um ótimo trabalho com o meu filho que sente falta dela até hoje! ;)",
    author: "Katia Nakamura",
    rating: 5,
    source: "Google",
  },
  {
    id: "felipe-amaral",
    quote:
      "Drª Tatiana é muito prestativa, não tem como colocar em palavras como estamos felizes com o desenvolvimento do nosso filho. Obrigado por tudo.",
    author: "Felipe Amaral",
    rating: 5,
    source: "Google",
  },
  {
    id: "ligia-goes",
    quote:
      "Profissional humanizada, competente e experiente. Tenho a honra de conhecer de perto sua dedicação com seus pacientes. Recomendo muito.",
    author: "Ligia Góes",
    rating: 5,
    source: "Google",
  },
];
