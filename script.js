document.addEventListener("DOMContentLoaded", () => {
  // ========== BUSCADOR ==========
  const camposBusqueda = [
    { inputID: "inputBusqueda", resultadosID: "resultados" },
    { inputID: "inputBusqueda2", resultadosID: "resultados2" },
  ];

  const obtenerATagConBuscable = () => document.querySelectorAll("a.buscable");

  const mapearBuscables = (buscables) => {
    return Array.from(buscables)
      .map((el) => ({
        href: el.getAttribute("href"),
        titulo: el.textContent.trim(),
      }))
      .filter((obj) => obj.titulo);
  };

  const buscarCoincidencias = (arr, valor) => {
    return arr.filter((el) =>
      el.titulo.toLowerCase().includes(valor.toLowerCase())
    );
  };

  const agregarResultados = (contenedor, resultados) => {
    contenedor.innerHTML = "";
    if (resultados.length === 0) {
      contenedor.style.display = "none";
      return;
    }
    contenedor.style.display = "block";

    const titulo = document.createElement("h2");
    titulo.className = "resultadosTitulo";
    titulo.textContent = "Resultados";
    contenedor.appendChild(titulo);

    resultados.forEach(({ href, titulo }) => {
      const enlace = document.createElement("a");
      enlace.href = href;
      enlace.textContent = titulo;
      enlace.classList.add("resultadosBuscados");
      contenedor.appendChild(enlace);
    });
  };

  const referencias = [];

  camposBusqueda.forEach(({ inputID, resultadosID }) => {
    const input = document.getElementById(inputID);
    const contenedor = document.getElementById(resultadosID);

    if (!input || !contenedor) return;

    referencias.push({ input, contenedor });

    input.addEventListener("input", () => {
      const valor = input.value.trim();
      if (valor) {
        const enlaces = mapearBuscables(obtenerATagConBuscable());
        const filtrados = buscarCoincidencias(enlaces, valor);
        agregarResultados(contenedor, filtrados);
      } else {
        contenedor.style.display = "none";
      }
    });
  });

  document.addEventListener("click", (e) => {
    referencias.forEach(({ input, contenedor }) => {
      if (!input.contains(e.target) && !contenedor.contains(e.target)) {
        contenedor.style.display = "none";
      }
    });
  });

  // ========== MENÚ RESPONSIVE ==========
  const toggleMenu = (element, show) => {
    element.classList.toggle("show", show);
  };

  document.querySelectorAll(".menu-title-rps").forEach((title) => {
    title.addEventListener("click", (e) => {
      e.preventDefault();
      const submenu = title.nextElementSibling;

      document.querySelectorAll(".submenu-item-rps").forEach((sub) => {
        if (sub !== submenu) sub.classList.remove("show");
      });

      submenu.classList.toggle("show");
    });
  });

  document.querySelectorAll(".second-title-menu-rps > a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const submenu = link.nextElementSibling;
      if (!submenu || submenu.tagName.toLowerCase() !== "ul") return;

      const parent = link.closest(".submenu-item-rps");
      parent.querySelectorAll(".second-submenu-rps").forEach((sub) => {
        if (sub !== submenu) sub.classList.remove("show");
      });

      submenu.classList.toggle("show");
    });
  });

  document.querySelectorAll("ul.no-icons-rps a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const submenu = link.nextElementSibling;
      if (submenu && submenu.tagName.toLowerCase() === "ul") {
        e.preventDefault();

        const isOpen = submenu.classList.toggle("show");
        const icon = link.querySelector("i");

        if (icon) {
          icon.classList.toggle("fa-chevron-down", !isOpen);
          icon.classList.toggle("fa-chevron-up", isOpen);
        }

        const parent = link.parentElement.parentElement;
        parent.querySelectorAll(":scope > li > ul").forEach((sub) => {
          if (sub !== submenu) {
            sub.classList.remove("show");
            const sibIcon = sub.previousElementSibling?.querySelector("i");
            if (sibIcon) {
              sibIcon.classList.remove("fa-chevron-up");
              sibIcon.classList.add("fa-chevron-down");
            }
          }
        });
      }
    });
  });

  // Menú hamburguesa
  const toggleBtn = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".menu-close");
  const navMobile = document.querySelector(".menu-mobile-nav");

  if (toggleBtn && closeBtn && navMobile) {
    toggleBtn.addEventListener("click", () => {
      navMobile.classList.add("show");
      toggleBtn.style.display = "none";
      closeBtn.style.display = "inline-block";
    });

    closeBtn.addEventListener("click", () => {
      navMobile.classList.remove("show");
      closeBtn.style.display = "none";
      toggleBtn.style.display = "inline-block";
    });
  }

  // Buscador en responsive
  const searchToggle = document.querySelector(".search-toggle");
  const buscadorContainer = document.querySelector(".buscador-container-rps");

  if (searchToggle && buscadorContainer) {
    searchToggle.addEventListener("click", () => {
      buscadorContainer.classList.toggle("show-buscador");
    });
  }
});
