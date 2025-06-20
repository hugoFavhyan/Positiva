// Clase base para validaciones
class Validator {
    constructor(inputElement) {
        this.inputElement = inputElement;
        this.errorElement = inputElement.nextElementSibling;
    }
    showError(message) {
        this.inputElement.style.borderColor = "red";
        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.style.display = "block";
        }
    }
    clearError() {
        this.inputElement.style.borderColor = "#e0e0e0";
        if (this.errorElement) {
            this.errorElement.style.display = "none";
        }
    }
    // Valida para que los input de texto no puedan colocar numeros
    static validateAlphanumeric(inputElement) {
        inputElement.addEventListener("keypress", (event) => {
            const char = String.fromCharCode(event.which);
            const alphanumericRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
            if (!alphanumericRegex.test(char)) {
                event.preventDefault();
            }
        });
    }
    // Nueva validación para direcciones que permite #, - y caracteres alfanuméricos
    static validateAddress(inputElement) {
        inputElement.addEventListener("keypress", (event) => {
            const char = String.fromCharCode(event.which);
            const addressRegex = /^[a-zA-Z0-9 #-]$/;
            if (!addressRegex.test(char)) {
                event.preventDefault();
            }
        });
    }
    // Valida que solo se puedan ingresar números
    static validateNumbers(inputElement) {
        inputElement.addEventListener("keypress", (event) => {
            const char = event.key;
            const numbersRegex = /^\d$/;
            if (!numbersRegex.test(char)) {
                event.preventDefault();
            }
        });
    }
}
// =================================================================
// NUEVA CLASE PARA CENTRALIZAR MENSAJES DE ERROR
// =================================================================
class ErrorMessages {
    constructor() {
        this.messages = {
            REQUIRED: "Este campo es obligatorio.",
            INVALID_EMAIL_STRUCTURE: "Estructura de correo inválida.",
            PHONE_LENGTH: "El campo debe tener al menos 10 dígitos.",
            AGE_RANGE_FIELD: "No cumples con el rango de edad.",
            INVALID_CITY: "Por favor, selecciona una ciudad válida de la lista.",
            AGE_RANGE_MODAL: {
                title: "Edad no permitida",
                body: "La edad debe estar entre 2 y 65 años para continuar."
            },
            EMAIL_MISMATCH_MODAL: {
                title: "Los correos no coinciden",
                body: "Valida que hayas escrito el correo de forma correcta."
            },
            DATA_AUTH_MODAL: {
                title: "Aceptar tratamiento de datos",
                body: "Debes aceptar el tratamiento de datos personales para continuar con el proceso. Por favor, marca la casilla correspondiente."
            },
            // AÑADIMOS LA NUEVA ENTRADA PARA EL TOAST AQUÍ
            FORM_INCOMPLETE_TOAST: {
                primary: "Por favor, completa todos los campos obligatorios.",
                secondary: "Los campos pendientes están resaltados para tu referencia."
            }
        };
    }
    /**
     * Obtiene un mensaje de error por su clave.
     * @param {string} key La clave del mensaje a obtener.
     * @returns {string|object} El mensaje o un objeto con title y body.
     */
    get(key) {
        return this.messages[key] || "Error desconocido.";
    }
}
// Clase para manejar validación de emails con comportamiento específico
class EmailValidator extends Validator {
    constructor(inputElement, errorMessages) {
        super(inputElement);
        this.errorMessages = errorMessages;
        this.setupEmailValidation();
    }
    setupEmailValidation() {
        this.inputElement.addEventListener("input", () => {
            const currentEmail = this.inputElement.value;
            if (currentEmail.includes("@")) {
                const [user, domain] = currentEmail.split("@");
                if (domain.startsWith("-")) {
                    this.inputElement.value = `${user}@`;
                    return;
                }
                if (domain.endsWith("-")) {
                    this.inputElement.value = `${user}@${domain.slice(0, -1)}`;
                    return;
                }
            }
        });
        this.inputElement.addEventListener("keypress", (event) => {
            const char = event.key;
            const currentEmail = this.inputElement.value;
            const emailRegex = /^[a-zA-Z0-9@.-]$/;
            if (!emailRegex.test(char)) {
                event.preventDefault();
                return;
            }
            if (char === "@") {
                if (currentEmail.length === 0 || currentEmail.includes("@")) {
                    event.preventDefault();
                    return;
                }
            }
            if (char === " ") {
                event.preventDefault();
                return;
            }
            if (currentEmail.includes("@")) {
                const domain = currentEmail.split("@")[1];
                if (char === "-") {
                    if (domain.length === 0 || (domain.length > 0 && domain[domain.length - 1] === "-")) {
                        event.preventDefault();
                        return;
                    }
                }
            }
        });
    }
    validateStructure() {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.inputElement.value);
        if (!isValid) {
            this.showError(this.errorMessages.get('INVALID_EMAIL_STRUCTURE'));
            return false;
        } else {
            this.clearError();
            return true;
        }
    }
}
// Clase para validación de teléfonos
class PhoneValidator extends Validator {
    constructor(inputElement, errorMessages) {
        super(inputElement);
        this.errorMessages = errorMessages;
        this.setupPhoneValidation();
    }
    validatePhone() {
        const isValid = this.inputElement.value.trim().length >= 10;
        if (!isValid) {
            this.showError(this.errorMessages.get('PHONE_LENGTH'));
            return false;
        } else {
            this.clearError();
            return true;
        }
    }
    setupPhoneValidation() {
        Validator.validateNumbers(this.inputElement);
    }
}
// Clase para validación de fechas de nacimiento
class BirthDateValidator extends Validator {
    constructor(inputElement, errorMessages) {
        super(inputElement);
        this.errorMessages = errorMessages;
    }
    validateAge() {
        if (this.inputElement.value === "") return true; // No validar si está vacío, se manejará en 'REQUIRED'
        const birthDate = new Date(this.inputElement.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const isValid = age >= 2 && age <= 65;
        if (!isValid) {
            this.showError(this.errorMessages.get('AGE_RANGE_FIELD'));
            return false;
        } else {
            this.clearError();
            return true;
        }
    }
}
// Clase para manejar datos de ubicación (departamentos y municipios)
class LocationService {
    constructor() {
        this.departments = [];
        this.municipalities = [];
        this.clientId = "105e2e9a";
        this.clientSecret = "aa75c8b9c4a16f31ce1e2a278b341a98";
        this.baseUrl = "https://core-positiva-apis-pre-apicast-staging.apps.openshift4.positiva.gov.co";
        this.tokenUrl = "https://keycloak-sso-app.apps.openshift4.positiva.gov.co/auth/realms/apis-pre/protocol/openid-connect/token";
    }
    async getAccessToken() {
        const tokenRequestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
        };
        const tokenResponse = await fetch(this.tokenUrl, tokenRequestOptions);
        const tokenData = await tokenResponse.json();
        return tokenData.access_token;
    }
    async loadLocations() {
        try {
            const accessToken = await this.getAccessToken();
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "*/*",
                },
            };
            const [departmentsResponse, municipalitiesResponse] = await Promise.all([
                fetch(`${this.baseUrl}/departamento/v1/positiva/scp/parametrica/consultaDepartamento`, options),
                fetch(`${this.baseUrl}/municipio/v1/positiva/scp/parametrica/consultaMunicipio`, options)
            ]);
            if (!departmentsResponse.ok || !municipalitiesResponse.ok) {
                throw new Error("Error al obtener los datos de ubicación");
            }
            this.departments = await departmentsResponse.json();
            this.municipalities = await municipalitiesResponse.json();
            return {
                departments: this.departments,
                municipalities: this.municipalities
            };
        } catch (error) {
            console.error("Error al cargar ubicaciones:", error);
            throw error;
        }
    }
    filterMunicipalities(searchTerm) {
        return this.municipalities.filter(municipality =>
            municipality.nombreMunicipio.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    getDepartmentById(departmentId) {
        return this.departments.find(dep => dep.idDepartamento === departmentId);
    }
}
// Clase para manejar la funcionalidad del autocompletado de ciudades
class CityAutocomplete {
    constructor(locationService, inputElement, resultsElement) {
        this.locationService = locationService;
        this.inputElement = inputElement;
        this.resultsElement = resultsElement;
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.inputElement.addEventListener("input", () => {
            this.handleInput();
        });
        document.addEventListener("click", (event) => {
            if (!this.inputElement.contains(event.target)) {
                this.clearResults();
            }
        });
    }
    handleInput() {
        const value = this.inputElement.value.trim().toLowerCase();
        this.clearResults();
        if (value) {
            const filteredResults = this.locationService.filterMunicipalities(value);
            this.displayResults(filteredResults);
        }
    }
    displayResults(municipalities) {
        municipalities.forEach(municipality => {
            const department = this.locationService.getDepartmentById(municipality.idDepartamento);
            const resultDiv = document.createElement("div");
            resultDiv.textContent = `${municipality.nombreMunicipio} - ${department?.NombreDepartamento}`;
            resultDiv.classList.add("resultado-item");
            resultDiv.addEventListener("click", () => {
                this.selectResult(municipality, department);
            });
            this.resultsElement.appendChild(resultDiv);
        });
    }
    selectResult(municipality, department) {
        this.inputElement.value = `${municipality.nombreMunicipio} - ${department?.NombreDepartamento}`;
        this.clearResults();
    }
    clearResults() {
        this.resultsElement.innerHTML = "";
    }
}
// Clase para manejar modales
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.setupGlobalListeners();
    }
    setupGlobalListeners() {
        window.addEventListener("click", (e) => {
            this.modals.forEach((data, key) => {
                if (e.target === data.modal) {
                    this.closeModal(key);
                }
            });
        });
    }
    registerModal(name, modalEl, closeEl) {
        this.modals.set(name, {
            modal: modalEl,
            close: closeEl
        });
        closeEl.addEventListener("click", () => this.closeModal(name));
    }
    openModal(name) {
        const md = this.modals.get(name);
        if (md) {
            md.modal.classList.add("active");
        }
    }
    closeModal(name) {
        const md = this.modals.get(name);
        if (md) {
            md.modal.classList.remove("active");
        }
    }
}
// Clase principal para manejar el formulario
// Reemplaza tu clase PersonalDataForm existente con esta
class PersonalDataForm {
    constructor() {
        this.mediaQuery = window.matchMedia("(max-width: 768px)");
        this.locationService = new LocationService();
        this.modalManager = new ModalManager();
        this.errorMessages = new ErrorMessages();
        this.cityAutocomplete = null;
        this.elements = {};
        this.validators = {};
        this.isValid = false;

        // --- INICIO: Definiciones para validación específica ---
        this.blockedCedula = "123456789"; // ¡CAMBIA ESTE NÚMERO POR LA CÉDULA REAL!

        // ===== ¡NUEVO! Define aquí la fecha de expedición específica que causará el error =====
        // El formato DEBE SER AÑO-MES-DÍA (YYYY-MM-DD)
        this.incorrectExpeditionDate = "2014-06-25";

        this.blockedCedulaMessage = {
            title: "No es posible continuar con el proceso",
            body: "El tipo y número de documento ingresados no han superado las validaciones establecidas.\n\nSi tienes alguna inquietud, comunícate con nuestro equipo de soporte para obtener más información."
        };

        this.invalidDateForBlockedCedulaMessage = {
            title: "Fecha de expedición no válida",
            body: "Por favor, asegúrate de que la fecha de expedición del documento sea correcta para continuar."
        };
        // --- FIN: Definiciones ---
    }

    async init() {
        this.getElements();
        this.setupSelectOptions();
        this.setupValidations();
        await this.loadLocationData();
        this.setupCityAutocomplete();
        this.setupModals();
        this.setupEventListeners();
    }

    getElements() {
        const elementIds = [
            'tipoDocumento', 'numeroDocumento', 'direccionResidencia', 'primerNombre',
            'apellido', 'genero', 'correoElectronico', 'confirmarCorreo', 'telefono',
            'ciudad', 'resultado-ciudad', 'fechaNacimiento', 'fechaExpedicion',
            'autorizacionDatos', 'formularioDatosPersonales',
            'modalValidationTitle', 'modalValidationMessage'
        ];
        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
        this.elements.formGroup = document.querySelector(".form-anual__grupo");
        this.elements.containerCheckbox = document.querySelector(".etiqueta-checkbox");
        this.elements.botonContinuar = document.querySelector(".boton-continuar");
    }

    setupSelectOptions() {
        const documentTypes = [{ text: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" }, { text: "NIT", value: "Número de Identificación Tributaria" }];
        const genderTypes = [{ text: "Masculino", value: "Masculino" }, { text: "Femenino", value: "Femenino" }];
        this.mapDataToSelect(documentTypes, this.elements.tipoDocumento);
        this.mapDataToSelect(genderTypes, this.elements.genero);
    }

    mapDataToSelect(options, selectElement) {
        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    }

    setupValidations() {
        Validator.validateAddress(this.elements.direccionResidencia);
        Validator.validateAlphanumeric(this.elements.primerNombre);
        Validator.validateAlphanumeric(this.elements.apellido);
        Validator.validateNumbers(this.elements.numeroDocumento);
        this.validators.emailPrimary = new EmailValidator(this.elements.correoElectronico, this.errorMessages);
        this.validators.emailConfirm = new EmailValidator(this.elements.confirmarCorreo, this.errorMessages);
        this.validators.phone = new PhoneValidator(this.elements.telefono, this.errorMessages);
        this.validators.birthDate = new BirthDateValidator(this.elements.fechaNacimiento, this.errorMessages);
        this.setupErrorClearing();
    }

    setupErrorClearing() {
        const inputs = this.elements.formularioDatosPersonales.querySelectorAll("input, select");
        inputs.forEach(input => {
            input.addEventListener("input", () => this.clearFieldError(input));
        });
    }

    clearFieldError(input) {
        input.style.borderColor = "#e0e0e0";
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.style.display = "none";
        }
    }

    async loadLocationData() {
        try {
            await this.locationService.loadLocations();
        } catch (error) {
            console.error("Error al cargar datos de ubicación:", error);
        }
    }

    setupCityAutocomplete() {
        this.cityAutocomplete = new CityAutocomplete(this.locationService, this.elements.ciudad, this.elements["resultado-ciudad"]);
    }

    setupModals() {
        const modalValidations = document.getElementById("modalValidations");
        const closeModal = modalValidations.querySelector(".close");
        this.modalManager.registerModal("validations", modalValidations, closeModal);
    }

    setupEventListeners() {
        this.elements.botonContinuar.addEventListener("click", (event) => this.handleSubmit(event));
        this.elements.numeroDocumento.addEventListener("blur", () => this.validateBlockedCedulaOnBlur());
    }

    showCustomValidationErrorModal(errorData) {
        this.elements.modalValidationTitle.textContent = errorData.title;
        this.elements.modalValidationMessage.innerHTML = errorData.body.replace(/\n/g, '<br>');
        const refContainer = document.getElementById('modalValidationReferenceContainer');
        const refInput = document.getElementById('modalValidationReferenceInput');
        if (errorData.reference) {
            refInput.value = errorData.reference;
            refContainer.style.display = 'block';
        } else {
            refContainer.style.display = 'none';
        }
        this.modalManager.openModal("validations");
    }

    validateBlockedCedulaOnBlur() {
        const documentoValue = this.elements.numeroDocumento.value.trim();
        if (documentoValue === this.blockedCedula) {
            this.showCustomValidationErrorModal(this.blockedCedulaMessage);
            this.showFieldError(this.elements.numeroDocumento, "Este número de documento no puede continuar.");
        }
    }

    validateForm() {
        let isFormValid = true;
        const inputs = this.elements.formularioDatosPersonales.querySelectorAll("input[required], select[required]");
        inputs.forEach(input => this.clearFieldError(input));

        // --- INICIO: LÓGICA DE VALIDACIÓN ACTUALIZADA ---
        const documentoValue = this.elements.numeroDocumento.value.trim();
        const fechaExpedicionValue = this.elements.fechaExpedicion.value;

        if (documentoValue === this.blockedCedula) {
            // Escenario 1: La cédula es la bloqueada Y la fecha de expedición es la fecha incorrecta específica.
            if (fechaExpedicionValue === this.incorrectExpeditionDate) {
                this.showCustomValidationErrorModal(this.invalidDateForBlockedCedulaMessage);
                this.showFieldError(this.elements.fechaExpedicion, 'Fecha de expedición no válida.');
                return false;
            }

            // Escenario 2: La cédula es la bloqueada, pero con cualquier otra fecha (o si está vacía).
            this.showCustomValidationErrorModal(this.blockedCedulaMessage);
            return false;
        }
        // --- FIN: LÓGICA DE VALIDACIÓN ACTUALIZADA ---

        inputs.forEach(input => {
            if ((input.type === 'checkbox' && !input.checked) || !input.value) {
                if (input.id !== 'autorizacionDatos') {
                    this.showFieldError(input, this.errorMessages.get('REQUIRED'));
                    isFormValid = false;
                }
            }
        });

        if (!this.validateCity(this.elements.ciudad)) isFormValid = false;
        if (!this.validators.emailPrimary.validateStructure()) isFormValid = false;
        if (!this.validators.emailConfirm.validateStructure()) isFormValid = false;
        if (!this.validators.phone.validatePhone()) isFormValid = false;

        if (!this.validators.birthDate.validateAge()) {
            const error = this.errorMessages.get('AGE_RANGE_MODAL');
            this.showCustomValidationErrorModal(error);
            return false;
        }

        if (this.elements.correoElectronico.value !== this.elements.confirmarCorreo.value) {
            const error = this.errorMessages.get('EMAIL_MISMATCH_MODAL');
            this.showCustomValidationErrorModal(error);
            return false;
        }

        if (!this.elements.autorizacionDatos.checked) {
            const error = this.errorMessages.get('DATA_AUTH_MODAL');
            this.showCustomValidationErrorModal(error);
            isFormValid = false;
        }

        return isFormValid;
    }

    validateCity(cityInput) {
        const value = cityInput.value.trim().toLowerCase();
        const parts = value.split(" - ");
        if (parts.length === 2) {
            const municipalityInput = parts[0].trim();
            const departmentInput = parts[1].trim();
            const isValid = this.locationService.municipalities.some(m => m.nombreMunicipio.toLowerCase() === municipalityInput) &&
                this.locationService.departments.some(d => d.NombreDepartamento.toLowerCase() === departmentInput);
            if (!isValid) {
                this.showFieldError(cityInput, this.errorMessages.get('INVALID_CITY'));
                return false;
            }
        } else {
            if (!value) {
                this.showFieldError(cityInput, this.errorMessages.get('REQUIRED'));
                return false;
            }
            this.showFieldError(cityInput, this.errorMessages.get('INVALID_CITY'));
            return false;
        }
        this.clearFieldError(cityInput);
        return true;
    }

    showFieldError(input, message) {
        input.style.borderColor = "red";
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.validateForm()) {
            this.onFormSuccess();
        } else {
            this.onFormError();
        }
    }

    onFormSuccess() {
        console.log("Formulario válido");
        if (this.mediaQuery.matches) {
            this.elements.formGroup.style.rowGap = "10px";
        } else {
            this.elements.formGroup.style.rowGap = "20px";
        }
        this.elements.containerCheckbox.style.marginTop = "0";
        document.getElementById("form-anual").style.display = "none";
        document.getElementById("resumen-compra").style.display = "block";
        this.populateSummary();
    }

    onFormError() {
        console.log("Formulario inválido");
        if (this.mediaQuery.matches) {
            this.elements.formGroup.style.rowGap = "10px";
        } else {
            this.elements.formGroup.style.rowGap = "30px";
        }

        // Se eliminó la condición 'if (!isModalActive)'
        const toast = document.getElementById("toast");
        toast.classList.add("showToastError");
        setTimeout(() => {
            toast.classList.remove("showToastError");
        }, 3000);
    }

    populateSummary() {
        const summaryElements = {
            nombre: `${this.elements.primerNombre.value} ${this.elements.apellido.value}`,
            tipoDocumentoResumen: this.elements.tipoDocumento.value,
            documento: this.elements.numeroDocumento.value,
            fechaExpedicionResumen: this.elements.fechaExpedicion.value,
            direccion: this.elements.direccionResidencia.value,
            fechaNacimientoResumen: this.elements.fechaNacimiento.value,
            CiudadResumen: this.elements.ciudad.value,
            email: this.elements.correoElectronico.value,
            celular: this.elements.telefono.value
        };
        Object.keys(summaryElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = summaryElements[id];
            }
        });
        const nameModalFinal = document.getElementById("nameText__ModalFinal");
        if (nameModalFinal) {
            nameModalFinal.textContent = summaryElements.nombre;
        }
    }
}
// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
    const form = new PersonalDataForm();
    await form.init();
    // Configuración para el modal de confirmación final
    const modalManager = new ModalManager();
    const confirmModalEl = document.getElementById("confirmModal");
    const closeConfirmEl = document.getElementById("closeConfirmModal");
    const openConfirmBtn = document.getElementById("openConfirmModal");
    if (confirmModalEl && closeConfirmEl && openConfirmBtn) {
        modalManager.registerModal("confirm", confirmModalEl, closeConfirmEl);
        openConfirmBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const userName = document.getElementById("nombre").textContent || "cliente";
            document.getElementById("nameText__ModalFinal").textContent = userName;
            modalManager.openModal("confirm");
        });
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") modalManager.closeModal("confirm");
        });
    }
    const informationModalEl = document.getElementById("modalInformation");
    const openInformationBtn = document.getElementById("openModalInformation");
    console.log("Modal element:", informationModalEl); // Debug
    console.log("Open button:", openInformationBtn); // Debug
    if (informationModalEl && openInformationBtn) {
        // Buscar el botón de cerrar dentro del modal
        const closeInformationEl = informationModalEl.querySelector(".modalInformation-close");
        console.log("Close button:", closeInformationEl); // Debug
        if (closeInformationEl) {
            modalManager.registerModal("information", informationModalEl, closeInformationEl);
        }
        // Evento para abrir el modal
        openInformationBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Clicking open modal"); // Debug
            // Método directo para abrir el modal
            informationModalEl.style.display = "flex";
            informationModalEl.classList.add("active");
            // También usar el modalManager si está registrado
            if (closeInformationEl) {
                modalManager.openModal("information");
            }
        });
        // Evento para cerrar el modal (método directo)
        if (closeInformationEl) {
            closeInformationEl.addEventListener("click", () => {
                informationModalEl.style.display = "none";
                informationModalEl.classList.remove("active");
                modalManager.closeModal("information");
            });
        }
        // Cerrar modal al hacer clic fuera de él
        window.addEventListener("click", (e) => {
            if (e.target === informationModalEl) {
                informationModalEl.style.display = "none";
                informationModalEl.classList.remove("active");
                if (closeInformationEl) {
                    modalManager.closeModal("information");
                }
            }
        });
    } else {
        console.error("No se encontraron los elementos del modal de información");
        console.error("Modal:", informationModalEl);
        console.error("Button:", openInformationBtn);
    }
    // Event listener global para cerrar modales con Escape
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modalManager.closeModal("confirm");
            modalManager.closeModal("information");
            // Método directo también
            if (informationModalEl) {
                informationModalEl.style.display = "none";
                informationModalEl.classList.remove("active");
            }
        }
    });
    // Funcionalidad para el botón de recargar/editar (tu código existente)
    const reloadButton = document.getElementById("reloadButton");
    if (reloadButton) {
        reloadButton.addEventListener("click", () => {
            document.getElementById("resumen-compra").style.display = "none";
            document.getElementById("form-anual").style.display = "block";
        });
    }
});    
