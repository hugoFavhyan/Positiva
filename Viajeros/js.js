
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
            documentValidation: this._createModal("documentValidationModal", "closeDocumentValidationModal"),
            validations: this._createModal("modalValidations", "closeModalValidations"),
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
            if (modal) {
                // Evento para el botón de cerrar (si existe)
                if (modal.closeButton) {
                    modal.closeButton.addEventListener("click", () => modal.hide());
                }

                // Evento para cerrar al hacer clic en el fondo (overlay) del modal
                modal.element.addEventListener("click", (event) => {
                    // Esta condición verifica que el clic sea en el fondo (el elemento 'padre')
                    // y no en el contenido del pop-up (un elemento 'hijo').
                    if (event.target === modal.element) {
                        modal.hide();
                    }
                });
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
            // Limpiamos las clases de estado en cada botón primero
            elem.classList.remove('js-active', 'js-completed');

            if (index < activeStepNum) {
                // Si el índice es menor que el paso activo, es un paso completado.
                elem.classList.add('js-completed');
            } else if (index === activeStepNum) {
                // Si el índice es igual al paso activo, es el paso actual.
                elem.classList.add('js-active');
            }
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
// FormValidator actualizado – popup inmediato al digitar la cédula "123456789"
class FormValidator {
    constructor(modalManager, travelerManager, quoteManager) {
        this.modalManager = modalManager;
        this.travelerManager = travelerManager;
        this.quoteManager = quoteManager;

        // --- CAMBIO: Se ha restaurado la llamada a la validación instantánea del documento.
        this._initImmediateDocumentValidation();
    }

    // --- CAMBIO: Se ha restaurado la función de validación instantánea.
    _initImmediateDocumentValidation() {
        document.addEventListener('input', (event) => {
            const el = event.target;
            // Se asegura de que sea un input de número dentro del formulario de viajeros
            if (el.matches('.acordeon__item input[type="number"]')) {
                const value = el.value.trim();
                const formRow = el.closest('.form-row-formViajeros');
                const docError = formRow ? formRow.querySelector('.custom-doc-error') : null;

                if (!docError) return;

                if (value === '123456789') {
                    docError.style.display = 'block';
                    docError.textContent = 'Este número de documento no puede continuar.'; // Mensaje genérico
                    el.classList.add('error-border');
                    // Muestra el pop-up de validación de documento inmediatamente
                    this.modalManager.show('documentValidation');
                } else {
                    docError.style.display = 'none';
                    el.classList.remove('error-border');
                }
            }
        });
    }

    /* ========================= PASO 1 (Sin cambios) ========================= */
    validateStep0() {
        let isValid = true;
        if (!this._validateRequiredFields('.required')) {
            isValid = false;
        }
        if (this.travelerManager.getTotalTravelers() === 0) {
            document.getElementById('viajeros-input').classList.add('error-border');
            isValid = false;
        }
        if (!this._validateCheckbox('#accept', '.radioContainer')) {
            this.modalManager.show('acceptTerms');
            isValid = false;
        }
        if (!this.validateCoupon()) {
            this.modalManager.show('errorCupon');
            isValid = false;
        }
        if (!isValid) {
            this.modalManager.showToast();
        }
        return isValid;
    }

    /* ========================= PASO 2 ========================= */
    validateStep2() {
        let isValid = true;
        // Limpiamos solo los errores que no sean el de la validación instantánea para evitar que parpadee.
        document.querySelectorAll('.custom-date-error, .phone-length-error, .email-match-error, .age-error, .required-error').forEach(el => el.style.display = 'none');

        if (!this._validateRequiredFields('.required2')) isValid = false;

        // La validación al presionar "continuar" se mantiene para el caso específico
        if (!this._validateSpecificDateAndDocument()) isValid = false;

        if (!this._validateAgeFromBirthDate()) isValid = false;
        if (!this._validateCheckbox('#accept2', '.radioContainer2')) {
            this.modalManager.show('acceptTerms');
            isValid = false;
        }
        if (!this._validateAllEmails()) {
            this.modalManager.show('emailValidation');
            isValid = false;
        }
        if (!this._validatePhoneInputs()) isValid = false;

        if (!isValid) {
            const specificVisible = [
                'age', 'ageChildren', 'acceptTerms', 'emailValidation',
                'documentValidation', 'validations'
            ].some(name => {
                const modal = this.modalManager.modals[name];
                return modal && modal.element.style.display === 'flex';
            });
            if (!specificVisible) {
                this.modalManager.showToast();
            }
        }
        return isValid;
    }

    validateCoupon() {
        const couponInput = document.getElementById('codecupponID');
        const couponCode = couponInput.value.trim().toUpperCase();
        if (couponCode === '') return true;
        return this.quoteManager.isValidCoupon(couponCode);
    }

    // --- LÓGICA DE VALIDACIÓN AL CONTINUAR ---
    // Esta función se ejecuta al presionar el botón y se enfoca en el caso de la fecha específica.
    _validateSpecificDateAndDocument() {
        let isValid = true;
        document.querySelectorAll('.acordeon__item').forEach(item => {
            const docNumberInput = item.querySelector('input[type="number"].required2');
            const expeditionDateInput = item.querySelector('input[type="date"]');

            if (docNumberInput && expeditionDateInput) {
                const docValue = docNumberInput.value.trim();
                const dateValue = expeditionDateInput.value;

                // La validación instantánea ya manejó el caso genérico de la cédula.
                // Esta validación se enfoca solo en la combinación específica al hacer clic en "Continuar".
                if (docValue === '123456789' && dateValue === '2014-06-25') {
                    this.modalManager.show('validations'); // Muestra el pop-up de "Fecha de expedición no válida"

                    // Marca ambos campos y muestra ambos textos de error.
                    docNumberInput.classList.add('error-border');
                    expeditionDateInput.classList.add('error-border');

                    const docError = docNumberInput.closest('.form-row-formViajeros')?.querySelector('.custom-doc-error');
                    const dateError = expeditionDateInput.closest('.form-row-formViajeros')?.querySelector('.custom-date-error');

                    if (docError) {
                        docError.textContent = 'Este número de documento no puede continuar.';
                        docError.style.display = 'block';
                    }
                    if (dateError) {
                        dateError.style.display = 'block';
                    }

                    isValid = false;
                } else if (docValue === '123456789') {
                    // Si la cédula es la bloqueada pero la fecha es otra, la validación falla
                    // pero el mensaje y pop-up ya fueron mostrados por la validación instantánea.
                    // Solo nos aseguramos de que el formulario no avance.
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    _validateRequiredFields(selector) {
        let isValid = true;
        document.querySelectorAll(selector).forEach(field => {
            const filled = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
            let container = field.closest('.form-row-formViajeros, .radioContainer, .checkbox-info-container');

            const elementToBorder = field.type === 'checkbox' ? container : field;
            if (elementToBorder) {
                elementToBorder.classList.toggle('error-border', !filled);
            }

            if (container) {
                const msg = container.querySelector('.required-error');
                if (msg) msg.style.display = filled ? 'none' : 'block';
            }

            if (!filled) isValid = false;
        });
        return isValid;
    }

    _validateCheckbox(selector, containerSelector) {
        const checkbox = document.querySelector(selector);
        const container = document.querySelector(containerSelector);
        if (!checkbox || !container) return true;
        const ok = checkbox.checked;
        container.classList.toggle('error-border', !ok);
        return ok;
    }

    _validateAllEmails() {
        let ok = true;
        const emailFields = document.querySelectorAll('input[type="email"].required2');
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailFields.forEach(f => {
            if (f.value.trim() !== '' && !re.test(f.value.trim())) {
                f.classList.add('error-border');
                ok = false;
            }
        });
        document.querySelectorAll('[data-email-confirm]').forEach(conf => {
            const email = document.getElementById(conf.dataset.emailConfirm);
            if (email && conf.value.trim() !== '' && conf.value !== email.value) {
                email.classList.add('error-border');
                conf.classList.add('error-border');
                const msg = conf.closest('.form-row-formViajeros')?.querySelector('.email-match-error');
                if (msg) msg.style.display = 'block';
                ok = false;
            } else if (email) {
                const msg = conf.closest('.form-row-formViajeros')?.querySelector('.email-match-error');
                if (msg) msg.style.display = 'none';
            }
        });
        return ok;
    }

    _validatePhoneInputs() {
        let ok = true;
        document.querySelectorAll('input[type="tel"].required2').forEach(input => {
            const phone = input.value.replace(/\D/g, '');
            const formRow = input.closest('.form-row-formViajeros');
            const lengthError = formRow ? formRow.querySelector('.phone-length-error') : null;

            if (lengthError) {
                lengthError.style.display = 'none';
            }

            if (input.value.trim() !== '' && phone.length < 10) {
                input.classList.add('error-border');
                ok = false;
                if (lengthError) {
                    lengthError.style.display = 'block';
                }
            }
        });
        return ok;
    }

    _validateAgeFromBirthDate() {
        let allAgesValid = true;
        document.querySelectorAll('input[type="date"][id$="DateBirthInput"].required2').forEach(field => {
            const birthDateString = field.value;
            const container = field.closest('.form-row-formViajeros');
            if (!container) return;

            const ageErrorMsg = container.querySelector('.age-error');
            if (ageErrorMsg) ageErrorMsg.style.display = 'none';

            if (!birthDateString) return;

            const birthDate = new Date(birthDateString + 'T00:00:00');
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            const accordionItem = field.closest('.acordeon__item');

            if (accordionItem.classList.contains('form-adult') || accordionItem.classList.contains('form-responsible')) {
                if (age < 18 || age > 65) {
                    field.classList.add('error-border');
                    if (ageErrorMsg) {
                        ageErrorMsg.textContent = 'La edad del adulto debe estar entre 18 y 65 años.';
                        ageErrorMsg.style.display = 'block';
                    }
                    
                    this.modalManager.show('ageRange');
                    allAgesValid = false;
                }
            } else if (accordionItem.classList.contains('form-minor')) {
                if (age < 12 || age > 17) {
                    field.classList.add('error-border');
                    if (ageErrorMsg) {
                        ageErrorMsg.textContent = 'La edad debe estar entre 12 y 17 años.';
                        ageErrorMsg.style.display = 'block';
                    }
                    this.modalManager.show('ageChildren');
                    allAgesValid = false;
                }
            }
        });
        return allAgesValid;
    }
}

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
    constructor(modalManager) {
        this.modalManager = modalManager;
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
        this._renderCart(subtotal, discountAmount, finalCost, adultCount, minorCount, discountPercentage, adultSubTotal, minorSubTotal, destinoPlan);
        this._renderSummary(finalCost, selectedPlan.id, formattedDateStart, formattedDateEnd, discountPercentage, travelerManager);
        this._updateHeaders(selectOrigen?.value, selectDestino?.value);
    }

    _mostrarDescuentoEnTarjetas() {
        const couponInput = document.getElementById("codecupponID");
        const couponCode = couponInput?.value.trim().toUpperCase() || "";
        const coupon = this.validCoupons.find(c => c.code === couponCode);
        const discountPercentage = coupon ? coupon.discount : 0;
        const mensajeDescuento = discountPercentage > 0 ? `Descuento del ${discountPercentage}%` : "";
        document.getElementById("descuentoCardPlan1").textContent = mensajeDescuento;
        document.getElementById("descuentoCardPlan2").textContent = mensajeDescuento;
    }

    _renderCart(subtotal, discountAmount, finalCost, adultCount, minorCount, discountPercentage, adultSubTotal, minorSubTotal, destinoPlan) {
        const adultTextHTML = adultCount > 0 ? `<tr><th>${destinoPlan} x ${adultCount} adulto${adultCount > 1 ? "s" : ""}</th><th class="text-right">COP ${adultSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
        const minorTextHTML = minorCount > 0 ? `<tr><th>${destinoPlan} x ${minorCount} menor${minorCount > 1 ? "es" : ""} de edad</th><th class="text-right">COP ${minorSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
        const discountHTML = discountAmount > 0 ? `<tr><td>Descuento ${discountPercentage}%</td><td class="text-right">-COP ${discountAmount.toLocaleString("es-CO")}</td></tr>` : "";
        const lineaDivisoriaHTML = `<tr><td colspan="2"><hr class="linea-gris"></td></tr>`;
        const cartHTML = `<table style="margin-top: 15px"><tbody>${adultTextHTML}${minorTextHTML}${lineaDivisoriaHTML}<tr><td>Subtotal</td><td class="text-right">COP ${subtotal.toLocaleString('es-CO')}</td></tr>${discountHTML}<tr><td><b>TOTAL</b></td><td class="text-right"><b>COP ${finalCost.toLocaleString('es-CO')}</b></td></tr></tbody></table>`;
        if (this.dom.cart) this.dom.cart.innerHTML = cartHTML;
    }

    _renderSummary(finalCost, selectedPlanId, formattedDateStart, formattedDateEnd, discountPercentage, travelerManager) {
        if (!this.dom.totalSummary) return;

        // Se obtienen los valores necesarios
        const adultCount = travelerManager.getAdultCount();
        const minorCount = travelerManager.getMinorCount();
        const destinoPlan = document.getElementById("destinoID")?.value === "Nacional" ? "Nacional" : "Internacional";
        const selectedPlanInput = document.querySelector('input[name="TipoPlan"]:checked');
        const planCost = selectedPlanInput ? parseFloat(selectedPlanInput.value) : 0;
        const adultSubTotal = adultCount * planCost;
        const minorSubTotal = minorCount * planCost;
        const subtotal = adultSubTotal + minorSubTotal;
        const discountAmount = (subtotal * discountPercentage) / 100;

        // Se preparan las filas de la tabla
        const adultTextHTML = adultCount > 0 ? `<tr><th>${destinoPlan} x ${adultCount} adulto${adultCount > 1 ? "s" : ""}</th><th class="text-right">COP ${adultSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
        const minorTextHTML = minorCount > 0 ? `<tr><th>${destinoPlan} x ${minorCount} menor${minorCount > 1 ? "es" : ""} de edad</th><th class="text-right">COP ${minorSubTotal.toLocaleString("es-CO")}</th></tr>` : "";
        const discountHTML = discountAmount > 0 ? `<tr><td>Descuento ${discountPercentage}%</td><td class="text-right">COP ${discountAmount.toLocaleString("es-CO")}</td></tr>` : "";
        const lineaDivisoriaHTML = `<tr><td colspan="2"><hr class="linea-gris"></td></tr>`;
        const cartHTML = `<table style="margin-top: 15px"><tbody>${adultTextHTML}${minorTextHTML}${lineaDivisoriaHTML}<tr><td>Subtotal</td><td class="text-right">COP ${subtotal.toLocaleString('es-CO')}</td></tr>${discountHTML}<tr><td><b>TOTAL</b></td><td class="text-right"><b>COP ${finalCost.toLocaleString('es-CO')}</b></td></tr></tbody></table>`;

        // Se obtiene el nombre del plan seleccionado
        const planElement = document.getElementById(selectedPlanId);
        const planCard = planElement?.nextElementSibling;
        const h3Element = planCard?.querySelector('h3');
        let planName = "seleccionado";
        if (h3Element) {
            planName = h3Element.textContent.trim().replace(/\s+/g, ' ');
        }

        // Se renderiza el HTML final del resumen
        this.dom.totalSummary.innerHTML = `<div class="form-row-border-viajeros"><div class="flex"><h3 class="multisteps-form__title">Resumen de <span style="color: #ff7500">compra</span></h3></div><div class="min-cart"><ul><li>La vigencia para su seguro de viaje va desde el ${formattedDateStart} al ${formattedDateEnd}.</li><li>El tipo de plan que usted ha seleccionado es: ${planName}.</li><li>El valor a pagar por su compra con el descuento aplicado es de COP ${finalCost.toLocaleString("es-CO")}.</li></ul></div></div><div class="form-row-border-viajeros carrito-viajeros"><div class="flex"><img src="https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402997/carrito.svg" alt="" style="margin-right: 10px" /><div><h3 class="multisteps-form__title">Tu <span style="color: #ff7500">carrito</span></h3><span class="vigency-data">Vigencia del ${formattedDateStart} al ${formattedDateEnd}</span></div></div><div class="min-cart">${cartHTML}</div></div>`;
    }
    _updateHeaders(origen, destino) {
        if (this.dom.headerIda) this.dom.headerIda.querySelector('span').textContent = `${origen} - ${destino}`;
        if (this.dom.headerVuelta) this.dom.headerVuelta.querySelector('span').textContent = `${destino} - ${origen}`;
    }

    generateTravelerForms(travelerManager) {
        this.dom.formContainer.innerHTML = '';
        this.dom.voucherContainer.innerHTML = '';
        const adultCount = travelerManager.getAdultCount();
        const minorCount = travelerManager.getMinorCount();
        let travelerNumber = 1;
        for (let i = 1; i <= adultCount; i++) {
            this.dom.formContainer.appendChild(this._createForm('adult', travelerNumber, i === 1));
            travelerNumber++;
        }
        if (minorCount > 0 && adultCount === 0) {
            this.dom.formContainer.appendChild(this._createForm('responsible', 0, true));
        }
        for (let i = 1; i <= minorCount; i++) {
            this.dom.formContainer.appendChild(this._createForm('minor', travelerNumber, false));
            travelerNumber++;
        }
        if (adultCount > 0 || minorCount > 0) {
            this.dom.voucherContainer.innerHTML = this._createVoucherForm(adultCount > 0, adultCount);
            this._attachVoucherListener();
        }
    }

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

    _createForm(type, number, isPrincipal) {
        const formDiv = document.createElement('div');
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
        <div class="flex" style="align-items: center; gap: 10px;">
            <img src="https://positivapruebas.com.co/wp-content/uploads/Cotizador-viajeros-positiva-icono-persona-formulario.svg" alt="Ícono de persona" style="width: 15px;">
            <div class="cont-viajeros-titu">
                <h3 style="margin: 0;">${title}</h3>
                <p style="margin: 0; color: #7E7F80;">${subtitle}</p>
            </div>
        </div>
        <div class="acordeon-arrow-container">
            <img src="https://positivapruebas.com.co/wp-content/uploads/Cotizador-viajeros-positiva-icono-flecha-abajo-acordeon.svg" alt="Ícono de flecha hacia abajo" class="acordeon-arrow arrow-down">
            <img src="https://positivapruebas.com.co/wp-content/uploads/Cotizador-viajeros-positiva-icono-flecha-arriba-acordeon.svg" alt="Ícono de flecha hacia arriba" class="acordeon-arrow arrow-up">
        </div>
    </label>
    <div class="acordeon__contenido">
        <div class="form-grid">
            <div class="form-row-formViajeros">
                <label>Tipo de documento *</label>
                <select id="${idPrefix}documentoID" class="selectcontainer small-input required2">
                    <option value="CC">Nacional</option>
                    <option value="CE">Extranjera</option>
                </select>
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
            </div>
            <div class="form-row-formViajeros">
                <label>Numero de documento *</label>
                <input type="number" class="selectcontainer small-input required2">
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
                <p class="error-message-viajeros custom-doc-error" style="display:none;">Este número de documento no puede continuar.</p>
            </div>
        </div>
        <div class="form-row-formViajeros">
            <div class="form-row-formViajeros">
                <label>Fecha de ${type === 'minor' ? 'vencimiento' : 'expedición'} del documento *</label>
                <input type="date" class="selectcontainer small-input required2">
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
                <p class="error-message-viajeros custom-date-error" style="display:none;">Fecha de expedición no válida.</p>
            </div>
        </div>
        <div class="form-grid">
            <div class="form-row-formViajeros">
                <label>Nombre *</label>
                <input type="text" id="${idPrefix}nameInput" placeholder="Ingrese" class="required2" />
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
            </div>
            <div class="form-row-formViajeros">
                <label>Apellidos *</label>
                <input type="text" placeholder="Ingrese" class="required2" />
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
            </div>
        </div>
        <div class="form-grid">
            <div class="form-row-formViajeros">
                <label>Fecha de nacimiento *</label>
                <input type="date" id="${idPrefix}DateBirthInput" class="required2" />
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
                <p class="error-message-viajeros age-error" style="display:none;">No cumples con el rango de edad.</p>
            </div>
            <div class="form-row-formViajeros">
                <label>Género *</label>
                <select class="selectcontainer small-input required2">
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                </select>
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
            </div>
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
            <p class="error-message-viajeros phone-length-error" style="display:none;">El campo debe tener al menos 10 dígitos.</p>
        </div>
        <div class="form-row-formViajeros">
            <div class="form-row-formViajeros">
                <label>Actividad CIIU*</label>
                <select id="${idPrefix}ciiuActivity" class="selectcontainer small-input required2">
                    <option value="" hidden selected>Seleccione</option>
                    <option value="asalariado">Asalariado</option>
                    <option value="independiente">Independiente</option>
                    <option value="estudiante">Estudiante</option>
                </select>
                <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
            </div>
        </div>
        <div class="form-row-formViajeros">
            <div class="checkbox-info-container">
                <input type="checkbox" id="${idPrefix}peps" name="peps" class="required2">
                <label for="${idPrefix}peps">¿Eres una persona políticamente Expuesta (PEPS)?</label>
                <img src="https://positivapruebas.com.co/wp-content/uploads/Cotizador-viajeros-positiva-icono-tooltip.svg" alt="Info" class="info-icon">
            </div>
            <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
        </div>
        <div class="form-row-formViajeros">
            <div class="checkbox-info-container">
                <input type="checkbox" id="${idPrefix}pepsLink" name="pepsLink" class="required2">
                <label for="${idPrefix}pepsLink">¿Existe algún vínculo entre usted y una persona Públicamente expuesta?</label>
                <img src="https://positivapruebas.com.co/wp-content/uploads/Cotizador-viajeros-positiva-icono-tooltip.svg" alt="Info" class="info-icon">
            </div>
            <p class="error-message-viajeros required-error" style="display:none;">Campo obligatorio</p>
        </div>
    </div>
    `;

        const fields = formDiv.querySelectorAll('.required2');
        fields.forEach(field => {
            const eventType = (field.tagName.toLowerCase() === 'select' || field.type === 'date' || field.type === 'checkbox') ? 'change' : 'input';

            field.addEventListener(eventType, () => {
                let parentWrapper = field.closest('.form-row-formViajeros, .input-date');
                if (!parentWrapper) return;
                if (field.type === 'checkbox') {
                    parentWrapper = field.closest('.form-row-formViajeros');
                }

                const errorMessages = parentWrapper.querySelectorAll('.required-error, .age-error, .custom-date-error');
                errorMessages.forEach(msg => msg.style.display = 'none');

                let isFilled = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';

                if (!isFilled) {
                    const requiredError = parentWrapper.querySelector('.required-error');
                    if (requiredError) requiredError.style.display = 'block';
                }
                field.classList.toggle('error-border', !isFilled);

                const isPrimaryEmail = field.id.endsWith('emailInput');
                const isConfirmEmail = field.hasAttribute('data-email-confirm');

                if (isPrimaryEmail || isConfirmEmail) {
                    // Identificamos los campos de correo y el mensaje de error de coincidencia
                    const primaryEmailInput = isPrimaryEmail ? field : document.getElementById(field.getAttribute('data-email-confirm'));
                    const confirmEmailInput = isConfirmEmail ? field : formDiv.querySelector(`[data-email-confirm="${primaryEmailInput.id}"]`);
                    const errorContainer = confirmEmailInput.closest('.form-row-formViajeros');
                    const matchError = errorContainer.querySelector('.email-match-error');

                    // Si ambos correos tienen valor y coinciden, ocultamos el error.
                    if (primaryEmailInput.value.trim() !== "" && confirmEmailInput.value.trim() !== "" && primaryEmailInput.value === confirmEmailInput.value) {
                        if (matchError) matchError.style.display = 'none';
                        // También quitamos el borde de error de ambos, si es que lo tenían
                        primaryEmailInput.classList.remove('error-border');
                        confirmEmailInput.classList.remove('error-border');
                    }
                }
                // --- FIN DE LA NUEVA LÓGICA ---
            });
        });

        return formDiv;
    }


    _createVoucherForm(hasAdults, adultCount) {
        let optionsHTML = hasAdults ?
            Array.from({ length: adultCount }, (_, i) => `<option value="Viajero ${i + 1}">Viajero ${i + 1}</option>`).join('') :
            `<option value="No-Viajero">No viajero mayor de edad</option>`;
        return `<div class="flex"><img src="https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402997/billete-de-avion.svg" alt="" style="margin-right: 10px" /><div><h3 class="multisteps-form__title">Información del <span style="color: #ff7500">voucher</span></h3></div></div><div class="form-row-formViajeros"><label>¿Quién recibe el voucher? *</label><select id="nameVoucherInput" class="selectcontainer small-input required2"><option value="" hidden selected>Seleccione</option>${optionsHTML}</select></div><div class="form-grid"><div class="form-row-formViajeros"><label>Correo electrónico *</label><input type="email" id="voucherEmailInput" placeholder="Ingrese" class="required2" /></div><div class="form-row-formViajeros"><label>Confirma tu correo electrónico *</label><input type="email" id="voucherConfirmEmailInput" data-email-confirm="voucherEmailInput" placeholder="Ingrese" class="required2" /><p class="error-message-viajeros email-match-error" style="display:none;">los correos no coinciden</p></div></div><div class="form-row-formViajeros"><label>Celular *</label><input type="tel" id="voucherNumberInput" placeholder="Celular" class="required2" maxlength="15" pattern="[0-9]{10,15}" /></div>`;
    }

    isValidCoupon(couponCode) {
        return this.validCoupons.some(c => c.code === couponCode.toUpperCase());
    }
}
/**
 * La clase principal de la aplicación.
 */
class TravelerQuoteApp {
    constructor() {
        // Instancia todas las clases gestoras.
        this.modalManager = new ModalManager();
        this.travelerManager = new TravelerManager(this.modalManager);
        this.quoteManager = new QuoteManager(this.modalManager);
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