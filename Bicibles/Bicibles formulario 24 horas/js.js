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
class PersonalDataForm {
    constructor() {
        this.mediaQuery = window.matchMedia("(max-width: 768px)");
        this.locationService = new LocationService();
        this.modalManager = new ModalManager();
        this.errorMessages = new ErrorMessages();
        this.cityAutocomplete = null;
        this.elements = {};
        this.validators = {};
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
            'fechaActivacion', 'autorizacionDatos', 'formularioDatosPersonales'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });

        this.elements.formGroup = document.querySelector(".form-anual__grupo");
        this.elements.containerCheckbox = document.querySelector(".etiqueta-checkbox");
        this.elements.botonContinuar = document.querySelector(".boton-continuar");
        this.elements.containerTitleModal = document.querySelector(".container__titleModal");
        this.elements.modal = document.getElementById("modalValidations");
        this.elements.closeModal = document.querySelector(".close");
        this.elements.nameModalFinal = document.getElementById("nameText__ModalFinal");
        this.elements.modalInfo = document.getElementById("modalInformation");
        this.elements.closeModalInfo = this.elements.modalInfo?.querySelector(".modalInformation-close");
        this.elements.confirmModal = document.getElementById("confirmModal");
        this.elements.closeConfirmModal = this.elements.confirmModal?.querySelector(".confirmModal-close");
    }

    setupSelectOptions() {
        const opcionesTipoDocumento = [
            { text: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" },
            { text: "NIT", value: "Número de Identificación Tributaria" },
        ];
        const opcionesTipoGenero = [
            { text: "Masculino", value: "Masculino" },
            { text: "Femenino", value: "Femenino" },
        ];

        this.mapDataSelect(opcionesTipoDocumento, this.elements.tipoDocumento);
        this.mapDataSelect(opcionesTipoGenero, this.elements.genero);
    }

    mapDataSelect(options, input) {
        options.forEach((opcion) => {
            const optionElement = document.createElement("option");
            optionElement.value = opcion.value;
            optionElement.textContent = opcion.text;
            input.appendChild(optionElement);
        });
    }

    setupValidations() {
        Validator.validateAlphanumeric(this.elements.primerNombre);
        Validator.validateAlphanumeric(this.elements.apellido);
        Validator.validateNumbers(this.elements.numeroDocumento);
        Validator.validateNumbers(this.elements.telefono);
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
            input.addEventListener("input", () => {
                this.clearFieldError(input);
            });
        });
    }

    clearFieldError(input) {
        input.style.borderColor = "#e0e0e0";
        const errorMessage = input.nextElementSibling;
        if (errorMessage) {
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
        this.cityAutocomplete = new CityAutocomplete(
            this.locationService,
            this.elements.ciudad,
            this.elements["resultado-ciudad"]
        );
    }

    setupModals() {
        this.modalManager.registerModal("validations", this.elements.modal, this.elements.closeModal);
    }

    setupEventListeners() {
        this.elements.botonContinuar.addEventListener("click", (event) => {
            this.handleSubmit(event);
        });

        const reloadButton = document.getElementById("reloadButton");
        if (reloadButton) {
            reloadButton.addEventListener("click", () => {
                const resumenCompra = document.getElementById("resumen-compra");
                const formAnual = document.getElementById("form-anual");
                resumenCompra.style.display = "none";
                formAnual.style.display = "block";
            });
        }
    }

    validateForm() {
        let formularioValido = true;
        const inputs = this.elements.formularioDatosPersonales.querySelectorAll("input, select");

        // Limpiar errores previos
        inputs.forEach((input) => {
            this.clearFieldError(input);
        });

        // Validar cada campo
        inputs.forEach((input) => {
            if (input.id === "ciudad") {
                if (!this.validateCity(input)) {
                    formularioValido = false;
                }
            } else if (!input.value) {
                this.showFieldError(input, this.errorMessages.get('REQUIRED'));
                this.gapInputContanier(false);
                formularioValido = false;
            }
        });

        if (!this.validators.emailPrimary.validateStructure()) {
            formularioValido = false;
        }
        if (!this.validators.emailConfirm.validateStructure()) {
            formularioValido = false;
        }
        if (!this.validators.phone.validatePhone()) {
            formularioValido = false;
        }

        // Validar fecha de activación
        if (!this.validators.activationDate.validateActivationDate()) {
            formularioValido = false;
            if (this.elements.fechaActivacion.value !== "") {
                const error = this.errorMessages.get('ACTIVATION_DATE_MODAL');
                this.showModal(error.title, error.body);
            }
            return false;
        }

        // Validar fecha de nacimiento
        if (!this.validators.birthDate.validateAge()) {
            formularioValido = false;
            const error = this.errorMessages.get('AGE_RANGE_MODAL');
            this.showModal(error.title, error.body);
            return false;
        }

        // Validar que los correos coincidan
        if (this.elements.correoElectronico.value !== this.elements.confirmarCorreo.value) {
            formularioValido = false;
            const error = this.errorMessages.get('EMAIL_MISMATCH_MODAL');
            this.showModal(error.title, error.body);
            return false;
        }

        // Validar checkbox
        if (!this.elements.autorizacionDatos.checked) {
            formularioValido = false;
            const error = this.errorMessages.get('DATA_AUTH_MODAL');
            this.elements.containerTitleModal.style.maxWidth = "23rem";
            this.elements.containerTitleModal.style.marginLeft = "1rem";
            this.showModal(error.title, error.body);
        }

        return formularioValido;
    }

    validateCity(ciudadInput) {
        const valor = ciudadInput.value.trim().toLowerCase();
        const partes = valor.split(" - ");

        if (partes.length === 2) {
            const municipioInput = partes[0].trim();
            const departamentoInput = partes[1].trim();

            const municipioValido = this.locationService.municipios.some((municipio) =>
                municipio.nombreMunicipio.toLowerCase() === municipioInput
            );
            const departamentoValido = this.locationService.departamentos.some((departamento) =>
                departamento.NombreDepartamento.toLowerCase() === departamentoInput
            );

            if (!municipioValido || !departamentoValido) {
                this.showFieldError(ciudadInput, this.errorMessages.get('INVALID_CITY'));
                this.gapInputContanier(false);
                this.elements.containerCheckbox.style.marginTop = "0.5rem";
                return false;
            }
        } else {
            this.showFieldError(ciudadInput, this.errorMessages.get('INVALID_CITY'));
            this.gapInputContanier(false);
            this.elements.containerCheckbox.style.marginTop = "0.5rem";
            return false;
        }
        return true;
    }

    showFieldError(input, message) {
        input.style.borderColor = "red";
        const errorMessage = input.nextElementSibling;
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    }

    showModal(title, message) {
        const modalTitle = this.elements.modal.querySelector("h2");
        const modalParagraph = this.elements.modal.querySelector("p");
        modalTitle.textContent = title;
        modalParagraph.textContent = message;
        this.modalManager.openModal("validations");
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
        this.gapInputContanier();
        this.elements.containerCheckbox.style.marginTop = "0";

        const elemento = document.getElementById("form-anual");
        elemento.style.display = "none";
        const elementoResumen = document.getElementById("resumen-compra");
        elementoResumen.style.display = "block";

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
        const spanNombre = document.getElementById("nombre");
        const spanTipoDocumento = document.getElementById("tipoDocumentoResumen");
        const spanDocumento = document.getElementById("documento");
        const spanFechaExpedicion = document.getElementById("fechaExpedicionResumen");
        const spanDireccion = document.getElementById("direccion");
        const spanFechaNacimiento = document.getElementById("fechaNacimientoResumen");
        const spanCiudadResumen = document.getElementById("CiudadResumen");
        const spanEmail = document.getElementById("email");
        const spanCelular = document.getElementById("celular");

        // Asignar texto al span
        spanNombre.textContent = `${this.elements.primerNombre.value} ${this.elements.apellido.value}`;
        this.elements.nameModalFinal.textContent = spanNombre.textContent;
        spanTipoDocumento.textContent = this.elements.tipoDocumento.value;
        spanDocumento.textContent = this.elements.numeroDocumento.value;
        spanFechaExpedicion.textContent = this.elements.fechaExpedicion.value;
        spanDireccion.textContent = this.elements.direccionResidencia.value;
        spanFechaNacimiento.textContent = this.elements.fechaNacimiento.value;
        spanCiudadResumen.textContent = this.elements.ciudad.value;
        spanEmail.textContent = this.elements.correoElectronico.value;
        spanCelular.textContent = this.elements.telefono.value;
    }

    gapInputContanier(aux = true) {
        if (this.mediaQuery.matches) {
            this.elements.formGroup.style.rowGap = "10px";
        } else {
            if (aux) {
                this.elements.formGroup.style.rowGap = "20px";
            } else {
                this.elements.formGroup.style.rowGap = "30px";
            }
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
