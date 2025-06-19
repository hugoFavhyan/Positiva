let isfourCardVisible = false;
const mediaQuery = window.matchMedia("(max-width: 768px)");

const formatNumberWithDots = (value) => {
  const numberString = value.replace(/\D/g, ""); // Solo digitos
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Separar por miles
};

// Función para manejar el input y aplicar el formato
const handleInputFormat = (event) => {
  const input = event.target;
  const formattedValue = formatNumberWithDots(input.value);
  input.value = formattedValue;
};

// Función para poblar el select de años
const populateYearSelect = (selectId) => {
  const yearSelect = document.getElementById(selectId);
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 7;

  for (let year = startYear + 1; year <= currentYear; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  if (yearSelect.options.length > 0) {
    yearSelect.value = yearSelect.options[1].value; //contando el seleccionar
  }
};

// Función para actualizar la altura del contenedor de las tabs
const updateContainerHeight = (target, containerTabs, tabHeights) => {
  containerTabs.style.height = tabHeights[target] || "auto";
};

// Función para manejar el cambio de tabs
const handleTabClick = (target, tabContents, calculateButton, containerTabs, card2, fourCard, valorSeguroSection) => {
  tabContents.forEach((content) => {
    content.classList.toggle("active", content.id === target);
  });

  calculateButton.style.display = target === "para-ti" ? "none" : "block";
  containerTabs.classList.toggle("active-combined", target === "para-ti-y-tu-bici");
  card2.style.display = target === "para-tu-bici" || target === "para-ti-y-tu-bici" ? "block" : "none";
  fourCard.style.display = target === "para-ti" && isfourCardVisible ? "block" : "none";
  valorSeguroSection.style.display = target === "para-ti-y-tu-bici" ? "flex" : "none";

  updateContainerHeight(target, containerTabs, {
    "para-ti": "0px",
    "para-tu-bici": "175px",
    "para-ti-y-tu-bici": "95px",
  });
};

// Función para manejar el resultado de la validación
const handleValidationResult = (isValid, card2, cardThree, modal) => {
  if (!isValid) {
    modal.classList.add("active");
    card2.style.display = "block";
    cardThree.style.display = "none";
  } else {
    cardThree.style.display = "flex";
    card2.style.display = "none"; // <-- AÑADE ESTA LÍNEA AQUÍ
  }
};

// Función para validar el valor basado en el rango
const validateValue = (value, min, max) => {
  return value >= min && value <= max;
};

// Función para mostrar el toast
const showToast = (toast) => {
  toast.classList.add("showToastError");
  setTimeout(() => {
    toast.classList.remove("showToastError");
  }, 3000);
};

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const containerTabs = document.querySelector(".tab-content-container");
  const modal = document.getElementById("modal");
  const closeModal = document.querySelector(".close");
  const calculateButton = document.querySelector(".calculate-button");
  const radioButtons = document.querySelectorAll("input[type='radio']");
  const insuranceLink = document.querySelector(".button-section a");
  const valueInput = document.getElementById("value");
  const valueCombinedInput = document.getElementById("value-combined");
  const card2 = document.querySelector(".secondCard");
  const cardThree = document.querySelector(".thirdCard");
  const fourCard = document.querySelector(".fourCard");
  const mainCost = fourCard.querySelector(".main-cost");
  const annualText = fourCard.querySelector(".annual");
  const modal2 = document.querySelector(".modalPremium");
  const btn = document.querySelector(".open-modal-btn-premium");
  const closeModalPremium = document.querySelector(".close-modalPremium");
  const toast = document.getElementById("toast");
  const valueError = document.getElementById("value-error");
  const valueCombinedError = document.getElementById("value-combined-error");
  const valorSeguroSection = document.getElementById("valorSeguroSection");
  const btnSeguro = document.getElementById("btnSeguro");
  var urlSeguro = "";
  const heartIconUrl =
    "https://positivapruebas.com.co/wp-content/uploads/corazoncito-1.svg";

  const maintenanceServices = [
    "Engrase de rodamientos.",
    "Centrado de llantas.",
    "Lubricación de cadena, plato y piñones.",
    "Ajuste de frenos.",
    "Suministro de aire.",
    "Mantenimiento preventivo domiciliario.",
    "Traslado de la Bicicleta por enfermedad, accidente o avería.",
  ];

  const cyclistServices = [
    "Transporte al ciclista por pérdida o hurto de la Bici.",
    "Asesoría Jurídica telefónica en accidente de tránsito.",
    "Asesoría Jurídica telefónica en caso de hurto de la Bici.",
    "Asesoría Jurídica telefónica en caso de daños a terceros.",
    "Referencias y coordinación de eventos y circuitos relacionados con la Bici.",
    "Referencia de sitios de artículos e indumentaria para la Bici.",
    "Informe del estado de las vías - ciclovías.",
  ];

  // Formatear los inputs
  valueInput.addEventListener("input", handleInputFormat);
  valueCombinedInput.addEventListener("input", handleInputFormat);

  // Asignar eventos a las tabs
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Eliminar la clase active de todos los tabs
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Manejar el clic en la tab
      handleTabClick(
        tab.getAttribute("data-tab"),
        tabContents,
        calculateButton,
        containerTabs,
        card2,
        fourCard,
        valorSeguroSection
      );

      if (tab.getAttribute("data-tab") !== "para-ti") card2.style.display = "block";
      cardThree.style.display = "none";

      const elements = document.querySelectorAll(".secondCard");
      elements.forEach((element) => {
        element.style.display = "block";
        radioButtons.forEach((radio) => {
          const customRadio = document.querySelector(".custom-radio");
          if (customRadio) {
            radioButtons.forEach((r) => {
              r.parentElement.removeAttribute("style");
              r.checked = false;
              isfourCardVisible = false;
            });
          }
        });
      });
      valueError.style.display = "none";
      valueCombinedError.style.display = "none";
      valueInput.style.border = "";
      valueCombinedInput.style.border = "";
    });
  });

  radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      const activeTab = document.querySelector(".tab.active").getAttribute("data-tab");

      // Ocultar card 2 y mostrar la card 4 (para-ti)
      const elements = document.querySelectorAll(".secondCard");
      elements.forEach((element) => element.style.display = "none");
      fourCard.style.display = "block";
      isfourCardVisible = true;

      // Actualizar textos y enlaces
      if (radio.value === "anual") {
        mainCost.textContent = "$ 75.000";
        annualText.textContent = "Anual";
        urlSeguro = "https://positivapruebas.com.co/seguros/formulario-plan-para-ti-anual/";
      } else if (radio.value === "24-horas") {
        mainCost.textContent = "$ 5.000";
        annualText.textContent = "24 Horas";
        urlSeguro = "https://positivapruebas.com.co/seguros/formulario-plan-para-ti-24-horas/";
      }

      // Aplicar URL a ambos botones
      insuranceLink.href = urlSeguro;
      const btnResponsive = document.querySelector(".fourCard .button-section a");
      if (btnResponsive) btnResponsive.href = urlSeguro;

      // Marcar el botón activo visualmente
      radioButtons.forEach((r) => {
        r.parentElement.style.setProperty("--radio-color", r === radio ? "#DF7702" : "transparent");
      });
    }
  });
});


  // Población de selects de años
  populateYearSelect("year");
  populateYearSelect("year-combined");

  const validateAndCalculate = (activeTab) => {
    let isValid = true;
    let numericValue;

    // Limpiar mensajes de error anteriores
    valueError.style.display = "none";
    valueCombinedError.style.display = "none";
    valueInput.style.border = "";
    valueCombinedInput.style.border = "";

    // Validar según la tab activa
    if (activeTab === "para-tu-bici") {
      // Validar el campo "Valor de tu bici"
      if (!valueInput.value) {
        valueInput.style.border = "2px solid red";
        document.getElementById("value-error").style.display = "block";
        isValid = false;
      } else {
        numericValue = parseInt(valueInput.value.replace(/\./g, ""), 10);
      }
    } else if (activeTab === "para-ti-y-tu-bici") {
      // Validar el campo "Valor de tu bici combinado"
      if (!valueCombinedInput.value) {
        valueCombinedInput.style.border = "2px solid red";
        document.getElementById("value-combined-error").style.display = "block";
        isValid = false;
      } else {
        numericValue = parseInt(valueCombinedInput.value.replace(/\./g, ""), 10);
      }
    }

    // Si no es válido, mostrar toast
    if (!isValid) {
      showToast(toast);
      return;
    }

    // Validar el valor según el rango
    const validationConfig = {
      "para-tu-bici": { min: 500000, max: 5000000 },
      "para-ti-y-tu-bici": { min: 500000, max: 5000000 },
    };

    const isValueValid = validateValue(numericValue, validationConfig[activeTab].min, validationConfig[activeTab].max);
    handleValidationResult(isValueValid, card2, cardThree, modal);

    // Reemplazar el valor en los spans reemplace_valueBici
    if (isValueValid) {
      const replaceValueElements = document.querySelectorAll(".reemplace_valueBici");
      replaceValueElements.forEach((element) => {
        element.textContent = `$ ${formatNumberWithDots(numericValue.toString())}`;
      });
    }
  };

  // Manejar el botón de cálculo
  calculateButton.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab.active").getAttribute("data-tab");
    validateAndCalculate(activeTab);

    let yearValue;
    let bikeValue;

    if (activeTab === "para-tu-bici") {
      yearValue = document.getElementById("year").value;
      bikeValue = valueInput.value
    } else if (activeTab === "para-ti-y-tu-bici") {
      yearValue = document.getElementById("year-combined").value;
      bikeValue = valueCombinedInput.value
    }

    if (yearValue && bikeValue) {
      urlSeguro = `https://positivapruebas.com.co/seguros/resumen-de-pago-mobile/?tab=${activeTab}&biciYear=${yearValue}&biciValue=${bikeValue}`;

      new QRious({
        element: document.getElementById("qr-code"),
        value: urlSeguro,
      });
    }
  });

  // ! Close Modal Validation
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Cerrar el modal si se hace clic fuera de él
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("active");
    }
  });

  function populateServiceList(services, elementId) {
    const ul = document.getElementById(elementId);
    services.forEach((service) => {
      const li = document.createElement("li");
      li.innerHTML = `<img src="${heartIconUrl}" alt="Heart icon"> ${service}`;
      ul.appendChild(li);
    });
  }

  populateServiceList(maintenanceServices, "maintenanceServices");
  populateServiceList(cyclistServices, "cyclistServices");

  // ! Close Modal Premium
  btn.addEventListener("click", () => {
    modal2.classList.add("active");
  });

  closeModalPremium.addEventListener("click", () => {
    modal2.classList.remove("active");
  });

  window.onclick = function (event) {
    if (event.target == modal2) {
      modal2.classList.remove("active");
    }
  };

  btnSeguro.addEventListener("click", function () {
    console.log(urlSeguro);
    this.href = urlSeguro;
  });

  const texto = document.getElementById("text-anual");

  function handleMediaQuery(e) {
    if (e.matches) {
      texto.textContent = "Total a pagar anual";
    } else {
      texto.textContent = "Anuales";
    }
  }

  handleMediaQuery(mediaQuery);
  mediaQuery.addEventListener("change", handleMediaQuery);

});