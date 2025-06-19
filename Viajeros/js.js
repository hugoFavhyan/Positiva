// #region FUNCIONES DE UTILIDAD
/**
 * Una función de utilidad para formatear una cadena de fecha (YYYY-MM-DD) a DD/MM/YYYY.
 * @param {string} dateString - La cadena de fecha en formato燜YYY-MM-DD.
 * @returns {string} La cadena de fecha formateada.
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
// #endregion

// #region DEFINICIÓN DE CLASES

/**
 * Gestiona todos los diálogos modales (ventanas emergentes) en la aplicación.
 * Se encarga de mostrar, ocultar y configurar los eventos para cerrar los modales.
 */
class ModalManager {
  /**
   * Inicializa el ModalManager identificando todos los elementos modales y sus botones de cierre en el HTML.
   */
  constructor() {
    this.modals = {
      success: this._createModal("successModal", "closeModalSuccess"),
      error: this._createModal("errorModal", "closeModalerrorModal"),
      age: this._createModal("ageModal", "closeModalAgeAdults"),
      ageChildren: this._createModal("ageModalChildren", "closeModalAgeChildren"),
      ageRange: this._createModal("ageRangeModal", "closeModalAgeRange"),
      sixMonths: this._createModal("modalSixMonths", "closeModalSixMonths"),
      errorCupon: this._createModal("errorCuponModal", "closeModalErrorCuponModal"),
      maxViajeros: this._createModal("MaxViajerosModal", "closeMaxViajerosModal"),
      emailValidation: this._createModal("emailValidatedError", "closeEmailValidatedError"),
      emailStructure: this._createModal("emailValidatedStructureError", "closeemailValidatedStructureError"),
      acceptTerms: this._createModal("AcceptTermsError", "closeAcceptTermsError"),
      dateDoc: this._createModal("DateDocModal", "closeDateDocModal"),
      toast: this._createModal("toast", "closeModaltToast"),
    };
    this._initializeCloseEvents();
  }

  /**
   * Método interno para crear un objeto modal.
   * Asocia un ID de modal con su botón de cierre y define cómo mostrarlo y ocultarlo.
   * @param {string} modalId - El ID del contenedor del modal en el HTML.
   * @param {string} closeId - El ID del botón para cerrar ese modal.
   * @returns {object|null} Un objeto que controla el modal, o null si no se encuentra el elemento.
   * @private
   */
  _createModal(modalId, closeId) {
    const element = document.getElementById(modalId);
    const closeButton = document.getElementById(closeId);
    if (!element) {
      console.error(`Elemento modal con ID "${modalId}" no encontrado.`);
      return null;
    }
    return {
      element,
      closeButton,
      show: () => (element.style.display = "flex"),
      hide: () => (element.style.display = "none"),
    };
  }

  /**
   * Agrega los eventos de clic a todos los botones de cierre de los modales.
   * @private
   */
  _initializeCloseEvents() {
    for (const key in this.modals) {
      const modal = this.modals[key];
      if (modal && modal.closeButton) {
        modal.closeButton.addEventListener("click", () => modal.hide());
      }
    }
  }

  /**
   * Muestra un modal específico por su nombre.
   * @param {string} modalName - El nombre del modal a mostrar (ej. 'success', 'error').
   */
  show(modalName) {
    if (this.modals[modalName]) {
      this.modals[modalName].show();
    } else {
      console.error(`Modal "${modalName}" no está registrado.`);
    }
  }

  /**
   * Oculta un modal específico por su nombre.
   * @param {string} modalName - El nombre del modal a ocultar.
   */
  hide(modalName) {
    if (this.modals[modalName]) {
      this.modals[modalName].hide();
    } else {
      console.error(`Modal "${modalName}" no está registrado.`);
    }
  }

  /**
   * Muestra una notificación "toast" (un mensaje breve) y la oculta automáticamente.
   */
  showToast() {
    this.show("toast");
    setTimeout(() => this.hide("toast"), 4000);
  }
}

/**
 * Gestiona la navegación y la lógica del formulario de múltiples pasos.
 */
class FormStepper {
  constructor() {
    this.DOMstrings = {
      stepsBtns: document.querySelectorAll(".multisteps-form__progress-btn"),
      stepsForm: document.querySelector(".multisteps-form__form"),
      stepFormPanels: document.querySelectorAll(".multisteps-form__panel"),
      stepPrevBtnClass: "js-btn-prev",
      stepNextBtnClass: "js-btn-next",
    };
    this.activePanelNum = 0; // El panel activo comienza en el índice 0
  }

  /**
   * Configura todos los listeners de eventos para el stepper.
   * @param {function} onNextStepCallback - Una función que se ejecuta antes de pasar al siguiente paso, usada para validación.
   */
  initialize(onNextStepCallback = () => true) {
    // Listener para los botones de "Siguiente" y "Anterior".
    this.DOMstrings.stepsForm.addEventListener("click", (e) => {
      const target = e.target;
      const isNext = target.classList.contains(this.DOMstrings.stepNextBtnClass);
      const isPrev = target.classList.contains(this.DOMstrings.stepPrevBtnClass);

      if (!isNext && !isPrev) {
        return;
      }

      // Ejecuta la validación solo si se está avanzando.
      if (isNext && !onNextStepCallback(this.activePanelNum)) {
        return; // Detiene el avance si la validación falla.
      }

      // Actualiza el número del panel activo.
      this.activePanelNum = isNext ? this.activePanelNum + 1 : this.activePanelNum - 1;
      this.setActivePanel(this.activePanelNum);
      this.setActiveStep(this.activePanelNum);
    });

    // Ajusta la altura del formulario al cargar y al redimensionar la ventana.
    window.addEventListener("load", () => this._setFormHeight(), false);
    window.addEventListener("resize", () => this._setFormHeight(), false);
  }

  /**
   * Ajusta la altura del contenedor del formulario para que coincida con la del panel activo.
   * @private
   */
  _setFormHeight() {
    const activePanel = this.DOMstrings.stepFormPanels[this.activePanelNum];
    if (activePanel) {
      this.DOMstrings.stepsForm.style.height = `${activePanel.offsetHeight}px`;
    }
  }

  /**
   * Activa el botón del paso actual y todos los anteriores.
   * @param {number} activeStepNum - El índice del paso a activar.
   */
  setActiveStep(activeStepNum) {
    this.DOMstrings.stepsBtns.forEach((elem, index) => {
      elem.classList.toggle("js-active", index <= activeStepNum);
    });
  }

  /**
   * Muestra el panel del formulario correspondiente al paso actual.
   * @param {number} activePanelNum - El índice del panel a mostrar.
   */
  setActivePanel(activePanelNum) {
    this.DOMstrings.stepFormPanels.forEach((elem, index) => {
      elem.classList.toggle("js-active", index === activePanelNum);
    });
    this._setFormHeight(); // Reajusta la altura después de cambiar de panel.
  }
}

/**
 * Maneja toda la lógica relacionada con la validación de los formularios.
 */
class FormValidator {
  constructor(modalManager, travelerManager, quoteManager) {
    this.modalManager = modalManager;
    this.travelerManager = travelerManager;
    this.quoteManager = quoteManager;
  }

  /**
   * Valida el formulario de cotización inicial (paso 0).
   * @returns {boolean} Verdadero si el formulario es válido, de lo contrario falso.
   */
  validateStep0() {
    let isValid = true;
    // Valida que los campos requeridos no estén vacíos.
    if (!this._validateRequiredFields(".required")) {
      isValid = false;
    }
    // Valida que se haya seleccionado al menos un viajero.
    if (this.travelerManager.getTotalTravelers() === 0) {
      document.getElementById("viajeros-input").classList.add("error-border");
      isValid = false;
    }
    // Valida que el checkbox de términos y condiciones esté marcado.
    if (!this._validateCheckbox("#accept", ".radioContainer")) {
      this.modalManager.show("acceptTerms");
      isValid = false;
    }
    // Valida que el cupón, si se ingresó, sea válido.
    if (!this.validateCoupon()) {
      this.modalManager.show("errorCupon");
      isValid = false;
    }
    // Si algo falló, muestra una notificación general.
    if (!isValid) {
      this.modalManager.showToast();
    }
    return isValid;
  }

  /**
   * Valida el formulario de información de viajeros (paso 2).
   * @returns {boolean} Verdadero si el formulario es válido, de lo contrario falso.
   */
  validateStep2() {
    let isValid = true;

    if (!this._validateRequiredFields(".required2")) isValid = false;
    if (!this._validateAgeFromBirthDate()) {
      this.modalManager.show("ageRange");
      isValid = false;
    }
    if (!this._validateCheckbox("#accept2", ".radioContainer2")) {
      this.modalManager.show("acceptTerms");
      isValid = false;
    }
    if (!this._validateAllEmails()) {
      this.modalManager.show("emailValidation");
      isValid = false;
    }
    if (!this._validatePhoneInputs()) isValid = false;

    // Muestra una notificación si la validación falla y no hay otro modal más específico visible.
    if (!isValid) {
      const specificModalsVisible = ['age', 'acceptTerms', 'emailValidation'].some(modalName => {
        const modal = this.modalManager.modals[modalName];
        return modal && modal.element && modal.element.style.display === 'flex';
      });

      if (!specificModalsVisible) {
        this.modalManager.showToast();
      }
    }

    return isValid;
  }

  /**
   * Valida el código del cupón de descuento.
   * @returns {boolean} Verdadero si el cupón es válido o si el campo está vacío.
   */
  validateCoupon() {
    const couponInput = document.getElementById("codecupponID");
    const couponCode = couponInput.value.trim().toUpperCase();
    if (couponCode === "") return true; // Es válido no ingresar un cupón.
    return this.quoteManager.isValidCoupon(couponCode);
  }

  /**
   * Valida todos los campos que tengan un selector CSS específico.
   * Muestra un mensaje de error si el campo está vacío.
   * @param {string} selector - El selector CSS para los campos a validar.
   * @returns {boolean} Verdadero si todos los campos son válidos.
   * @private
   */
  _validateRequiredFields(selector) {
    let isValid = true;
    document.querySelectorAll(selector).forEach(field => {
      const isFilled = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
      field.classList.toggle('error-border', !isFilled);

      // Busca el mensaje de error "hermano" o dentro del padre.
      const errorMsg = field.closest('.form-row-formViajeros, .input-date, .cuppon, .radioContainer')?.querySelector('.required-error');
      if (errorMsg) {
        errorMsg.style.display = isFilled ? 'none' : 'block';
      }
      if (!isFilled) isValid = false;
    });
    return isValid;
  }

  /**
   * Valida un checkbox específico.
   * @param {string} selector - El selector del checkbox.
   * @param {string} containerSelector - El selector del contenedor del checkbox para aplicar el borde de error.
   * @returns {boolean} Verdadero si el checkbox está marcado.
   * @private
   */
  _validateCheckbox(selector, containerSelector) {
    const checkbox = document.querySelector(selector);
    const container = document.querySelector(containerSelector);
    const isValid = checkbox.checked;
    container.classList.toggle('error-border', !isValid);
    return isValid;
  }

  /**
   * Valida que todos los campos de correo electrónico tengan un formato válido y que los correos de confirmación coincidan.
   * @returns {boolean} Verdadero si todos los correos son válidos.
   * @private
   */
  _validateAllEmails() {
    let allEmailsValid = true;
    const emailFields = document.querySelectorAll('input[type="email"].required2');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailFields.forEach(field => {
      if (!emailRegex.test(field.value.trim())) {
        field.classList.add('error-border');
        allEmailsValid = false;
      } else {
        field.classList.remove('error-border');
      }
    });

    // Valida que el email y su confirmación coincidan.
    document.querySelectorAll('[data-email-confirm]').forEach(confirmField => {
      const emailField = document.getElementById(confirmField.dataset.emailConfirm);
      if (emailField && confirmField.value !== emailField.value) {
        emailField.classList.add('error-border');
        confirmField.classList.add('error-border');
        const errorMsg = confirmField.closest('.form-row-formViajeros').querySelector('.email-match-error');
        if (errorMsg) errorMsg.style.display = 'block';
        allEmailsValid = false;
      } else if (emailField) {
        const errorMsg = confirmField.closest('.form-row-formViajeros').querySelector('.email-match-error');
        if (errorMsg) errorMsg.style.display = 'none';
      }
    });

    return allEmailsValid;
  }

  /**
   * Valida que los campos de teléfono tengan al menos 10 dígitos.
   * @returns {boolean} Verdadero si todos los teléfonos son válidos.
   * @private
   */
  _validatePhoneInputs() {
    let isValid = true;
    document.querySelectorAll('input[type="tel"]').forEach(input => {
      const phone = input.value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito.
      if (phone.length < 10) {
        input.classList.add('error-border');
        isValid = false;
      } else {
        input.classList.remove('error-border');
      }
    });
    return isValid;
  }

  /**
   * Valida que la edad del viajero, calculada desde su fecha de nacimiento, esté entre 15 y 65 años.
   * @returns {boolean} Verdadero si todas las edades son válidas.
   * @private
   */
  _validateAgeFromBirthDate() {
    let allAgesValid = true;
    document.querySelectorAll('input[type="date"][id$="DateBirthInput"].required2').forEach(field => {
      const birthDateString = field.value;
      const ageErrorMsg = field.parentElement.querySelector('.age-error');
      const requiredErrorMsg = field.parentElement.querySelector('.required-error');

      if (ageErrorMsg) ageErrorMsg.style.display = 'none';

      if (!birthDateString) {
        if (requiredErrorMsg) requiredErrorMsg.style.display = 'block';
        allAgesValid = false;
        return;
      } else {
        if (requiredErrorMsg) requiredErrorMsg.style.display = 'none';
      }

      const birthDate = new Date(birthDateString + "T00:00:00");
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 15 || age > 65) {
        field.classList.add('error-border');
        if (ageErrorMsg) ageErrorMsg.style.display = 'block';
        allAgesValid = false;
      } else {
        field.classList.remove('error-border');
        if (ageErrorMsg) ageErrorMsg.style.display = 'none';
      }
    });
    return allAgesValid;
  }
}

/**
 * Gestiona la selección del número de viajeros y sus edades.
 */
class TravelerManager {
  constructor(modalManager) {
    this.modalManager = modalManager;
    this.dom = {
      adultCount: document.getElementById('adultCount'),
      minorCount: document.getElementById('minorCount'),
      summary: document.getElementById('travelersSummary'),
      agesContainer: document.getElementById('agesContainer'),
      viajerosInput: document.getElementById('viajeros-input'),
      travelersOptions: document.getElementById('travelersOptions'),
      incrementButtons: document.querySelectorAll('.increment-btn'),
      decrementButtons: document.querySelectorAll('.decrement-btn'),
      clearButton: document.querySelector('.clean-btn-travelers'),
      applyButton: document.querySelector('.apply-btn-travelers'),
    };
  }

  /**
   * Inicializa los listeners de eventos para los controles de viajeros.
   * @param {function} onApplyCallback - Función a ejecutar cuando se hace clic en "Aplicar".
   */
  initialize(onApplyCallback) {
    this.dom.incrementButtons.forEach(btn => btn.addEventListener('click', e => this._changeCount(e, 1)));
    this.dom.decrementButtons.forEach(btn => btn.addEventListener('click', e => this._changeCount(e, -1)));
    this.dom.clearButton.addEventListener('click', () => this.clear());
    this.dom.viajerosInput.addEventListener('click', () => {
      this.toggleOptions();
      // Quita el borde rojo al abrir el selector
      this.dom.viajerosInput.classList.remove('error-border');
    });
    this.dom.applyButton.addEventListener('click', () => {
      if (this._validateAges()) {
        this.toggleOptions();
        onApplyCallback();
      }
    });

    // Cierra el desplegable si se hace clic fuera de él.
    document.addEventListener('click', (event) => {
      if (!document.getElementById('viajerosSelect').contains(event.target)) {
        this.dom.travelersOptions.style.display = 'none';
      }
    });
  }

  /**
   * Cambia el contador de adultos o menores.
   * @param {Event} event - El evento del clic.
   * @param {number} delta - El cambio a aplicar (+1 o -1).
   * @private
   */
  _changeCount(event, delta) {
    const counterId = event.target.getAttribute('data-counter');
    const counterEl = document.getElementById(counterId);
    let count = parseInt(counterEl.textContent, 10) + delta;
    if (count >= 0) {
      counterEl.textContent = count;
    }
    this.update();
  }

  /**
   * Actualiza la UI de viajeros (resumen y campos de edad).
   */
  update() {
    this._updateSummary();
    this._updateAgesUI();
    this._checkMaxTravelers();
  }

  /**
   * Actualiza el texto que muestra el total de viajeros.
   * @private
   */
  _updateSummary() {
    const total = this.getTotalTravelers();
    this.dom.summary.textContent = total > 0 ? `${total} personas` : 'Seleccione';
  }

  /**
   * Crea y muestra los campos para ingresar las edades de los viajeros.
   * @private
   */
  _updateAgesUI() {
    this.dom.agesContainer.innerHTML = '';
    const total = this.getTotalTravelers();
    if (total === 0) return;

    const title = document.createElement('label');
    title.textContent = 'Edades de los viajeros:';
    this.dom.agesContainer.appendChild(title);

    const rowContainer = document.createElement('div');
    rowContainer.className = 'rowContainerInput';
    this.dom.agesContainer.appendChild(rowContainer);

    for (let i = 1; i <= total; i++) {
      const isAdult = i <= this.getAdultCount();
      rowContainer.appendChild(this._createAgeInput(i, isAdult));
    }
  }

  /**
   * Crea un campo de entrada para la edad de un viajero.
   * @param {number} travelerNumber - El número del viajero.
   * @param {boolean} isAdult - Verdadero si el viajero es un adulto.
   * @returns {HTMLElement} El contenedor del campo de edad.
   * @private
   */
  _createAgeInput(travelerNumber, isAdult) {
    const ageContainer = document.createElement('div');
    ageContainer.className = 'ageDivInput';

    const label = document.createElement('label');
    label.innerHTML = `<span> Viajero ${travelerNumber} </span>`;
    ageContainer.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
    input.min = isAdult ? '18' : '0';
    input.max = isAdult ? '65' : '17';
    input.placeholder = isAdult ? '18-65' : '0-17';
    input.className = isAdult ? 'age-input age-adults' : 'age-input age-children';
    ageContainer.appendChild(input);

    return ageContainer;
  }

  /**
   * Valida que las edades ingresadas estén dentro de los rangos permitidos.
   * @returns {boolean} Verdadero si todas las edades son válidas.
   * @private
   */
  _validateAges() {
    let isValid = true;
    document.querySelectorAll('.age-input').forEach(input => {
      const age = parseInt(input.value, 10);
      const min = parseInt(input.min, 10);
      const max = parseInt(input.max, 10);
      if (isNaN(age) || age < min || age > max) {
        isValid = false;
        input.classList.add('error-border');
        const modalToShow = input.classList.contains('age-adults') ? 'age' : 'ageChildren';
        this.modalManager.show(modalToShow);
      } else {
        input.classList.remove('error-border');
      }
    });
    return isValid;
  }

  /**
   * Verifica si se ha excedido el número máximo de viajeros (10).
   * @private
   */
  _checkMaxTravelers() {
    if (this.getTotalTravelers() > 10) {
      this.modalManager.show('maxViajeros');
      this.clear(); // Resetea los contadores.
    }
  }

  /**
   * Limpia y resetea la selección de viajeros.
   */
  clear() {
    this.dom.adultCount.textContent = '0';
    this.dom.minorCount.textContent = '0';
    this.update();
  }

  /**
   * Muestra u oculta el desplegable de selección de viajeros.
   */
  toggleOptions() {
    this.dom.travelersOptions.style.display = this.dom.travelersOptions.style.display === 'block' ? 'none' : 'block';
  }

  getAdultCount() { return parseInt(this.dom.adultCount.textContent, 10) || 0; }
  getMinorCount() { return parseInt(this.dom.minorCount.textContent, 10) || 0; }
  getTotalTravelers() { return this.getAdultCount() + this.getMinorCount(); }
}

/**
 * Maneja la lógica de cotización, el carrito de compras y la generación de formularios de viajero.
 */
class QuoteManager {
  constructor() {
    // Cupones de descuento válidos.
    this.validCoupons = [
      { code: "DESCUENTO10", discount: 10 },
      { code: "DESCUENTO20", discount: 20 },
      { code: "PRUEBA30", discount: 30 },
      { code: "PROMO50", discount: 50 },
    ];
    this.dom = {
      cart: document.querySelector(".min-cart"),
      totalSummary: document.querySelector(".TotalSumary"),
      formContainer: document.getElementById("formContainer"),
      voucherContainer: document.getElementById('formContainerVoucher'),
      headerIda: document.getElementById('headerIda'),
      headerVuelta: document.getElementById('headerVuelta'),
    };
    this.codeReference = "2345610928";
  }

  /**
   * Actualiza toda la información del carrito y el resumen de la cotización.
   * @param {TravelerManager} travelerManager - La instancia del gestor de viajeros.
   */
  updateCartInfo(travelerManager) {
    const adultCount = travelerManager.getAdultCount();
    const minorCount = travelerManager.getMinorCount();
    const selectOrigen = document.getElementById("origenID");
    const selectDestino = document.getElementById("destinoID");
    const dateStart = document.getElementById('dateStart');
    const dateEnd = document.getElementById('dateEnd');
    const selectedPlan = document.querySelector('input[name="TipoPlan"]:checked');

    if (!selectedPlan) return;

    const formattedDateStart = formatDate(dateStart.value);
    const formattedDateEnd = formatDate(dateEnd.value);

    let destinoPlan = selectDestino?.value === "Nacional" ? "Nacional" : "Internacional";

    const planCost = parseFloat(selectedPlan.value) || 0;
    const adultSubTotal = adultCount * planCost;
    const minorSubTotal = minorCount * planCost;
    const subtotal = adultSubTotal + minorSubTotal;

    const couponInput = document.getElementById("codecupponID");
    const couponCode = couponInput?.value.trim().toUpperCase() || "";
    const coupon = this.validCoupons.find(c => c.code === couponCode);
    const discountPercentage = coupon ? coupon.discount : 0;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const finalCost = subtotal - discountAmount;

    // Llama a los métodos internos para renderizar cada parte de la UI.
    this._renderCart(subtotal, discountAmount, finalCost, adultCount, minorCount, discountPercentage, adultSubTotal, minorSubTotal, destinoPlan);
    this._renderSummary(finalCost, selectedPlan.id, formattedDateStart, formattedDateEnd, discountPercentage, travelerManager);
    this._updateHeaders(selectOrigen?.value, selectDestino?.value);
  }

  /**
   * Muestra el descuento aplicado directamente en las tarjetas de los planes.
   * @private
   */
  _mostrarDescuentoEnTarjetas() {
    const couponInput = document.getElementById("codecupponID");
    const couponCode = couponInput?.value.trim().toUpperCase() || "";
    const coupon = this.validCoupons.find(c => c.code === couponCode);
    const discountPercentage = coupon ? coupon.discount : 0;
    const mensajeDescuento = discountPercentage > 0 ? `Descuento del ${discountPercentage}%` : "";

    document.getElementById("descuentoCardPlan1").textContent = mensajeDescuento;
    document.getElementById("descuentoCardPlan2").textContent = mensajeDescuento;
  }

  /**
   * Renderiza el contenido del carrito de compras en el Paso 2.
   * @private
   */
  _renderCart(subtotal, discountAmount, finalCost, adultCount, minorCount, discountPercentage, adultSubTotal, minorSubTotal, destinoPlan) {
    const adultTextHTML = adultCount > 0 ? `<tr><th>${destinoPlan} x ${adultCount} adulto${adultCount > 1 ? "s" : ""}</th><th>COP ${adultSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
    const minorTextHTML = minorCount > 0 ? `<tr><th>${destinoPlan} x ${minorCount} menor${minorCount > 1 ? "es" : ""} de edad</th><th>COP ${minorSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
    const discountHTML = discountAmount > 0 ? `<tr><td>Descuento ${discountPercentage}%</td><td>-COP ${discountAmount.toLocaleString("es-CO")}</td></tr>` : "";

    let cartHTML = `<table style="margin-top: 15px">
      <tbody>
        ${adultTextHTML}
        ${minorTextHTML}
        <tr><td>Subtotal</td><td>COP ${subtotal.toLocaleString('es-CO')}</td></tr>
        ${discountHTML}
        <tr><td><b>TOTAL</b></td><td><b>COP ${finalCost.toLocaleString('es-CO')}</b></td></tr>
      </tbody>
    </table>`;

    if (this.dom.cart) this.dom.cart.innerHTML = cartHTML;
  }

  /**
   * Renderiza el resumen completo de la compra en el Paso 3.
   * @private
   */
  /**
   * Renderiza el resumen completo de la compra en el Paso 3.
   * @private
   */
  _renderSummary(finalCost, selectedPlanId, formattedDateStart, formattedDateEnd, discountPercentage, travelerManager) {
    if (!this.dom.totalSummary) return;

    // Recalcula valores necesarios para el carrito.
    const adultCount = travelerManager.getAdultCount();
    const minorCount = travelerManager.getMinorCount();
    const destinoPlan = document.getElementById("destinoID")?.value === "Nacional" ? "Nacional" : "Internacional";
    const selectedPlanInput = document.querySelector('input[name="TipoPlan"]:checked');
    const planCost = selectedPlanInput ? parseFloat(selectedPlanInput.value) : 0;
    const adultSubTotal = adultCount * planCost;
    const minorSubTotal = minorCount * planCost;
    const subtotal = adultSubTotal + minorSubTotal;
    const discountAmount = (subtotal * discountPercentage) / 100;

    // Construye la tabla del carrito para el resumen.
    const adultTextHTML = adultCount > 0 ? `<tr><th>${destinoPlan} x ${adultCount} adulto${adultCount > 1 ? "s" : ""}</th><th>COP ${adultSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
    const minorTextHTML = minorCount > 0 ? `<tr><th>${destinoPlan} x ${minorCount} menor${minorCount > 1 ? "es" : ""} de edad</th><th>COP ${minorSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
    const discountHTML = discountAmount > 0 ? `<tr><td>Descuento ${discountPercentage}%</td><td>-COP ${discountAmount.toLocaleString("es-CO")}</td></tr>` : "";
    const cartHTML = `<table style="margin-top: 15px"><tbody>${adultTextHTML}${minorTextHTML}<tr><td>Subtotal</td><td>COP ${subtotal.toLocaleString('es-CO')}</td></tr>${discountHTML}<tr><td><b>TOTAL</b></td><td><b>COP ${finalCost.toLocaleString('es-CO')}</b></td></tr></tbody></table>`;

    // --- INICIO DE LA CORRECCIÓN DEFINITIVA ---
    const planElement = document.getElementById(selectedPlanId);
    const planCard = planElement?.nextElementSibling;
    const h3Element = planCard?.querySelector('h3');

    let planName = "seleccionado"; // Valor por defecto

    if (h3Element) {
        // Usamos .textContent que es más confiable para obtener el texto crudo.
        // Luego, .trim() quita espacios al inicio/final y .replace() limpia los saltos de línea y espacios múltiples.
        planName = h3Element.textContent.trim().replace(/\s+/g, ' ');
    }
    // --- FIN DE LA CORRECCIÓN DEFINITIVA ---

    // Construye el HTML final para el resumen del Paso 3.
    this.dom.totalSummary.innerHTML = `
        <div class="form-row-border-viajeros">
            <div class="flex"><h3 class="multisteps-form__title">Resumen de <span style="color: #ff7500">compra</span></h3></div>
            <div class="min-cart">
                <ul>
                    <li>La vigencia para su seguro de viaje va desde el ${formattedDateStart} al ${formattedDateEnd}.</li>
                    <li>El tipo de plan que usted ha seleccionado es: <strong>${planName}</strong>.</li>
                    <li>El valor a pagar por su compra con el descuento aplicado es de <strong>COP ${finalCost.toLocaleString("es-CO")}</strong>.</li>
                </ul>
            </div>
        </div>
        <div class="form-row-border-viajeros carrito-viajeros">
            <div class="flex">
                <img src="https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402997/carrito.svg" alt="" style="margin-right: 10px" />
                <div>
                    <h3 class="multisteps-form__title">Tu <span style="color: #ff7500">carrito</span></h3>
                    <span class="vigency-data">Vigencia del ${formattedDateStart} al ${formattedDateEnd}</span>
                </div>
            </div>
            <div class="min-cart">${cartHTML}</div>
        </div>
    `;
  }
  /**
   * Actualiza los encabezados de Origen y Destino.
   * @private
   */
  _updateHeaders(origen, destino) {
    if (this.dom.headerIda) this.dom.headerIda.querySelector('span').textContent = `${origen} - ${destino}`;
    if (this.dom.headerVuelta) this.dom.headerVuelta.querySelector('span').textContent = `${destino} - ${origen}`;
  }

  /**
   * Genera dinámicamente los formularios para cada viajero.
   * @param {TravelerManager} travelerManager - La instancia del gestor de viajeros.
   */
  generateTravelerForms(travelerManager) {
    this.dom.formContainer.innerHTML = '';
    this.dom.voucherContainer.innerHTML = '';
    const adultCount = travelerManager.getAdultCount();
    const minorCount = travelerManager.getMinorCount();
    let travelerNumber = 1;

    // Crea formularios para adultos.
    for (let i = 1; i <= adultCount; i++) {
      this.dom.formContainer.appendChild(this._createForm('adult', travelerNumber, i === 1));
      travelerNumber++;
    }

    // Si solo hay menores, crea un formulario para un adulto responsable.
    if (minorCount > 0 && adultCount === 0) {
      this.dom.formContainer.appendChild(this._createForm('responsible', 0, true));
    }

    // Crea formularios para menores.
    for (let i = 1; i <= minorCount; i++) {
      this.dom.formContainer.appendChild(this._createForm('minor', travelerNumber, false));
      travelerNumber++;
    }

    // Si hay viajeros, crea el formulario del voucher.
    if (adultCount > 0 || minorCount > 0) {
      this.dom.voucherContainer.innerHTML = this._createVoucherForm(adultCount > 0, adultCount);
      this._attachVoucherListener();
    }
  }

  /**
   * Configura el listener para el selector de quién recibe el voucher.
   * Autocompleta los datos del voucher basados en la selección.
   * @private
   */
  _attachVoucherListener() {
    const nameVoucherSelect = document.getElementById('nameVoucherInput');
    if (!nameVoucherSelect) return;

    nameVoucherSelect.addEventListener('change', () => {
      const selectedValue = nameVoucherSelect.value;
      const voucherEmailInput = document.getElementById('voucherEmailInput');
      const voucherConfirmEmailInput = document.getElementById('voucherConfirmEmailInput');
      const voucherNumberInput = document.getElementById('voucherNumberInput');

      if (!selectedValue) {
        voucherEmailInput.value = '';
        voucherConfirmEmailInput.value = '';
        voucherNumberInput.value = '';
        return;
      }

      let sourceEmailId, sourcePhoneId;
      if (selectedValue === 'No-Viajero') {
        sourceEmailId = 'ResponsableMenoremailInput';
        sourcePhoneId = 'ResponsableMenornumberInput';
      } else {
        const travelerNumber = selectedValue.replace('Viajero ', '');
        sourceEmailId = `${travelerNumber}emailInput`;
        sourcePhoneId = `${travelerNumber}numberInput`;
      }

      const sourceEmailInput = document.getElementById(sourceEmailId);
      const sourcePhoneInput = document.getElementById(sourcePhoneId);

      voucherEmailInput.value = sourceEmailInput ? sourceEmailInput.value : '';
      voucherConfirmEmailInput.value = sourceEmailInput ? sourceEmailInput.value : '';
      voucherNumberInput.value = sourcePhoneInput ? sourcePhoneInput.value : '';
    });
  }

  /**
   * Crea el HTML para el formulario de un viajero y AÑADE LOS LISTENERS DE VALIDACIÓN EN TIEMPO REAL.
   * @returns {HTMLElement} El elemento div del formulario.
   * @private
   */
  _createForm(type, number, isPrincipal) {
    const formDiv = document.createElement('div');
    // ... (lógica de prefijos y títulos igual que antes)
    let title, subtitle, idPrefix;
    switch (type) {
      case 'adult':
        title = `Viajero ${number} ${isPrincipal ? '<span style="color: #ff7500;">principal</span>' : ''}`;
        subtitle = 'Mayor de edad';
        idPrefix = `${number}`;
        break;
      case 'minor':
        title = `Viajero ${number}`;
        subtitle = 'Menor de edad';
        idPrefix = `${number}Menor`;
        break;
      case 'responsible':
        title = 'No viajero <span style="color: #ff7500;">mayor de edad</span>';
        subtitle = 'Mayor de edad';
        idPrefix = 'ResponsableMenor';
        break;
    }

    formDiv.className = `acordeon__item form-${type}`;
    formDiv.innerHTML = `
        <input type="radio" name="acordeon" class="acordeon-input" id="${type}${number}" ${isPrincipal ? "checked" : ""}>
        <label for="${type}${number}" class="acordeon__titulo flex">
            <img src="https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402997/person.svg" alt="" style="margin-right: 10px; width: 15px;">
            <div><h3 style="margin: 0;">${title}</h3><p style="margin: 0; color: #7E7F80;">${subtitle}</p></div>
        </label>
        <div class="acordeon__contenido">
            <div class="form-grid">
                <div class="form-row-formViajeros"><label>Tipo de documento *</label><select id="${idPrefix}documentoID" class="selectcontainer small-input required2"><option value="CC">Nacional</option><option value="CE">Extranjera</option></select><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p></div>
                <div class="form-row-formViajeros"><label>Numero de documento *</label><input type="number" class="selectcontainer small-input required2"><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p></div>
            </div>
            <div class="input-date" style="margin-top: 10px;"><label>Fecha de ${type === 'minor' ? 'vencimiento' : 'expedición'} del documento *</label><input type="date" class="selectcontainer small-input required2"><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p></div>
            <div class="form-grid">
                <div class="form-row-formViajeros"><label>Nombre *</label><input type="text" id="${idPrefix}nameInput" placeholder="Ingrese" class="required2" /><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p></div>
                <div class="form-row-formViajeros"><label>Apellidos *</label><input type="text" placeholder="Ingrese" class="required2" /><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p></div>
            </div>
            <div class="form-grid">
                <div class="form-row-formViajeros"><label>Fecha de nacimiento *</label><input type="date" id="${idPrefix}DateBirthInput" class="required2" /><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p><p class="error-message-viajeros age-error" style="display:none;">No cumples con el rango de edad.</p></div>
                <div class="form-row-formViajeros"><label>Género *</label><select class="selectcontainer small-input required2"><option value="Hombre">Hombre</option><option value="Mujer">Mujer</option></select><p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p></div>
            </div>
            <div class="form-grid">
                <div class="form-row-formViajeros">
                    <label>Correo electrónico *</label>
                    <input type="email" id="${idPrefix}emailInput" placeholder="Ingrese" class="required2" />
                    <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
                </div>
                <div class="form-row-formViajeros">
                    <label>Confirma tu correo electrónico *</label>
                    <input type="email" data-email-confirm="${idPrefix}emailInput" placeholder="Ingrese" class="required2" />
                    <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
                    <p class="error-message-viajeros email-match-error" style="display:none;">Los correos no coinciden</p>
                </div>
            </div>
            <div class="form-row-formViajeros">
                <label>Celular *</label>
                <input type="tel" id="${idPrefix}numberInput" placeholder="Celular" pattern="[0-9]{10,15}" maxlength="15" class="required2" />
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
            </div>
        </div>
    `;

    // ===== INICIO DE LA LÓGICA AGREGADA =====
    // Se buscan todos los campos dentro del formulario recién creado.
    const fields = formDiv.querySelectorAll('.required2');
    fields.forEach(field => {
      // Se determina el tipo de evento adecuado para cada campo.
      const eventType = (field.tagName.toLowerCase() === 'select' || field.type === 'date' || field.type === 'checkbox') ? 'change' : 'input';

      field.addEventListener(eventType, () => {
        let isFieldValid = true;
        const parentWrapper = field.closest('.form-row-formViajeros, .input-date');
        const requiredError = parentWrapper ? parentWrapper.querySelector('.required-error') : null;

        // 1. Validación de campo requerido
        if (field.value.trim() === '') {
          isFieldValid = false;
        } else if (requiredError) {
          requiredError.style.display = 'none';
        }

        // 2. Validación de edad (si es el campo de fecha de nacimiento)
        if (field.id.includes('DateBirthInput') && field.value) {
          const ageError = parentWrapper.querySelector('.age-error');
          const birthDate = new Date(field.value + "T00:00:00");
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 15 || age > 65) {
            isFieldValid = false;
          } else if (ageError) {
            ageError.style.display = 'none';
          }
        }

        // 3. Validación de coincidencia de correos
        if (field.hasAttribute('data-email-confirm')) {
          const emailField = document.getElementById(field.dataset.emailConfirm);
          const emailMatchError = parentWrapper.querySelector('.email-match-error');
          if (emailField && field.value && emailField.value !== field.value) {
            isFieldValid = false;
          } else if (emailMatchError) {
            emailMatchError.style.display = 'none';
          }
        }

        // Si el campo es válido, se quita el borde rojo.
        if (isFieldValid) {
          field.classList.remove('error-border');
        }
      });
    });
    // ===== FIN DE LA LÓGICA AGREGADA =====

    return formDiv;
  }

  /**
   * Crea el HTML para el formulario de información del voucher.
   * @returns {string} El HTML del formulario.
   * @private
   */
  _createVoucherForm(hasAdults, adultCount) {
    let optionsHTML = hasAdults
      ? Array.from({ length: adultCount }, (_, i) => `<option value="Viajero ${i + 1}">Viajero ${i + 1}</option>`).join('')
      : `<option value="No-Viajero">No viajero mayor de edad</option>`;

    return `
        <div class="flex">
            <img src="https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402997/billete-de-avion.svg" alt="" style="margin-right: 10px" />
            <div><h3 class="multisteps-form__title">Información del <span style="color: #ff7500">voucher</span></h3></div>
        </div>
        <div class="form-row-formViajeros"><label>¿Quién recibe el voucher? *</label><select id="nameVoucherInput" class="selectcontainer small-input required2"><option value="" hidden selected>Seleccione</option>${optionsHTML}</select></div>
        <div class="form-grid">
            <div class="form-row-formViajeros"><label>Correo electrónico *</label><input type="email" id="voucherEmailInput" placeholder="Ingrese" class="required2" /></div>
            <div class="form-row-formViajeros"><label>Confirma tu correo electrónico *</label><input type="email" id="voucherConfirmEmailInput" data-email-confirm="voucherEmailInput" placeholder="Ingrese" class="required2" /><p class="error-message-viajeros email-match-error" style="display:none;">los correos no coinciden</p></div>
        </div>
        <div class="form-row-formViajeros"><label>Celular *</label><input type="tel" id="voucherNumberInput" placeholder="Celular" class="required2" maxlength="15" pattern="[0-9]{10,15}" /></div>
    `;
  }

  /**
   * Verifica si un código de cupón es válido.
   * @param {string} couponCode - El código del cupón.
   * @returns {boolean} Verdadero si el cupón existe.
   */
  isValidCoupon(couponCode) {
    return this.validCoupons.some(c => c.code === couponCode.toUpperCase());
  }
}

// #endregion

// #region CLASE PRINCIPAL DE LA APLICACIÓN

/**
 * La clase principal de la aplicación.
 * Inicializa y orquesta todas las demás clases de gestión. Es el punto de entrada.
 */
class TravelerQuoteApp {
  constructor() {
    // Instancia todas las clases gestoras.
    this.modalManager = new ModalManager();
    this.travelerManager = new TravelerManager(this.modalManager);
    this.quoteManager = new QuoteManager();
    this.formValidator = new FormValidator(this.modalManager, this.travelerManager, this.quoteManager);
    this.formStepper = new FormStepper();
    // Inicia la aplicación.
    this.initializeApp();
  }

  /**
   * Inicializa la aplicación, configurando todos los listeners de eventos principales.
   */
  initializeApp() {
    this._setupInitialEventListeners();
    this.travelerManager.initialize(() => {
      // Cuando se aplica la selección de viajeros, se actualiza la cotización.
      this.quoteManager.updateCartInfo(this.travelerManager);
    });
    this.formStepper.initialize(step => this._handleStepChange(step));

    // Actualiza el carrito si se cambia la selección del plan.
    document.querySelectorAll("input[name='TipoPlan']").forEach(radio => {
      radio.addEventListener("change", () => {
        this.quoteManager.updateCartInfo(this.travelerManager);
      });
    });
  }

  /**
   * Configura los listeners de eventos iniciales del formulario principal.
   * @private
   */
  _setupInitialEventListeners() {
    document.getElementById("submit-button-travelers").addEventListener("click", () => this._startQuote());

    // Configuración de fechas y selectores estáticos del primer paso.
    const staticFields = document.querySelectorAll('#origenID, #destinoID, #dateStart, #dateEnd, #accept');
    staticFields.forEach(field => {
      field.addEventListener('change', () => {
        const isFilled = (field.type === 'checkbox' && field.checked) || (field.type !== 'checkbox' && field.value);
        if (isFilled) {
          // Para el checkbox, el contenedor es el que tiene el borde
          const targetElement = field.type === 'checkbox' ? field.closest('.radioContainer') : field;
          targetElement.classList.remove('error-border');

          // --- INICIO DE LA MODIFICACIÓN ---
          // Buscar y ocultar el mensaje de error asociado.
          const errorMsg = document.getElementById(`error-${field.id}`);
          if (errorMsg) {
            errorMsg.style.display = 'none';
          }
          // --- FIN DE LA MODIFICACIÓN ---
        }
      });
    });

    // Listeners específicos de fechas para calcular días y validar rango.
    const dateStartInput = document.getElementById("dateStart");
    const dateEndInput = document.getElementById("dateEnd");
    const today = new Date().toISOString().split("T")[0];
    dateStartInput.min = today;
    dateEndInput.min = today;
    dateStartInput.addEventListener("change", () => this._calculateDays());
    dateEndInput.addEventListener("change", () => this._calculateDays());

    dateEndInput.addEventListener("change", () => {
      const errorMessage = document.getElementById("error-message-dateEnd");
      if (dateStartInput.value && dateEndInput.value && new Date(dateEndInput.value) < new Date(dateStartInput.value)) {
        errorMessage.style.display = "block";
        dateEndInput.classList.add("error-border");
      } else {
        errorMessage.style.display = "none";
        // No se quita el borde aquí para no interferir con la validación de campo requerido.
      }
    });

    this._setupCountrySelectors();

    // Listeners para mostrar/ocultar detalles de los planes.
    document.getElementById('cbox1').addEventListener('change', (e) => this._togglePlanDetails(e.target, 'detailsHidden', 'detailsNational', 'detailsInternational'));
    document.getElementById('cbox2').addEventListener('change', (e) => this._togglePlanDetails(e.target, 'detailsHidden2', 'detailsNational2', 'detailsInternational2'));

    // Listener para el botón de finalizar compra.
    document.getElementById('enviarFormViajeros').addEventListener('click', (e) => {
      e.preventDefault();
      const termsCheckbox = document.getElementById('accept3');
      if (termsCheckbox.checked) {
        this.modalManager.show('success');
      } else {
        this.modalManager.show('acceptTerms');
      }
    });
  }

  /**
   * Inicia el proceso de cotización después de validar el primer paso.
   * @private
   */
  _startQuote() {
    if (this.formValidator.validateStep0()) {
      document.getElementById("defaultMessage").style.display = "none";
      document.getElementById("stepsContainer").style.display = "block";

      this.quoteManager._mostrarDescuentoEnTarjetas(); // Muestra el descuento en las tarjetas.
      this.quoteManager.updateCartInfo(this.travelerManager);
      this.quoteManager.generateTravelerForms(this.travelerManager);
      this.formStepper.setActivePanel(0);
      this.formStepper.setActiveStep(0);
    }
  }

  /**
   * Maneja la lógica de validación al cambiar de paso.
   * @param {number} currentStep - El paso actual desde el que se está saliendo.
   * @returns {boolean} Verdadero si la validación del paso es exitosa.
   * @private
   */
  _handleStepChange(currentStep) {
    if (currentStep === 1) { // Al salir del paso 2 (índice 1).
      return this.formValidator.validateStep2();
    }
    return true; // Para los demás pasos, no se requiere validación al avanzar.
  }

  /**
   * Calcula y muestra el número de días del viaje.
   * @private
   */
  _calculateDays() {
    const dateStartInput = document.getElementById("dateStart");
    const dateEndInput = document.getElementById("dateEnd");
    const daysLabel = document.getElementById("daysLabel");

    if (dateStartInput.value && dateEndInput.value) {
      const startDate = new Date(dateStartInput.value);
      const endDate = new Date(dateEndInput.value);

      if (endDate < startDate) {
        daysLabel.textContent = `Fecha inválida *`;
        return;
      }

      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1;
      daysLabel.textContent = `${differenceInDays} días *`;
      if (differenceInDays > 180) { // Límite de 6 meses
        this.modalManager.show("sixMonths");
        dateStartInput.value = '';
        dateEndInput.value = '';
        daysLabel.textContent = `0 días *`;
      }
    }
  }

  /**
   * Configura la lógica de los selectores de país de origen y destino.
   * @private
   */
  _setupCountrySelectors() {
    const mockupCountries = [
      { Pais: "Europa", CodigoPais: "Europa" }, { Pais: "Norteamérica", CodigoPais: "Norteamerica" },
      { Pais: "Caribe", CodigoPais: "Caribe" }, { Pais: "Sudamérica", CodigoPais: "Sudamerica" },
      { Pais: "África", CodigoPais: "africa" }, { Pais: "Asia", CodigoPais: "Asia" },
      { Pais: "Oceanía", CodigoPais: "Oceania" }, { Pais: "Nacional", CodigoPais: "Nacional" },
    ];
    const origenSelect = document.getElementById("origenID");
    const destinoSelect = document.getElementById("destinoID");

    mockupCountries.forEach(country => origenSelect.add(new Option(country.Pais, country.CodigoPais)));

    origenSelect.addEventListener("change", () => {
      destinoSelect.innerHTML = '<option value="" hidden selected>Seleccione</option>';
      if (origenSelect.value === "Nacional") {
        mockupCountries.forEach(country => destinoSelect.add(new Option(country.Pais, country.CodigoPais)));
      } else {
        destinoSelect.add(new Option("Nacional", "Nacional"));
        destinoSelect.value = "Nacional"; // Auto-selecciona Colombia como destino
      }
    });
  }

  /**
   * Muestra u oculta los detalles de cobertura de un plan.
   * @private
   */
  _togglePlanDetails(checkbox, detailsId, nationalId, internationalId) {
    const detailsDiv = document.getElementById(detailsId);
    const selectDestino = document.getElementById("destinoID").value;
    const nationalTable = document.getElementById(nationalId);
    const internationalTable = document.getElementById(internationalId);

    if (checkbox.checked && selectDestino) {
      detailsDiv.style.display = 'block';
      nationalTable.style.display = selectDestino === 'Nacional' ? 'table' : 'none';
      internationalTable.style.display = selectDestino !== 'Nacional' ? 'table' : 'none';
    } else {
      detailsDiv.style.display = 'none';
    }
  }
}
// #endregion

/**
 * Clase simple para validar selectores de forma individual al hacer clic en Cotizar.
 * La validación en tiempo real ya se maneja en la clase principal.
 */
class SelectValidator {
  constructor(selectId, errorMessage = "Selecciona la información") {
    this.selectElement = document.getElementById(selectId);
    this.errorMessage = errorMessage;
    this.errorElementId = `error-${selectId}`;
  }

  validate() {
    const value = this.selectElement?.value || "";
    let errorElement = document.getElementById(this.errorElementId);
    if (value === "") {
      if (!errorElement) {
        errorElement = document.createElement("span");
        errorElement.id = this.errorElementId;
        errorElement.style.color = "red";
        errorElement.style.fontSize = "12px";
        errorElement.style.display = "block";
        errorElement.textContent = this.errorMessage;
        this.selectElement?.parentNode?.appendChild(errorElement);
      } else {
        errorElement.style.display = "block";
      }
      this.selectElement?.classList.add("error-border");
      return false;
    } else {
      if (errorElement) errorElement.style.display = "none";
      this.selectElement?.classList.remove("error-border");
      return true;
    }
  }
}

// Ejemplo de uso para validar el selector de origen al hacer clic en "Cotizar".
document.getElementById("submit-button-travelers").addEventListener("click", function () {
  const origenValidator = new SelectValidator("origenID");
  origenValidator.validate();
});

// --- INICIALIZACIÓN DE LA APLICACIÓN ---
// Se asegura de que el DOM esté completamente cargado antes de iniciar la aplicación.
document.addEventListener("DOMContentLoaded", () => {
  new TravelerQuoteApp();
});