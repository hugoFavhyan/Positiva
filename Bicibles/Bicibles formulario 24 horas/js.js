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

    // Validación alfanumérica original
    static validateAlphanumeric(inputElement) {
        inputElement.addEventListener("keypress", (event) => {
            const char = String.fromCharCode(event.which);
            const alfanumericoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
            if (!alfanumericoRegex.test(char)) {
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

// Clase para centralizar mensajes de error
class ErrorMessages {
    constructor() {
        this.messages = {
            REQUIRED: "Ingresa la información",
            INVALID_EMAIL_STRUCTURE: "Estructura de correo inválida.",
            PHONE_LENGTH: "El campo debe tener al menos 10 dígitos.",
            AGE_RANGE_FIELD: "No cumples con el rango de edad",
            ACTIVATION_DATE_RANGE: "No cumples con el rango de 6 horas de anticipación",
            INVALID_CITY: "Selecciona una ciudad válida",
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
            ACTIVATION_DATE_MODAL: {
                title: "No cumples con el rango de horas de anticipación",
                body: "No cumples con el rango de 6 horas de anticipación."
            }
        };
    }

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
            const correoActual = this.inputElement.value;
            if (correoActual.includes("@")) {
                const [usuario, dominio] = correoActual.split("@");
                if (dominio.startsWith("-")) {
                    this.inputElement.value = `${usuario}@`;
                    return;
                }
                if (dominio.endsWith("-")) {
                    this.inputElement.value = `${usuario}@${dominio.slice(0, -1)}`;
                    return;
                }
            }
        });

        this.inputElement.addEventListener("keypress", (event) => {
            const char = event.key;
            const correoActual = this.inputElement.value;
            const correoRegex = /^[a-zA-Z0-9@.-]$/;

            if (!correoRegex.test(char)) {
                event.preventDefault();
                return;
            }

            if (char === "@") {
                if (correoActual.length === 0 || correoActual.includes("@")) {
                    event.preventDefault();
                    return;
                }
            }

            if (char === " ") {
                event.preventDefault();
                return;
            }

            if (correoActual.includes("@")) {
                const dominio = correoActual.split("@")[1];
                if (char === "-") {
                    if (dominio.length === 0 || (dominio.length > 0 && dominio[dominio.length - 1] === "-")) {
                        event.preventDefault();
                        return;
                    }
                }
            }
        });
    }

    validateStructure() {
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.inputElement.value);
        if (!correoValido) {
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
        const telefonoValido = this.inputElement.value.trim().length >= 10;
        if (!telefonoValido) {
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
        if (this.inputElement.value === "") return true;

        const fechaNacimiento = new Date(this.inputElement.value);
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
        }

        const isValid = edad >= 2 && edad <= 65;
        if (!isValid) {
            this.showError(this.errorMessages.get('AGE_RANGE_FIELD'));
            return false;
        } else {
            this.clearError();
            return true;
        }
    }
}

// Nueva clase para validación de fecha de activación
class ActivationDateValidator extends Validator {
    constructor(inputElement, errorMessages) {
        super(inputElement);
        this.errorMessages = errorMessages;
    }

    validateActivationDate() {
        if (this.inputElement.value === "") {
            return false;
        }

        const fechaActivacion = new Date(this.inputElement.value);
        const fechaActual = new Date();
        const diferenciaMilisegundos = fechaActivacion - fechaActual;
        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);

        const isValid = diferenciaHoras >= 6;
        if (!isValid) {
            if (this.inputElement.value !== "") {
                this.showError(this.errorMessages.get('ACTIVATION_DATE_RANGE'));
            } else {
                this.showError(this.errorMessages.get('REQUIRED'));
            }
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
        this.departamentos = [];
        this.municipios = [];
        this.clientId = "105e2e9a";
        this.clientSecret = "aa75c8b9c4a16f31ce1e2a278b341a98";
        this.urlMunicipios = "https://core-positiva-apis-pre-apicast-staging.apps.openshift4.positiva.gov.co/municipio/v1/positiva/scp/parametrica/consultaMunicipio";
        this.url_departamento = "https://core-positiva-apis-pre-apicast-staging.apps.openshift4.positiva.gov.co/departamento/v1/positiva/scp/parametrica/consultaDepartamento";
        this.tokenEndpoint = "https://keycloak-sso-app.apps.openshift4.positiva.gov.co/auth/realms/apis-pre/protocol/openid-connect/token";
    }

    async getCities() {
        const tokenRequestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
        };

        const tokenResponse = await fetch(this.tokenEndpoint, tokenRequestOptions);
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Accept: "*/*",
            },
        };

        const responseDepartamentos = await fetch(this.url_departamento, options);
        const responseMunicipios = await fetch(this.urlMunicipios, options);

        if (!responseMunicipios.ok || !responseDepartamentos.ok) {
            throw new Error("Error al obtener los municipios");
        }

        this.departamentos = await responseDepartamentos.json();
        this.municipios = await responseMunicipios.json();

        return { departamentos: this.departamentos, municipios: this.municipios };
    }

    filterMunicipalities(searchTerm) {
        return this.municipios.filter(municipio =>
            municipio.nombreMunicipio.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    getDepartmentById(departmentId) {
        return this.departamentos.find(dep => dep.idDepartamento === departmentId);
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
            if (!this.inputElement.contains(event.target) && !this.resultsElement.contains(event.target)) {
                this.clearResults();
            }
        });
    }

    handleInput() {
        const valor = this.inputElement.value.trim().toLowerCase();
        this.clearResults();

        if (valor) {
            const resultadosFiltrados = this.locationService.filterMunicipalities(valor);
            this.displayResults(resultadosFiltrados);
        }
    }

    displayResults(municipios) {
        municipios.forEach((municipio) => {
            const departamento = this.locationService.getDepartmentById(municipio.idDepartamento);
            const divResultado = document.createElement("div");
            divResultado.textContent = `${municipio.nombreMunicipio} - ${departamento?.NombreDepartamento}`;
            divResultado.classList.add("resultado-item");
            divResultado.addEventListener("click", () => {
                this.selectResult(municipio, departamento);
            });
            this.resultsElement.appendChild(divResultado);
        });
    }

    selectResult(municipio, departamento) {
        this.inputElement.value = `${municipio.nombreMunicipio} - ${departamento?.NombreDepartamento}`;
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
            this.modals.forEach((data, name) => {
                // Cierra el modal si se hace clic fuera de su contenido
                if (e.target === data.modal) {
                    this.closeModal(name);
                }
            });
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.modals.forEach((data, name) => this.closeModal(name));
            }
        });
    }

    registerModal(name, modalEl, closeEl) {
        if (!modalEl || !closeEl) {
            console.error(`Error al registrar el modal '${name}': uno de los elementos no fue encontrado.`);
            return;
        }
        this.modals.set(name, {
            modal: modalEl,
            close: closeEl
        });
        closeEl.addEventListener("click", () => this.closeModal(name));
    }

    openModal(name) {
        const md = this.modals.get(name);
        if (md) {
            md.modal.style.display = "flex"; // Usar flex para centrar
            md.modal.classList.add("active");
        }
    }

    closeModal(name) {
        const md = this.modals.get(name);
        if (md) {
            md.modal.classList.remove("active");
            // Ocultar después de que la animación de salida termine
            setTimeout(() => {
                md.modal.style.display = "none";
            }, 300); // 300ms debe coincidir con la duración de la transición en CSS
        }
    }
}
// Clase principal para manejar el formulario

class PersonalDataForm {
    constructor() {
        this.mediaQuery = window.matchMedia("(max-width: 768px)");
        this.locationService = new LocationService();
        this.modalManager = new ModalManager();
        this.errorMessages = new ErrorMessages();
        this.cityAutocomplete = null;
        this.elements = {};
        this.validators = {};

        // --- INICIO: Definiciones para la validación específica ---
        // ¡CAMBIA ESTOS VALORES POR LOS QUE NECESITES!
        this.blockedCedula = "123456789"; // Cédula que activará la validación especial
        this.incorrectExpeditionDate = "2014-06-25"; // Formato: AÑO-MES-DÍA

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
            'fechaActivacion', 'autorizacionDatos', 'formularioDatosPersonales',
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
        Validator.validateAlphanumeric(this.elements.primerNombre);
        Validator.validateAlphanumeric(this.elements.apellido);
        Validator.validateNumbers(this.elements.numeroDocumento);
        Validator.validateAddress(this.elements.direccionResidencia);
        this.validators.emailPrimary = new EmailValidator(this.elements.correoElectronico, this.errorMessages);
        this.validators.emailConfirm = new EmailValidator(this.elements.confirmarCorreo, this.errorMessages);
        this.validators.phone = new PhoneValidator(this.elements.telefono, this.errorMessages);
        this.validators.birthDate = new BirthDateValidator(this.elements.fechaNacimiento, this.errorMessages);
        this.validators.activationDate = new ActivationDateValidator(this.elements.fechaActivacion, this.errorMessages);
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
            await this.locationService.getCities();
        } catch (error) {
            console.error("Error al obtener los municipios:", error);
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

        const reloadButton = document.getElementById("reloadButton");
        if (reloadButton) {
            reloadButton.addEventListener("click", () => {
                document.getElementById("resumen-compra").style.display = "none";
                document.getElementById("form-anual").style.display = "block";
            });
        }

        // Manejadores para los otros modales
        const openInformationBtn = document.getElementById("openModalInformation");
        const informationModalEl = document.getElementById("modalInformation");
        const closeInformationEl = informationModalEl ? informationModalEl.querySelector(".modalInformation-close") : null;
        this.modalManager.registerModal("information", informationModalEl, closeInformationEl);
        if (openInformationBtn) {
            openInformationBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.modalManager.openModal("information");
            });
        }

        const openConfirmBtn = document.getElementById("openConfirmModal");
        const confirmModalEl = document.getElementById("confirmModal");
        const closeConfirmEl = document.getElementById("closeConfirmModal");
        this.modalManager.registerModal("confirm", confirmModalEl, closeConfirmEl);
        if (openConfirmBtn) {
            openConfirmBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.modalManager.openModal("confirm");
            });
        }
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
        const inputs = this.elements.formularioDatosPersonales.querySelectorAll("input[required], select[required]");
        inputs.forEach(input => this.clearFieldError(input));

        // --- 1. VALIDACIONES CRÍTICAS (MUESTRAN UN MODAL Y DETIENEN TODO) ---

        // a) Cédula bloqueada y fecha de expedición incorrecta
        const documentoValue = this.elements.numeroDocumento.value.trim();
        if (documentoValue === this.blockedCedula) {
            const fechaExpedicionValue = this.elements.fechaExpedicion.value;
            if (fechaExpedicionValue === this.incorrectExpeditionDate) {
                this.showCustomValidationErrorModal(this.invalidDateForBlockedCedulaMessage);
            } else {
                this.showCustomValidationErrorModal(this.blockedCedulaMessage);
            }
            return false;
        }

        // b) Rango de edad (Fecha de Nacimiento)
        if (this.elements.fechaNacimiento.value && !this.validators.birthDate.validateAge()) {
            this.showCustomValidationErrorModal(this.errorMessages.get('AGE_RANGE_MODAL'));
            return false;
        }

        // c) Rango de fecha de activación
        if (this.elements.fechaActivacion.value && !this.validators.activationDate.validateActivationDate()) {
            this.showCustomValidationErrorModal(this.errorMessages.get('ACTIVATION_DATE_MODAL'));
            return false;
        }

        // d) Coincidencia de correos
        if (this.elements.correoElectronico.value && this.elements.confirmarCorreo.value && (this.elements.correoElectronico.value !== this.elements.confirmarCorreo.value)) {
            this.showCustomValidationErrorModal(this.errorMessages.get('EMAIL_MISMATCH_MODAL'));
            return false;
        }

        // e) Autorización de datos
        if (!this.elements.autorizacionDatos.checked) {
            this.showCustomValidationErrorModal(this.errorMessages.get('DATA_AUTH_MODAL'));
            return false;
        }

        // --- 2. VALIDACIÓN DE CAMPOS REQUERIDOS Y DE FORMATO ---
        let isFormValid = true;

        inputs.forEach(input => {
            if ((input.type === 'checkbox' && !input.checked) || (!input.value && input.type !== 'checkbox')) {
                // La autorización de datos ya se validó arriba, así que la omitimos aquí.
                if (input.id !== 'autorizacionDatos') {
                    this.showFieldError(input, this.errorMessages.get('REQUIRED'));
                    isFormValid = false;
                }
            }
        });

        // Validaciones de estructura que no muestran modal, solo marcan el campo
        if (this.elements.correoElectronico.value && !this.validators.emailPrimary.validateStructure()) isFormValid = false;
        if (this.elements.confirmarCorreo.value && !this.validators.emailConfirm.validateStructure()) isFormValid = false;
        if (this.elements.telefono.value && !this.validators.phone.validatePhone()) isFormValid = false;
        if (this.elements.ciudad.value && !this.validateCity(this.elements.ciudad)) isFormValid = false;

        return isFormValid;
    }

    validateCity(cityInput) {
        const value = cityInput.value.trim().toLowerCase();
        const parts = value.split(" - ");
        if (parts.length === 2) {
            const municipalityInput = parts[0].trim();
            const departmentInput = parts[1].trim();
            const isValid = this.locationService.municipios.some(m => m.nombreMunicipio.toLowerCase() === municipalityInput) &&
                this.locationService.departamentos.some(d => d.NombreDepartamento.toLowerCase() === departmentInput);
            if (!isValid) {
                this.showFieldError(cityInput, this.errorMessages.get('INVALID_CITY'));
                return false;
            }
        } else {
            if (value) {
                this.showFieldError(cityInput, this.errorMessages.get('INVALID_CITY'));
                return false;
            }
        }
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
        // Primero, valida el formulario.
        if (this.validateForm()) {
            // Si es válido, procede al siguiente paso.
            this.onFormSuccess();
        } else {
            // Si no es válido, muestra el toast. Los modales ya se habrán mostrado si era necesario.
            this.onFormError();
        }
    }

    onFormSuccess() {
        console.log("Formulario válido");
        document.getElementById("form-anual").style.display = "none";
        document.getElementById("resumen-compra").style.display = "block";
        this.populateSummary();
    }

    onFormError() {
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
