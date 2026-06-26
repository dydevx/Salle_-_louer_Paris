const header = document.getElementById("site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
const backToTop = document.getElementById("back-to-top");
const form = document.getElementById("booking-form");
const formStatus = document.getElementById("form-status");
const heroMedia = document.querySelector(".hero-media");
const preloader = document.getElementById("preloader");
const scrollProgress = document.getElementById("scroll-progress");

const galleryImages = [
  {
    src: "WhatsApp Image 2026-06-22 at 18.23.24.jpeg",
    alt: "Coin lounge avec éclairage rouge dans la salle"
  },
  {
    src: "WhatsApp Image 2026-06-22 at 18.51.59.jpeg",
    alt: "Salle événementielle avec fauteuils et tables basses"
  },
  {
    src: "WhatsApp Image 2026-06-22 at 18.23.24 (1).jpeg",
    alt: "Vue large de la salle avec scène et éclairage"
  },
  {
    src: "WhatsApp Image 2026-06-22 at 18.23.24 (2).jpeg",
    alt: "Scène et espace modulable pour animation"
  },
  {
    src: "WhatsApp Image 2026-06-22 at 18.50.20.jpeg",
    alt: "Salle avec plafond floral et lumières colorées"
  },
  {
    src: "WhatsApp Image 2026-06-22 at 18.50.21.jpeg",
    alt: "Configuration événement avec fauteuils face à la scène"
  },
  {
    src: "WhatsApp Image 2026-06-22 at 18.50.21 (1).jpeg",
    alt: "Grande salle aménagée pour réception à Paris"
  }
];

let activeImageIndex = 0;
let latestScrollY = window.scrollY;
let ticking = false;

document.body.classList.add("motion-ready");

function finishPageIntro() {
  if (document.body.classList.contains("page-loaded")) return;

  window.setTimeout(() => {
    document.body.classList.add("page-loaded");
    if (preloader) {
      preloader.setAttribute("aria-hidden", "true");
    }
  }, 450);
}

window.addEventListener("DOMContentLoaded", finishPageIntro, { once: true });
window.setTimeout(finishPageIntro, 1400);

function updateHeader() {
  const isScrolled = window.scrollY > 20;
  header.classList.toggle("scrolled", isScrolled);
  backToTop.classList.toggle("visible", window.scrollY > 600);
  document.body.classList.toggle("quick-contact-visible", window.scrollY > 520);
}

function updateMotionFrame() {
  ticking = false;
  updateHeader();

  if (scrollProgress) {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (latestScrollY / maxScroll) * 100 : 0;
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }

  if (heroMedia && latestScrollY < window.innerHeight * 1.2) {
    const offset = Math.min(latestScrollY * 0.12, 90);
    heroMedia.style.transform = `translateY(${offset}px) scale(1)`;
  }
}

function closeMenu() {
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Ouvrir le menu");
}

function toggleMenu() {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
}

menuToggle.addEventListener("click", toggleMenu);

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  const clickInsideMenu = nav.contains(event.target) || menuToggle.contains(event.target);
  if (!clickInsideMenu && nav.classList.contains("open")) {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  latestScrollY = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(updateMotionFrame);
    ticking = true;
  }
}, { passive: true });
updateHeader();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("play", () => {
    document.querySelectorAll("video").forEach((otherVideo) => {
      if (otherVideo !== video) {
        otherVideo.pause();
      }
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".section-copy.reveal").forEach((element) => element.classList.add("reveal-left"));
document.querySelectorAll(".image-panel.reveal, .video-frame.reveal, .map-frame.reveal").forEach((element) => element.classList.add("reveal-right"));
document.querySelectorAll(".event-card.reveal, .price-card.reveal, .contact-card.reveal").forEach((element) => element.classList.add("reveal-zoom"));

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const finalValue = Number(target.dataset.count);
      const duration = 1100;
      const startTime = performance.now();

      function animateCounter(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = Math.round(finalValue * eased).toString();

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        }
      }

      requestAnimationFrame(animateCounter);
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");

function renderLightbox(index) {
  activeImageIndex = (index + galleryImages.length) % galleryImages.length;
  const current = galleryImages[activeImageIndex];
  lightboxImage.src = current.src;
  lightboxImage.alt = current.alt;
}

function openLightbox(index) {
  renderLightbox(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => renderLightbox(activeImageIndex - 1));
lightboxNext.addEventListener("click", () => renderLightbox(activeImageIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    renderLightbox(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    renderLightbox(activeImageIndex + 1);
  }
});

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const error = wrapper.querySelector("small");
  wrapper.classList.toggle("error", Boolean(message));
  error.textContent = message;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePhone(value) {
  return /^[+()\d\s.-]{8,}$/.test(value);
}

function validateForm() {
  let valid = true;
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));

  fields.forEach((field) => {
    const value = field.value.trim();
    let message = "";

    if (field.required && !value) {
      message = "Ce champ est obligatoire.";
    } else if (field.type === "email" && !validateEmail(value)) {
      message = "Veuillez saisir une adresse e-mail valide.";
    } else if (field.type === "tel" && !validatePhone(value)) {
      message = "Veuillez saisir un numéro de téléphone valide.";
    } else if (field.type === "number" && Number(value) < 1) {
      message = "Veuillez indiquer au moins une personne.";
    }

    setFieldError(field, message);

    if (message) {
      valid = false;
    }
  });

  return valid;
}

function buildMailto() {
  const data = new FormData(form);
  const subject = encodeURIComponent("Demande de devis - Salle à louer Paris");
  const bodyLines = [
    "Bonjour,",
    "",
    "Je souhaite recevoir un devis pour la location de la salle.",
    "",
    ...Array.from(data.entries()).map(([key, value]) => `${key} : ${value}`),
    "",
    "Merci."
  ];

  return `mailto:hakaschi93@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

form.addEventListener("input", (event) => {
  if (event.target.matches("input, select, textarea")) {
    setFieldError(event.target, "");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!validateForm()) {
    formStatus.textContent = "Veuillez corriger les champs indiqués avant l'envoi.";
    const firstError = form.querySelector(".form-field.error input, .form-field.error select, .form-field.error textarea");
    if (firstError) firstError.focus();
    return;
  }

  formStatus.textContent = "Votre demande a bien été envoyée. Nous vous contacterons rapidement.";
  window.location.href = buildMailto();
});
