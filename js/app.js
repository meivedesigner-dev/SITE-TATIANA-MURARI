import {
  CONTACT,
  GOOGLE_RATING,
  TESTIMONIALS,
  buildWhatsappLink,
  buildMapsSearchUrl,
  buildMapsEmbedUrl,
} from "./content.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- Contato: preenche todos os elementos data-* a partir de content.js ---------- */
function hydrateContact() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    const customMessage = el.getAttribute("data-wa-message");
    el.setAttribute("href", buildWhatsappLink(customMessage || undefined));
  });

  document.querySelectorAll("[data-tel]").forEach((el) => {
    el.setAttribute("href", `tel:${CONTACT.phoneTel}`);
  });

  document.querySelectorAll("[data-phone-text]").forEach((el) => {
    el.textContent = CONTACT.phoneDisplay;
  });

  document.querySelectorAll("[data-instagram]").forEach((el) => {
    el.setAttribute("href", CONTACT.instagramUrl);
  });

  document.querySelectorAll("[data-instagram-text]").forEach((el) => {
    el.textContent = CONTACT.instagramHandle;
  });

  document.querySelectorAll("[data-maps-link]").forEach((el) => {
    el.setAttribute("href", buildMapsSearchUrl());
  });

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Header: estado compacto ao rolar ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const setCompact = () => {
    header.classList.toggle("is-compact", window.scrollY > 40);
  };

  setCompact();
  window.addEventListener("scroll", setCompact, { passive: true });
}

/* ---------- Menu mobile ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".nav-drawer");
  if (!toggle || !drawer) return;

  const closeDrawer = () => {
    toggle.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const openDrawer = () => {
    toggle.setAttribute("aria-expanded", "true");
    drawer.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeDrawer() : openDrawer();
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

/* ---------- Destaque do link ativo no menu conforme a seção visível ---------- */
function initActiveNavLinks() {
  const links = document.querySelectorAll(".main-nav a[href^='#']");
  if (!links.length) return;

  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  // Só ativa o estado "oculto aguardando animação" depois que o JS
  // confirma que vai revelar os elementos (ver comentário em style.css).
  document.documentElement.classList.add("js-reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  items.forEach((item, index) => {
    const group = item.closest("[data-reveal-group]");
    const delayStep = 0.09;
    const withinGroupIndex = group
      ? Array.from(group.querySelectorAll("[data-reveal]")).indexOf(item)
      : index % 3;
    item.style.setProperty(
      "--reveal-delay",
      `${Math.min(withinGroupIndex * delayStep, 0.45)}s`
    );

    // Se o item já está visível no carregamento (ex.: navegação direta para
    // uma âncora como index.html#especialidades, que pula o scroll antes do
    // JS rodar), revela na hora em vez de esperar o callback assíncrono do
    // IntersectionObserver — evita uma seção inteira "sumida" nesse caso.
    const rect = item.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom > 0) {
      item.classList.add("is-visible");
    } else {
      observer.observe(item);
    }
  });

  // Segunda checagem logo após o primeiro paint: cobre o caso de o
  // navegador ainda estar aplicando o salto para uma âncora (#secao) no
  // exato instante em que o loop síncrono acima rodou — sem isso, uma
  // seção inteira poderia ficar com opacidade 0 até o usuário rolar.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      items.forEach((item) => {
        if (item.classList.contains("is-visible")) return;
        const rect = item.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          item.classList.add("is-visible");
          observer.unobserve(item);
        }
      });
    });
  });
}

/* ---------- Players de vídeo do YouTube ("lite embed") ----------
   Cada [data-yt-player] mostra só a miniatura + botão de play; o iframe
   real do YouTube (nocookie, sem rastreio de terceiros até o clique) só é
   criado quando o usuário clica, para não pesar o carregamento da página. */
function initYoutubePlayers() {
  document.querySelectorAll("[data-yt-player]").forEach((wrap) => {
    const btn = wrap.querySelector(".video-player-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const videoId = wrap.getAttribute("data-yt-player");
      const title = wrap.getAttribute("data-yt-title") || "Vídeo";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    });
  });
}

/* ---------- Depoimentos ---------- */
function renderTestimonials() {
  const track = document.querySelector("[data-testimonials-track]");
  if (!track) return;

  track.innerHTML = TESTIMONIALS.map((item) => {
    const stars = item.rating
      ? Array.from({ length: 5 })
          .map(
            (_, i) => `
        <svg viewBox="0 0 20 20" fill="${i < item.rating ? "currentColor" : "none"}" stroke="currentColor" aria-hidden="true">
          <polygon points="10 1.5 12.6 7 18.5 7.8 14.2 11.9 15.3 17.8 10 14.9 4.7 17.8 5.8 11.9 1.5 7.8 7.4 7" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>`
          )
          .join("")
      : "";

    return `
      <article class="testimonial-card${item.placeholder ? " is-placeholder" : ""}" role="group" aria-label="Depoimento de ${item.author}">
        ${stars ? `<div class="rating-badge" style="margin-bottom:0;"><span class="stars">${stars}</span></div>` : ""}
        <p class="testimonial-quote">${item.quote}</p>
        <div class="testimonial-meta">
          <span class="testimonial-author">${item.author}</span>
          <span class="testimonial-source">${item.source}</span>
        </div>
      </article>`;
  }).join("");

  const ratingBadge = document.querySelector("[data-google-rating]");
  if (ratingBadge) {
    ratingBadge.textContent = GOOGLE_RATING.confirmed
      ? `${GOOGLE_RATING.value.toFixed(1).replace(".", ",")} no Google · ${GOOGLE_RATING.count} avaliações`
      : GOOGLE_RATING.placeholderLabel;
  }
}

function initTestimonialCarousel() {
  const track = document.querySelector("[data-testimonials-track]");
  const prevBtn = document.querySelector("[data-testimonial-prev]");
  const nextBtn = document.querySelector("[data-testimonial-next]");
  if (!track || !prevBtn || !nextBtn) return;

  const scrollByCard = (direction) => {
    const card = track.querySelector(".testimonial-card");
    const distance = card ? card.getBoundingClientRect().width + 22 : 340;
    track.scrollBy({ left: distance * direction, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  prevBtn.addEventListener("click", () => scrollByCard(-1));
  nextBtn.addEventListener("click", () => scrollByCard(1));
}

/* ---------- Mapa sob demanda ---------- */
function initMapLoader() {
  const btn = document.querySelector("[data-map-load]");
  const frame = document.querySelector("[data-map-frame]");
  if (!btn || !frame) return;

  btn.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = buildMapsEmbedUrl();
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.title = "Mapa com a localização do consultório na Vila Leopoldina";
    frame.innerHTML = "";
    frame.appendChild(iframe);
  });
}

/* ---------- Especialidades: coluna fixa + cards com rolagem ---------- */
function initEspecialidadesScroll() {
  const cards = Array.from(document.querySelectorAll("[data-esp-card]"));
  const navButtons = Array.from(document.querySelectorAll("[data-esp-nav]"));
  if (!cards.length || !navButtons.length) return;

  const setActive = (id) => {
    navButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-esp-nav") === id;
      btn.classList.toggle("is-active", isActive);
      if (isActive) {
        btn.setAttribute("aria-current", "true");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
    cards.forEach((card) => card.classList.toggle("is-active", card.id === id));
  };

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-esp-nav");
      const card = document.getElementById(id);
      if (!card) return;
      card.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
      setActive(id);
    });
  });

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.6 }
  );
  cards.forEach((card) => activeObserver.observe(card));

  // Entrada dos cards pela direita — mesma lógica robusta do reveal
  // principal do site (ver initReveal): sem JS ou com movimento reduzido,
  // os cards ficam sempre visíveis por padrão (ver .js-esp-ready em CSS).
  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("js-esp-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const vh = window.innerHeight || document.documentElement.clientHeight;
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      card.classList.add("is-visible");
    } else {
      revealObserver.observe(card);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateContact();
  initHeader();
  initMobileNav();
  initActiveNavLinks();
  renderTestimonials();
  initTestimonialCarousel();
  hydrateContact(); // reaplica links do WhatsApp após render dos depoimentos, se necessário
  initReveal();
  initYoutubePlayers();
  initEspecialidadesScroll();
  initMapLoader();
});
