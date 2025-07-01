(function() {
    var fragmentElement = document.querySelector('#fragment-4448910-prap'); 
    var configuration = {};
    
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
                const alphanumericRegex = /^[a-zA-Z0-9 ]$/;
                if (!alphanumericRegex.test(char)) {
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
        static validateOnlyLetters(inputElement) {
            inputElement.addEventListener("keypress", (event) => {
                const char = String.fromCharCode(event.which);
                const lettersRegex = /^[a-zA-Z ]$/;
                if (!lettersRegex.test(char)) {
                    event.preventDefault();
                }
            });
        }
        static validateAddress(inputElement) {
            inputElement.addEventListener("keypress", (event) => {
                const char = String.fromCharCode(event.which);
                // Permite letras, números, espacios, # y -
                const addressRegex = /^[a-zA-Z0-9 #\-]$/;
                if (!addressRegex.test(char)) {
                    event.preventDefault();
                }
            });
        }
    }

    // Clase para centralizar mensajes de error
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
                }
            };
        }

        get(key) {
            return this.messages[key] || "Error desconocido.";
        }
    }

    // Clase para manejar validación de emails
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
            if (this.inputElement.value === "") return true;
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

    // Clase para manejar datos de ubicación
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

    // Clase para manejar autocompletado de ciudades
    class CityAutocomplete {
        constructor(locationService, inputElements, resultElements) {
            this.locationService = locationService;
            this.inputElements = inputElements;
            this.resultElements = resultElements;
            this.setupEventListeners();
        }

        setupEventListeners() {
            this.inputElements.forEach((input, index) => {
                input.addEventListener("input", () => {
                    this.handleInput(input, this.resultElements[index]);
                });
            });

            document.addEventListener("click", (event) => {
                const isInputClick = this.inputElements.some(input => input.contains(event.target));
                if (!isInputClick) {
                    this.clearAllResults();
                }
            });
        }

        handleInput(inputElement, resultElement) {
            const value = inputElement.value.trim().toLowerCase();
            resultElement.innerHTML = "";
            
            if (value) {
                const filteredResults = this.locationService.filterMunicipalities(value);
                this.displayResults(filteredResults, inputElement, resultElement);
            }
        }

        displayResults(municipalities, inputElement, resultElement) {
            municipalities.forEach(municipality => {
                const department = this.locationService.getDepartmentById(municipality.idDepartamento);
                const resultDiv = document.createElement("div");
                resultDiv.textContent = `${municipality.nombreMunicipio} - ${department?.NombreDepartamento}`;
                resultDiv.classList.add("resultado-item");
                
                resultDiv.addEventListener("click", () => {
                    this.selectResult(municipality, department, inputElement, resultElement);
                });
                
                resultElement.appendChild(resultDiv);
            });
        }

        selectResult(municipality, department, inputElement, resultElement) {
            inputElement.value = `${municipality.nombreMunicipio} - ${department?.NombreDepartamento}`;
            resultElement.innerHTML = "";
        }

        clearAllResults() {
            this.resultElements.forEach(result => result.innerHTML = "");
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
            
            if (closeEl) {
                closeEl.addEventListener("click", () => this.closeModal(name));
            }
        }

        openModal(name) {
            const md = this.modals.get(name);
            if (md) {
                md.modal.style.display = "flex";
                md.modal.classList.add("active");
            }
        }

        closeModal(name) {
            const md = this.modals.get(name);
            if (md) {
                md.modal.style.display = "none";
                md.modal.classList.remove("active");
            }
        }
    }

    // Clase para manejar utilidades
    class FormUtils {
        static mapDataToSelect(options, selectElement) {
            options.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                selectElement.appendChild(optionElement);
            });
        }

        static populateYearSelect(selectId, yearQuery) {
            const yearSelect = document.getElementById(selectId);
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 7;
            
            for (let year = startYear + 1; year <= currentYear; year++) {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            }
            
            yearSelect.value = yearQuery;
        }

        static getQueryParams() {
            const urlActual = window.location.href;
            const url = new URL(urlActual);
            const params = new URLSearchParams(url.search);
            const queryParams = {};
            
            for (const [key, value] of params.entries()) {
                queryParams[key] = value;
            }
            
            return queryParams;
        }

        static updateTitle(tabValue, titleElement) {
            if (tabValue === "para-tu-bici") {
                titleElement.innerHTML = `Para <span>tu bici</span>`;
            } else if (tabValue === "para-ti-y-tu-bici") {
                titleElement.innerHTML = `Para ti y <span>tu bici</span>`;
            }
        }
    }

    // Clase principal para manejar el formulario de bicicletas
    class BikePersonalDataForm {
    constructor() {
        this.mediaQuery = window.matchMedia("(max-width: 768px)");
        this.locationService = new LocationService();
        this.modalManager = new ModalManager();
        this.errorMessages = new ErrorMessages();
        this.cityAutocomplete = null;
        this.elements = {};
        this.validators = {};
        this.queryParams = {};
        this.isValid = false;
    }

    async init() {
        this.queryParams = FormUtils.getQueryParams();
        this.getElements();
        this.setupSelectOptions();
        this.setupValidations();
        await this.loadLocationData();
        this.setupCityAutocomplete();
        this.setupModals();
        this.setupEventListeners();
        this.setupUI();
    }

    getElements() {
        const elementIds = [
            'tipoDocumento', 'numeroDocumento', 'direccionResidencia', 'primerNombre',
            'apellido', 'genero', 'correoElectronico', 'confirmarCorreo', 'telefono',
            'ciudadPersona', 'fechaNacimiento', 'fechaExpedicion', 'autorizacionDatos',
            'formularioDatosPersonales1', 'formularioDatosPersonales2',
            'ciudadBici', 'year', 'color', 'numeroMarco', 'marca', 'clase', 'tipo',
            'linea', 'numeroSticker'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });

        // Elementos adicionales
        this.elements.formGroup = document.querySelector(".form-anual__grupo");
        this.elements.formGroup2 = document.querySelector(".form-anual__grupo-2");
        this.elements.containerCheckbox = document.querySelector(".etiqueta-checkbox");
        this.elements.botonContinuar = document.querySelector(".boton-continuar");
        this.elements.tituloElement = document.querySelector(".form-anual__titulo");
        this.elements.ciudadInputs = document.querySelectorAll(".ciudad");
        this.elements.resultadoCiudades = document.querySelectorAll(".resultado-ciudad");
        this.elements.containerTitleModal = document.querySelector(".container__titleModal");
        this.elements.nameModalFinal = document.getElementById("nameText__ModalFinal");
    }

    setupSelectOptions() {
        const documentTypes = [
            { text: "Cédula de Ciudadanía", value: "Cédula de Ciudadanía" },
            { text: "NIT", value: "Número de Identificación Tributaria" },
        ];
        const genderTypes = [
            { text: "Masculino", value: "Masculino" },
            { text: "Femenino", value: "Femenino" },
        ];

        FormUtils.mapDataToSelect(documentTypes, this.elements.tipoDocumento);
        FormUtils.mapDataToSelect(genderTypes, this.elements.genero);
    }

    setupValidations() {
        // Aplicar validaciones básicas
        Validator.validateAlphanumeric(this.elements.numeroDocumento);
        Validator.validateAddress(this.elements.direccionResidencia);
        Validator.validateOnlyLetters(this.elements.primerNombre); 
        Validator.validateOnlyLetters(this.elements.apellido); 
        Validator.validateNumbers(this.elements.telefono);
        Validator.validateNumbers(this.elements.numeroDocumento);
        Validator.validateNumbers(this.elements.numeroMarco);
        Validator.validateNumbers(this.elements.numeroSticker);

        // Crear instancias de validadores
        this.validators.emailPrimary = new EmailValidator(this.elements.correoElectronico, this.errorMessages);
        this.validators.emailConfirm = new EmailValidator(this.elements.confirmarCorreo, this.errorMessages);
        this.validators.phone = new PhoneValidator(this.elements.telefono, this.errorMessages);
        this.validators.birthDate = new BirthDateValidator(this.elements.fechaNacimiento, this.errorMessages);

        this.setupErrorClearing();
    }

    setupErrorClearing() {
        const inputs1 = this.elements.formularioDatosPersonales1.querySelectorAll("input, select");
        const inputs2 = this.elements.formularioDatosPersonales2.querySelectorAll("input, select");
        const allInputs = [...inputs1, ...inputs2];

        allInputs.forEach(input => {
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
            await this.locationService.loadLocations();
        } catch (error) {
            console.error("Error al cargar datos de ubicación:", error);
        }
    }

    setupCityAutocomplete() {
        this.cityAutocomplete = new CityAutocomplete(
            this.locationService,
            Array.from(this.elements.ciudadInputs),
            Array.from(this.elements.resultadoCiudades)
        );
    }

    setupModals() {
        // Modal de validaciones
        const modalValidations = document.getElementById("modalValidations");
        const closeModal = modalValidations?.querySelector(".close");
        if (modalValidations && closeModal) {
            this.modalManager.registerModal("validations", modalValidations, closeModal);
        }

        // Modal de información
        const modalInfo = document.getElementById("modalInformation");
        const closeModalInfo = modalInfo?.querySelector(".modalInformation-close");
        if (modalInfo && closeModalInfo) {
            this.modalManager.registerModal("information", modalInfo, closeModalInfo);
        }

        // Modal de confirmación
        const confirmModal = document.getElementById("confirmModal");
        const closeConfirmModal = confirmModal?.querySelector(".confirmModal-close");
        if (confirmModal && closeConfirmModal) {
            this.modalManager.registerModal("confirm", confirmModal, closeConfirmModal);
        }

        // Modal de registro
        const modalRegister = document.getElementById("modalRegister");
        const closeModalRegister = document.getElementById("closeModalRegister");
        if (modalRegister && closeModalRegister) {
            this.modalManager.registerModal("register", modalRegister, closeModalRegister);
        }
    }

    setupEventListeners() {
        this.elements.botonContinuar.addEventListener("click", (event) => {
            this.handleSubmit(event);
        });

        // Event listener para el campo de número de documento
        this.elements.numeroDocumento.addEventListener('input', (event) => {
            this.validateCedula(event.target.value);
        });

        // Botón para abrir modal de información
        const openModal = document.getElementById("openModal");
        if (openModal) {
            openModal.addEventListener("click", (event) => {
                event.preventDefault();
                this.modalManager.openModal("information");
            });
        }

        // Botón para abrir modal de confirmación
        const openConfirmModal = document.getElementById("openConfirmModal");
        if (openConfirmModal) {
            openConfirmModal.addEventListener("click", (event) => {
                event.preventDefault();
                this.modalManager.openModal("confirm");
            });
        }

        // Botón para abrir modal de registro
        const btnModalRegister = document.getElementById("btnModalRegister");
        if (btnModalRegister) {
            btnModalRegister.addEventListener("click", () => {
                this.modalManager.openModal("register");
            });
        }

        // Botón de recarga/edición
        const reloadButton = document.getElementById("reloadButton");
        if (reloadButton) {
            reloadButton.addEventListener("click", () => {
                this.showForms();
            });
        }

        // Cerrar modales con Escape
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.modalManager.closeModal("confirm");
                this.modalManager.closeModal("information");
                this.modalManager.closeModal("register");
            }
        });
    }

    setupUI() {
        FormUtils.updateTitle(this.queryParams.tab, this.elements.tituloElement);
        FormUtils.populateYearSelect("year", this.queryParams.biciYear);
    }
    
    // Función para validar la cédula específica
   validateCedula(cedula) {
        if (cedula === '123456789') {
            const title = "No es posible continuar con el proceso";
            const body = "El tipo y número de documento ingresados no han superado las validaciones establecidas. Si tienes alguna inquietud, comunícate con nuestro equipo de soporte para obtener más información.";
            this.showModalError(title, body);

            // Seleccionamos el botón de cerrar del modal de validaciones
            const closeModalButton = document.getElementById("modalValidations").querySelector(".close");

            // Creamos una función manejadora para poder añadirla y quitarla
            const handleErrorAfterClose = () => {
                this.showFieldError(this.elements.numeroDocumento, "Este número de documento no puede continuar");
                // Removemos el event listener para que no se ejecute múltiples veces
                closeModalButton.removeEventListener('click', handleErrorAfterClose);
            };

            // Añadimos un event listener al botón de cerrar del pop-up
            closeModalButton.addEventListener('click', handleErrorAfterClose);

            return false;
        }
        return true;
    }


     validateForm() {
        let isFormValid = true;
        const inputs1 = this.elements.formularioDatosPersonales1.querySelectorAll("input, select");
        const inputs2 = this.elements.formularioDatosPersonales2.querySelectorAll("input, select");
        const allInputs = [...inputs1, ...inputs2];

        // Limpiar errores previos
        allInputs.forEach(input => this.clearFieldError(input));

        // --- INICIO DE LA NUEVA VALIDACIÓN ---
        // Validación especial para cédula y fecha de expedición específicas
        if (this.elements.numeroDocumento.value === '123456789' && this.elements.fechaExpedicion.value === '2014-06-25') {
            const title = "Fecha de expedición no válida";
            const body = "Por favor, asegúrate de que la fecha de expedición del documento sea correcta para continuar.";
            this.showModalError(title, body);
            return false; // Detiene la validación para mostrar solo este error
        }
        // --- FIN DE LA NUEVA VALIDACIÓN ---

        // Validar la cédula antes de las demás validaciones
        if (!this.validateCedula(this.elements.numeroDocumento.value)) {
            return false; 
        }

        // Validar campos requeridos
        allInputs.forEach(input => {
            if (input.classList.contains("ciudad")) {
                if (!this.validateAllCities()) {
                    isFormValid = false;
                }
            } else if (!input.value) {
                this.showFieldError(input, this.errorMessages.get('REQUIRED'));
                isFormValid = false;
            }
        });

        // Validaciones específicas
        if (!this.validators.emailPrimary.validateStructure()) isFormValid = false;
        if (!this.validators.emailConfirm.validateStructure()) isFormValid = false;
        if (!this.validators.phone.validatePhone()) isFormValid = false;

        // Validar edad
        if (!this.validators.birthDate.validateAge()) {
            const error = this.errorMessages.get('AGE_RANGE_MODAL');
            this.showModalError(error.title, error.body);
            return false;
        }

        // Validar coincidencia de correos
        if (this.elements.correoElectronico.value !== this.elements.confirmarCorreo.value) {
            const error = this.errorMessages.get('EMAIL_MISMATCH_MODAL');
            this.showModalError(error.title, error.body);
            return false;
        }

        // Validar checkbox
        if (!this.elements.autorizacionDatos.checked) {
            const error = this.errorMessages.get('DATA_AUTH_MODAL');
            this.showModalError(error.title, error.body);
            this.elements.containerTitleModal.style.maxWidth = "23rem";
            this.elements.containerTitleModal.style.marginLeft = "1rem";
            isFormValid = false;
        }

        return isFormValid;
    }

    validateAllCities() {
        let allCitiesValid = true;
        
        this.elements.ciudadInputs.forEach((ciudadInput) => {
            const value = ciudadInput.value.trim().toLowerCase();
            const parts = value.split(" - ");
            
            if (parts.length === 2) {
                const municipalityInput = parts[0].trim();
                const departmentInput = parts[1].trim();
                
                const municipalityValid = this.locationService.municipalities.some(
                    m => m.nombreMunicipio.toLowerCase() === municipalityInput
                );
                const departmentValid = this.locationService.departments.some(
                    d => d.NombreDepartamento.toLowerCase() === departmentInput
                );
                
                if (!municipalityValid || !departmentValid) {
                    this.showFieldError(ciudadInput, this.errorMessages.get('INVALID_CITY'));
                    allCitiesValid = false;
                }
            } else {
                this.showFieldError(ciudadInput, this.errorMessages.get('REQUIRED'));
                allCitiesValid = false;
            }
        });

        if (!allCitiesValid) {
            this.adjustFormSpacing();
            this.elements.containerCheckbox.style.marginTop = "0.5rem";
        }

        return allCitiesValid;
    }

    showFieldError(input, message) {
        input.style.borderColor = "red";
        const errorMessage = input.nextElementSibling;
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = "block";
        }
    }

    showModalError(title, body) {
        const modal = document.getElementById("modalValidations");
        const modalTitle = modal?.querySelector("h2");
        const modalParagraph = modal?.querySelector("p");
        
        if (modalTitle && modalParagraph) {
            modalTitle.textContent = title;
            modalParagraph.textContent = body;
            this.modalManager.openModal("validations");
        }
    }

    adjustFormSpacing() {
        if (this.mediaQuery.matches) {
            this.elements.formGroup.style.rowGap = "10px";
            this.elements.formGroup2.style.rowGap = "10px";
        } else {
            this.elements.formGroup.style.rowGap = "30px";
            this.elements.formGroup2.style.rowGap = "30px";
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
        this.adjustFormSpacing();
        this.elements.containerCheckbox.style.marginTop = "0";
        this.hideForms();
        this.showSummary();
        this.populateSummary();
    }

    onFormError() {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.classList.add("showToastError");
            setTimeout(() => {
                toast.classList.remove("showToastError");
            }, 3000);
        }
    }

    hideForms() {
        const formPersona = document.querySelector(".form__anualPersonal");
        const formBici = document.querySelector(".form__anualBici");
        
        if (formPersona) formPersona.style.display = "none";
        if (formBici) formBici.style.display = "none";
    }

    showForms() {
        const resumenCompra = document.getElementById("resumen-compra");
        const formPersona = document.querySelector(".form__anualPersonal");
        const formBici = document.querySelector(".form__anualBici");
        
        if (resumenCompra) resumenCompra.style.display = "none";
        if (formPersona) formPersona.style.display = "block";
        if (formBici) formBici.style.display = "block";
    }

    showSummary() {
        const resumenElement = document.getElementById("resumen-compra");
        if (resumenElement) {
            resumenElement.style.display = "block";
        }
    }

    populateSummary() {
        const summaryMapping = {
            // Datos personales
            nombre: `${this.elements.primerNombre.value} ${this.elements.apellido.value}`,
            tipoDocumentoResumen: this.elements.tipoDocumento.value,
            documento: this.elements.numeroDocumento.value,
            fechaExpedicionResumen: this.elements.fechaExpedicion.value,
            direccion: this.elements.direccionResidencia.value,
            fechaNacimientoResumen: this.elements.fechaNacimiento.value,
            ciudadResumenPersona: this.elements.ciudadPersona.value,
            email: this.elements.correoElectronico.value,
            celular: this.elements.telefono.value,
            // Datos de la bicicleta
            ciudadResumenBici: this.elements.ciudadBici.value,
            añoCompra: this.elements.year.value,
            colorResumen: this.elements.color.value,
            numeroMarcoResumen: this.elements.numeroMarco.value,
            claseResumen: this.elements.clase.value,
            marcaResumen: this.elements.marca.value,
            lineaResumen: this.elements.linea.value,
            tipoResumen: this.elements.tipo.value,
            stickerResumen: this.elements.numeroSticker.value,
            costoBici: this.queryParams.biciValue
        };

        Object.keys(summaryMapping).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = summaryMapping[id];
        }
    });

    // Actualizar nombre en modal final
    if (this.elements.nameModalFinal) {
        this.elements.nameModalFinal.textContent = summaryMapping.nombre;
    }
}
}
// Clase base para manejo de opciones de selectores
class SelectOption {
    constructor(value, text, code = null) {
        this.value = value;
        this.text = text;
        this.code = code;
    }

    toSelectFormat() {
        return {
            value: this.value,
            text: this.text
        };
    }
}

// Clase para manejar marcas de bicicletas
class BikeMarkService {
    constructor() {
        this.marks = [
            new SelectOption("trek", "Trek"),
            new SelectOption("specialized", "Specialized"),
            new SelectOption("giant", "Giant"),
            new SelectOption("cannondale", "Cannondale"),
            new SelectOption("scott", "Scott"),
            new SelectOption("merida", "Merida"),
            new SelectOption("bianchi", "Bianchi"),
            new SelectOption("orbea", "Orbea"),
            new SelectOption("cube", "Cube"),
            new SelectOption("focus", "Focus"),
            new SelectOption("santa_cruz", "Santa Cruz"),
            new SelectOption("pinarello", "Pinarello"),
            new SelectOption("cervelo", "Cervélo"),
            new SelectOption("colnago", "Colnago"),
            new SelectOption("bmc", "BMC"),
            new SelectOption("canyon", "Canyon"),
            new SelectOption("ridley", "Ridley"),
            new SelectOption("felt", "Felt"),
            new SelectOption("fuji", "Fuji"),
            new SelectOption("kona", "Kona"),
            new SelectOption("gt", "GT"),
            new SelectOption("mongoose", "Mongoose"),
            new SelectOption("surly", "Surly"),
            new SelectOption("salsa", "Salsa"),
            new SelectOption("yeti", "Yeti"),
            new SelectOption("otra", "Otra")
        ];
    }

    getAll() {
        return this.marks.map(mark => mark.toSelectFormat());
    }

    getByValue(value) {
        return this.marks.find(mark => mark.value === value);
    }

    search(searchTerm) {
        return this.marks.filter(mark => 
            mark.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Clase para manejar clases/categorías de bicicletas
class BikeClassService {
    constructor() {
        this.classes = [
            new SelectOption("montana", "Bicicleta de Montaña"),
            new SelectOption("ruta", "Bicicleta de Ruta"),
            new SelectOption("hibrida", "Bicicleta Híbrida"),
            new SelectOption("urbana", "Bicicleta Urbana"),
            new SelectOption("bmx", "BMX"),
            new SelectOption("gravel", "Bicicleta Gravel"),
            new SelectOption("ciclocross", "Ciclocross"),
            new SelectOption("plegable", "Bicicleta Plegable"),
            new SelectOption("electrica", "Bicicleta Eléctrica"),
            new SelectOption("cruiser", "Cruiser"),
            new SelectOption("fixie", "Fixie/Single Speed"),
            new SelectOption("touring", "Bicicleta de Touring"),
            new SelectOption("tandem", "Bicicleta Tándem"),
            new SelectOption("fatbike", "Fat Bike"),
            new SelectOption("infantil", "Bicicleta Infantil"),
            new SelectOption("triciclo", "Triciclo"),
            new SelectOption("recumbent", "Bicicleta Recumbente"),
            new SelectOption("cargo", "Bicicleta de Carga"),
            new SelectOption("trial", "Bicicleta de Trial"),
            new SelectOption("downhill", "Bicicleta Downhill")
        ];
    }

    getAll() {
        return this.classes.map(bikeClass => bikeClass.toSelectFormat());
    }

    getByValue(value) {
        return this.classes.find(bikeClass => bikeClass.value === value);
    }

    search(searchTerm) {
        return this.classes.filter(bikeClass => 
            bikeClass.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Clase para manejar tipos específicos de bicicletas
class BikeTypeService {
    constructor() {
        this.types = [
            new SelectOption("xc", "Cross Country (XC)"),
            new SelectOption("trail", "Trail"),
            new SelectOption("enduro", "Enduro"),
            new SelectOption("all_mountain", "All Mountain"),
            new SelectOption("downhill_type", "Downhill"),
            new SelectOption("freeride", "Freeride"),
            new SelectOption("dirt_jump", "Dirt Jump"),
            new SelectOption("road_racing", "Carrera de Ruta"),
            new SelectOption("time_trial", "Contrarreloj"),
            new SelectOption("triathlon", "Triatlón"),
            new SelectOption("aero", "Aerodinámica"),
            new SelectOption("climbing", "Escalada"),
            new SelectOption("endurance", "Resistencia"),
            new SelectOption("commuter", "Transporte"),
            new SelectOption("comfort", "Confort"),
            new SelectOption("fitness", "Fitness"),
            new SelectOption("trekking", "Trekking"),
            new SelectOption("city", "Ciudad"),
            new SelectOption("dutch", "Holandesa"),
            new SelectOption("vintage", "Vintage/Clásica"),
            new SelectOption("racing", "Competición"),
            new SelectOption("freestyle", "Freestyle"),
            new SelectOption("street", "Street"),
            new SelectOption("park", "Park"),
            new SelectOption("vert", "Vert")
        ];
    }

    getAll() {
        return this.types.map(type => type.toSelectFormat());
    }

    getByValue(value) {
        return this.types.find(type => type.value === value);
    }

    search(searchTerm) {
        return this.types.filter(type => 
            type.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Clase para manejar códigos CIIU (Clasificación Industrial Internacional Uniforme)
class CIIUService {
    constructor() {
        this.codes = [
            new SelectOption("4540", "Comercio, mantenimiento y reparación de motocicletas y de sus partes, piezas y accesorios", "4540"),
            new SelectOption("4761", "Comercio al por menor de libros, periódicos, artículos de papelería y escritorio", "4761"),
            new SelectOption("4762", "Comercio al por menor de artículos deportivos", "4762"),
            new SelectOption("4769", "Comercio al por menor de otros artículos en establecimientos especializados", "4769"),
            new SelectOption("3092", "Fabricación de bicicletas y de sillas de ruedas para personas con discapacidad", "3092"),
            new SelectOption("9319", "Otras actividades deportivas", "9319"),
            new SelectOption("9321", "Actividades de parques de diversiones y parques temáticos", "9321"),
            new SelectOption("7729", "Alquiler y arrendamiento de otros efectos personales y enseres domésticos", "7729"),
            new SelectOption("8551", "Educación deportiva y recreativa", "8551"),
            new SelectOption("4659", "Comercio al por mayor de otros enseres domésticos", "4659"),
            new SelectOption("4791", "Comercio al por menor realizado a través de internet", "4791"),
            new SelectOption("4792", "Comercio al por menor realizado a través de casas de venta o por correo", "4792"),
            new SelectOption("9511", "Mantenimiento y reparación de computadores y equipo periférico", "9511"),
            new SelectOption("9512", "Mantenimiento y reparación de equipos de comunicación", "9512"),
            new SelectOption("9529", "Mantenimiento y reparación de otros efectos personales y enseres domésticos", "9529"),
            new SelectOption("8299", "Otras actividades de servicios de apoyo a las empresas", "8299"),
            new SelectOption("5221", "Actividades de servicios vinculadas al transporte terrestre", "5221"),
            new SelectOption("7721", "Alquiler y arrendamiento de equipo recreativo y deportivo", "7721"),
            new SelectOption("4663", "Comercio al por mayor de maquinaria y equipo de transporte", "4663"),
            new SelectOption("6209", "Otras actividades de tecnologías de información y actividades de servicios informáticos", "6209")
        ];
    }

    getAll() {
        return this.codes.map(code => ({
            value: code.code,
            text: `${code.code} - ${code.text}`
        }));
    }

    getByCode(code) {
        return this.codes.find(item => item.code === code);
    }

    search(searchTerm) {
        return this.codes.filter(code => 
            code.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            code.code.includes(searchTerm)
        );
    }

    getBikeRelatedCodes() {
        // Filtrar solo los códigos más relacionados con bicicletas
        const bikeRelatedCodes = ["3092", "4762", "4540", "9319", "7721"];
        return this.codes.filter(code => bikeRelatedCodes.includes(code.code));
    }
}

// Clase principal para gestionar todos los servicios de datos
class BikeDataManager {
    constructor() {
        this.markService = new BikeMarkService();
        this.classService = new BikeClassService();
        this.typeService = new BikeTypeService();
        this.ciiuService = new CIIUService();
    }

    // Métodos para obtener datos de marcas
    getMarks() {
        return this.markService.getAll();
    }

    searchMarks(searchTerm) {
        return this.markService.search(searchTerm);
    }

    // Métodos para obtener datos de clases
    getClasses() {
        return this.classService.getAll();
    }

    searchClasses(searchTerm) {
        return this.classService.search(searchTerm);
    }

    // Métodos para obtener datos de tipos
    getTypes() {
        return this.typeService.getAll();
    }

    searchTypes(searchTerm) {
        return this.typeService.search(searchTerm);
    }

    // Métodos para obtener códigos CIIU
    getCIIUCodes() {
        return this.ciiuService.getAll();
    }

    getBikeRelatedCIIU() {
        return this.ciiuService.getBikeRelatedCodes();
    }

    searchCIIU(searchTerm) {
        return this.ciiuService.search(searchTerm);
    }

    // Método para poblar selectores HTML
    populateSelect(selectElement, options) {
        // Limpiar opciones existentes
        selectElement.innerHTML = '<option value="">Seleccione una opción</option>';
        
        // Agregar nuevas opciones
        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    }

    // Método para inicializar todos los selectores con los IDs específicos
    initializeSelectors() {
        const selectorsConfig = {
            'marca': this.getMarks(),
            'clase': this.getClasses(),
            'tipo': this.getTypes(),
            'actCIUU': this.getCIIUCodes()
        };

        Object.keys(selectorsConfig).forEach(selectorId => {
            const selectElement = document.getElementById(selectorId);
            if (selectElement) {
                this.populateSelect(selectElement, selectorsConfig[selectorId]);
            }
        });
    }

    // Método específico para integrar con el formulario de bicicletas existente
    integrateWithBikeForm(bikeFormInstance) {
        // Agregar los nuevos elementos al objeto elements del formulario
        bikeFormInstance.elements.marca = document.getElementById('marca');
        bikeFormInstance.elements.clase = document.getElementById('clase');
        bikeFormInstance.elements.tipo = document.getElementById('tipo');
        bikeFormInstance.elements.actCIUU = document.getElementById('actCIUU');

        // Poblar los selectores
        this.initializeSelectors();

        // Agregar validaciones si es necesario
        this.setupSelectValidations(bikeFormInstance);
    }

    // Configurar validaciones para los nuevos selectores
    setupSelectValidations(bikeFormInstance) {
        const selectElements = [
            bikeFormInstance.elements.marca,
            bikeFormInstance.elements.clase,
            bikeFormInstance.elements.tipo,
            bikeFormInstance.elements.actCIUU
        ].filter(element => element !== null);

        selectElements.forEach(selectElement => {
            selectElement.addEventListener("change", () => {
                bikeFormInstance.clearFieldError(selectElement);
            });
        });
    }
}


// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
    // Crear instancia del gestor de datos
    const bikeDataManager = new BikeDataManager();
    
    // Inicializar selectores inmediatamente
    bikeDataManager.initializeSelectors();
    
    // Inicializar el formulario principal
    const bikeForm = new BikePersonalDataForm();
    await bikeForm.init();
});

})();