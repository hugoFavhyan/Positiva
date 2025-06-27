// Adjuntar los listeners cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // --- FUNCIONES DEL BUSCADOR ---

  function obtenerATagConBuscable() {
    return document.querySelectorAll("a.buscable");
  }

  function tagConBuscableMapper(buscables) {
    const resultados = [];
    buscables.forEach((el) => {
      const href = el.getAttribute("href");
      const innerText = el.textContent.trim(); // Limpiar espacios en blanco
      if (innerText) {
        // Solo añadir elementos que tienen texto
        resultados.push({
          href: href,
          titulo: innerText,
        });
      }
    });
    return resultados;
  }

  function buscarElementosParecidos(arr, busqueda) {
    const resultados = arr.filter((elemento) => {
      const elementoMinuscula = elemento.titulo.toLowerCase();
      const busquedaMinuscula = busqueda.toLowerCase();
      return elementoMinuscula.includes(busquedaMinuscula);
    });
    return resultados ?? [];
  }

  function obtenerInputBusqueda() {
    return document.querySelector("#inputBusqueda");
  }

  function buscarEtiquetaResultado() {
    return document.getElementById("resultados");
  }

  function ocultarElemento(ocultar) {
    const resultadosDiv = buscarEtiquetaResultado();
    if (resultadosDiv) {
      resultadosDiv.style.display = ocultar ? "none" : "block";
    }
  }

  function eliminarEtiquetas() {
    const resultadosDiv = buscarEtiquetaResultado();
    if (resultadosDiv) {
      resultadosDiv.innerHTML = ""; // Manera simple de limpiar el contenido
    }
  }

  function agregarTituloResultados() {
    const resultadosContainer = buscarEtiquetaResultado();
    if (
      resultadosContainer &&
      !resultadosContainer.querySelector(".resultadosTitulo")
    ) {
      const tituloResultados = document.createElement("h2");
      tituloResultados.textContent = "Resultados";
      tituloResultados.classList.add("resultadosTitulo");
      resultadosContainer.insertBefore(
        tituloResultados,
        resultadosContainer.firstChild
      );
    }
  }

  function agregarEnlaces(objetos) {
    const resultadosDiv = buscarEtiquetaResultado();
    if (resultadosDiv) {
      agregarTituloResultados();
      objetos.forEach((objeto) => {
        const enlace = document.createElement("a");
        enlace.href = objeto.href;
        enlace.textContent = objeto.titulo;
        enlace.classList.add("resultadosBuscados");
        resultadosDiv.appendChild(enlace);
      });
    }
  }

  // --- EVENTOS DEL BUSCADOR ---

  const inputBusqueda = obtenerInputBusqueda();
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", function () {
      eliminarEtiquetas();
      const searchTerm = this.value.trim();
      if (searchTerm !== "") {
        const todosLosLinks = tagConBuscableMapper(obtenerATagConBuscable());
        const elementosParecidos = buscarElementosParecidos(
          todosLosLinks,
          searchTerm
        );
        const tieneResultados = elementosParecidos.length > 0;
        ocultarElemento(!tieneResultados);
        if (tieneResultados) {
          agregarEnlaces(elementosParecidos);
        }
      } else {
        ocultarElemento(true);
      }
    });
  }

  // Añadir un listener de clic al documento para ocultar los resultados al hacer clic fuera
  document.addEventListener("click", function (event) {
    const contenedorResultados = buscarEtiquetaResultado();
    const input = obtenerInputBusqueda();
    if (
      contenedorResultados &&
      input &&
      !contenedorResultados.contains(event.target) &&
      event.target !== input
    ) {
      ocultarElemento(true);
    }
  });
});
