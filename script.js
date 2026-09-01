const CONFIG = {
  whatsappNumber: "5547991036338",
  whatsappMessage: "Olá! Gostaria de fazer um orçamento.",
  storeAddress: "Canedo Cell, Av. Pref. José Juvenal Mafra, 7148, Gravatá, Navegantes, SC, 88372-506"
};

function openWhatsApp() {
  const url = "https://wa.me/" + CONFIG.whatsappNumber +
    "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
  window.open(url, "_blank", "noopener,noreferrer");
}

function openMaps() {
  const url = "https://www.google.com/maps/dir/?api=1" +
    "&destination=" + encodeURIComponent(CONFIG.storeAddress) +
    "&travelmode=driving";
  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-whatsapp]").forEach(btn => btn.addEventListener("click", openWhatsApp));
document.querySelectorAll("[data-maps]").forEach(btn => btn.addEventListener("click", openMaps));

/* Antes / Depois — a imagem de antes mantém 100% do tamanho.
   O container apenas corta a área visível. */
document.querySelectorAll("[data-comparison]").forEach(comparison => {
  const before = comparison.querySelector(".comparison-before");
  const line = comparison.querySelector(".comparison-line");
  const handle = comparison.querySelector(".comparison-handle");
  let dragging = false;

  function syncBeforeImageSize() {
    // Mantém a foto do ANTES exatamente com a mesma dimensão da foto do DEPOIS.
    comparison.style.setProperty("--comparison-width", comparison.clientWidth + "px");
  }

  function setPosition(clientX) {
    const rect = comparison.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    before.style.width = percent + "%";
    line.style.left = percent + "%";
    handle.style.left = percent + "%";
  }

  syncBeforeImageSize();
  window.addEventListener("resize", syncBeforeImageSize, { passive: true });

  comparison.addEventListener("pointerdown", e => {
    dragging = true;
    comparison.setPointerCapture?.(e.pointerId);
    setPosition(e.clientX);
  });

  comparison.addEventListener("pointermove", e => {
    if (dragging) setPosition(e.clientX);
  });

  const stop = () => dragging = false;
  comparison.addEventListener("pointerup", stop);
  comparison.addEventListener("pointercancel", stop);
  comparison.addEventListener("mouseleave", () => { if (!("ontouchstart" in window)) dragging = false; });

  comparison.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const current = parseFloat(before.style.width || "50");
    const next = Math.max(0, Math.min(100, current + (e.key === "ArrowRight" ? 5 : -5)));
    before.style.width = next + "%";
    line.style.left = next + "%";
    handle.style.left = next + "%";
  });
});

/* Menu mobile */
const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("mobile-open");
  menuButton.setAttribute("aria-expanded", open ? "true" : "false");
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("mobile-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

/* Header com efeito ao rolar */
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

/* Animações suaves ao entrar na tela */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* Pequeno efeito magnético nos botões principais */
document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("pointermove", e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.08;
    const y = (e.clientY - r.top - r.height / 2) * 0.08;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener("pointerleave", () => btn.style.transform = "");
});

/* Impede menu de contexto nas fotos */
document.querySelectorAll(".comparison img").forEach(img => {
  img.addEventListener("contextmenu", e => e.preventDefault());
});
