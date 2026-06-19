(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const year = document.querySelector("#current-year");
  const revealItems = document.querySelectorAll(".reveal");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Mantém parâmetros UTM e acrescenta a origem na mensagem do WhatsApp.
  const params = new URLSearchParams(window.location.search);
  const utmData = [];

  params.forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) {
      utmData.push(`${key}: ${value}`);
    }
  });

  if (utmData.length) {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      try {
        const url = new URL(link.href);
        const originalMessage = url.searchParams.get("text") || "";
        url.searchParams.set(
          "text",
          `${originalMessage}\n\nOrigem da campanha: ${utmData.join(" | ")}`
        );
        link.href = url.toString();
      } catch (error) {
        console.warn("Não foi possível preservar os parâmetros UTM.", error);
      }
    });
  }

  // Eventos básicos para Google Analytics, GTM ou Meta Pixel.
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      const label = element.dataset.track;

      if (typeof window.gtag === "function") {
        window.gtag("event", "contact_click", {
          event_category: "conversion",
          event_label: label,
        });
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "contact_click",
        contact_type: label,
      });

      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact", {
          content_name: label,
        });
      }
    });
  });
})();
