(() => {
  "use strict";

  const cabecalho = document.querySelector(".cabecalho");
  const camposAno = document.querySelectorAll(".ano-atual");
  const elementosAnimados = document.querySelectorAll(".aparece-ao-rolar");

  camposAno.forEach((campo) => {
    campo.textContent = new Date().getFullYear();
  });

  function atualizarCabecalho() {
    if (!cabecalho) return;
    cabecalho.classList.toggle("cabecalho-rolagem", window.scrollY > 16);
  }

  atualizarCabecalho();
  window.addEventListener("scroll", atualizarCabecalho, { passive: true });

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(
      (entradas, observadorAtual) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("esta-visivel");
          observadorAtual.unobserve(entrada.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elementosAnimados.forEach((elemento) => observador.observe(elemento));
  } else {
    elementosAnimados.forEach((elemento) => elemento.classList.add("esta-visivel"));
  }

  // Mantém os parâmetros UTM e registra a origem na mensagem do WhatsApp.
  const parametros = new URLSearchParams(window.location.search);
  const dadosUtm = [];

  parametros.forEach((valor, chave) => {
    if (chave.toLowerCase().startsWith("utm_")) {
      dadosUtm.push(`${chave}: ${valor}`);
    }
  });

  if (dadosUtm.length) {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      try {
        const url = new URL(link.href);
        const mensagemOriginal = url.searchParams.get("text") || "";
        url.searchParams.set(
          "text",
          `${mensagemOriginal}\n\nOrigem da campanha: ${dadosUtm.join(" | ")}`
        );
        link.href = url.toString();
      } catch (erro) {
        console.warn("Não foi possível preservar os parâmetros UTM.", erro);
      }
    });
  }

  // Dispara eventos básicos para Google Analytics, GTM ou Meta Pixel.
  document.querySelectorAll("[data-track]").forEach((elemento) => {
    elemento.addEventListener("click", () => {
      const identificador = elemento.dataset.track;

      if (typeof window.gtag === "function") {
        window.gtag("event", "contact_click", {
          event_category: "conversion",
          event_label: identificador,
        });
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "contact_click",
        contact_type: identificador,
      });

      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact", {
          content_name: identificador,
        });
      }
    });
  });
})();
