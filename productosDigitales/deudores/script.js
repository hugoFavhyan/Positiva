/**
 * @class UIManager
 * Handles all DOM manipulations and UI updates.
 */
class UIManager {
    constructor() {
        this.dom = {
            // General Modals
            errorModal: document.querySelector(".CotizadorDeu_errorcitoModal"),
            errorTitle: document.querySelector(".CotizadorDeu_errorcitoModal_titleC_t"),
            errorMessage: document.querySelector(".CotizadorDeu_errorcitoModal_titleC_p"),
            closeModalConFoto: document.querySelector(".closeModalCotizarSeguro"),
            equisModalArriba: document.querySelector(".CotizadorDeu_errorcitoModal_x"),
            // Specific Modal for amount error
            errorModal_CotizarSeguro: document.querySelector("#errorModal_CotizarSeguro"),
            // Quote results
            montoResultadoCotiza: document.querySelector(".resultadoCotizacion_containerCosto_total"),
            tiempoDePagoResultadoCotiza: document.querySelector(".resultadoCotizacion_bgGray_anual"),
            resultadoCotizacionInfoCoti: document.querySelector(".resultadoCotizacionInfoCoti"),
            resultadoCotizacionImg: document.querySelector(".resultadoCotizacionImg"),
            containerButtonResultadoCotiza: document.querySelector(".containerButtonResultadoCotiza"),
            // Contact Form
            containerFormContactCotiza: document.querySelector(".containerFormContactCotiza"),
            // Autocomplete lists
            autocompleteListOcupacion: document.getElementById("autocompleteListOcupacion"),
            autocompleteListDepartamento: document.getElementById("autocompleteListDepartamento"),
        };
        this.isModalVisible = false;
    }

    /**
     * Initializes the UI event listeners.
     */
    init() {
        this.dom.closeModalConFoto.addEventListener("click", () => {
            this.hideModal(this.dom.errorModal_CotizarSeguro);
        });
        this.dom.equisModalArriba.addEventListener("click", () => {
            this.hideModal(this.dom.errorModal);
        });
        this.dom.errorModal_CotizarSeguro.addEventListener("click", (event) => {
            if (event.target === this.dom.errorModal_CotizarSeguro) {
                this.hideModal(this.dom.errorModal_CotizarSeguro);
            }
        });
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".autocomplete-container-deudores")) {
                this.dom.autocompleteListOcupacion.innerHTML = "";
                this.dom.autocompleteListDepartamento.innerHTML = "";
            }
        });
    }

    /**
     * Shows a generic top-right error modal.
     * @param {string} title - The title of the error.
     * @param {string} message - The error message.
     */
    showErrorModal(title, message) {
        this.dom.errorTitle.textContent = title;
        this.dom.errorMessage.textContent = message;
        this.dom.errorModal.style.display = "flex";
    }

    /**
     * Hides a modal element.
     * @param {HTMLElement} modalElement - The modal to hide.
     */
    hideModal(modalElement) {
        if (modalElement) {
            modalElement.style.display = "none";
        }
    }

    /**
     * Shows a specific modal, typically for validation errors.
     * @param {string} title - The modal title.
     * @param {string} message - The modal message.
     */
    showSpecificErrorModal(title, message) {
        document.querySelector(".ModalCotizarSeguroError_title").innerText = title;
        document.querySelector(".ModalCotizarSeguroError_p").innerText = message;
        this.dom.errorModal_CotizarSeguro.style.display = "block";
    }

    /**
     * Populates a select element with options.
     * @param {string} selectId - The ID of the select element.
     * @param {Array<Object>} data - The array of data for options.
     * @param {boolean} isValueFromDescription - If true, the value is generated from description.
     */
    populateSelect(selectId, data, isValueFromDescription = true) {
        const selectElement = document.getElementById(selectId);
        if (!selectElement) return;

        data.forEach((item) => {
            const option = document.createElement("option");
            if (isValueFromDescription) {
                option.value = item.description.trim().replace(/\s+/g, "_");
                option.textContent = item.description;
            } else {
                option.value = item.value;
                option.textContent = item.body;
            }
            selectElement.appendChild(option);
        });
    }

    /**
     * Populates the age select element.
     */
    populateAgeSelect() {
        const selectElementInputEdad = document.querySelector("#edadPersona");
        for (let edad = 18; edad <= 65; edad++) {
            const option = document.createElement("option");
            option.value = `${edad}years`;
            option.textContent = `${edad} años`;
            selectElementInputEdad.appendChild(option);
        }
    }

    /**
     * Formats an input value to Colombian currency format.
     * @param {Event} e - The input event.
     */
    formatCurrency(e) {
        const input = e.target;
        let value = input.value.replace(/[^0-9]/g, "");
        if (value) {
            value = new Intl.NumberFormat("es-CO").format(value);
            input.value = `$ ${value}`;
        } else {
            input.value = "";
        }
    }

    /**
     * Displays the quote results.
     * @param {Object} cotizacion - The quotation data.
     */
    displayQuoteResults(cotizacion) {
        this.dom.resultadoCotizacionInfoCoti.style.display = "block";
        this.dom.containerButtonResultadoCotiza.style.display = "block";
        this.dom.resultadoCotizacionImg.style.display = "none";

        this.dom.montoResultadoCotiza.textContent = "$ 900.000";
        this.dom.tiempoDePagoResultadoCotiza.textContent = cotizacion.pagofechas;

        this.renderBenefitItems(cotizacion.motoSegurosDeudores);
    }

    /**
     * Renders the list of benefits in the results section.
     * @param {Array<Object>} seguros - The list of insurance benefits.
     */
    renderBenefitItems(seguros) {
        this.dom.resultadoCotizacionInfoCoti.innerHTML = "";
        seguros.forEach((seguro) => {
            const container = document.createElement("div");
            container.classList.add("resultadoCotizacionInfoCoti_container");

            const imgTextContainer = document.createElement("div");
            imgTextContainer.classList.add("resultadoCotizacionInfoCoti_containerIMGtext");

            const img = document.createElement("img");
            img.src = "https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402976/corazon.png/69a18132-a589-5477-0f66-41ffcec0f05b?t=1733242195928";
            img.alt = "corazon";
            img.classList.add("resultadoCotizacionInfoCoti_container_img");
            imgTextContainer.appendChild(img);

            const pNombre = document.createElement("p");
            pNombre.classList.add("resultadoCotizacionInfoCoti_container_p");
            pNombre.textContent = seguro.nombre;
            imgTextContainer.appendChild(pNombre);

            container.appendChild(imgTextContainer);

            const pPrecio = document.createElement("p");
            pPrecio.classList.add("resultadoCotizacionInfoCoti_container_precio");
            pPrecio.textContent = seguro.monto > 0 ? `$${seguro.monto.toLocaleString()}` : seguro.descripcion;
            container.appendChild(pPrecio);

            if (seguro.signo) {
                const imgError = document.createElement("img");
                imgError.src = "https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402976/exclamacion.png/afd7d7b3-a096-69e3-9f43-2120187c0c2e?t=1733242195859";
                imgError.classList.add("resultadoCotizacionInfoCoti_container_error");
                container.appendChild(imgError);
            }
            this.dom.resultadoCotizacionInfoCoti.appendChild(container);
        });
    }

    /**
     * Renders autocomplete suggestions.
     * @param {HTMLElement} listElement - The autocomplete list container.
     * @param {Array<Object>} filteredOptions - The options to display.
     * @param {Function} onItemClick - The callback function for when an item is clicked.
     */
    renderAutocomplete(listElement, filteredOptions, onItemClick) {
        listElement.innerHTML = "";
        filteredOptions.forEach((option) => {
            const item = document.createElement("div");
            item.textContent = option.description || option;
            item.classList.add("autocomplete-item-deudores");
            item.addEventListener("click", () => onItemClick(option));
            listElement.appendChild(item);
        });
    }

    /**
     * Shows a success modal after form submission.
     */
    showSuccessModal() {
        this.isModalVisible = true;
        const modalTitle = document.querySelector(".ModalCotizarSeguroError_title");
        const modalP = document.querySelector(".ModalCotizarSeguroError_p");
        const modalImg = document.querySelector(".ModalCotizarSeguroError_img");

        modalTitle.innerText = "¡Gracias por preferirnos!";
        modalP.innerText = "Próximamente nos contactaremos contigo para darte mas informacion sobre nuestros seguro de vida.";
        modalImg.src = "https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402976/sucess.svg/cb4b5a49-bb19-3c3b-1b88-08709f93bf82?t=1733241922044";
        modalImg.alt = "imagen de todo Correcto";

        this.dom.errorModal_CotizarSeguro.style.display = "block";
        document.querySelector("#cerrarModalExitoso").addEventListener("click", () => {
            setTimeout(() => location.reload(), 1000);
        });
    }

    /**
     * Shows an error modal for form submission failure.
     */
    showErrorSubmitModal() {
        if (this.isModalVisible) return;
        this.isModalVisible = true;

        const modalTitle = document.querySelector(".ModalCotizarSeguroError_title");
        const modalP = document.querySelector(".ModalCotizarSeguroError_p");
        const modalImg = document.querySelector(".ModalCotizarSeguroError_img");

        modalTitle.innerText = "Lo sentimos";
        modalP.innerText = "Ha ocurrido un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.";
        modalImg.src = "https://webserver-portalsegurospositiva-uat.lfr.cloud/documents/2978451/4402976/hexagono-equis.png/d8a14433-62c2-d693-7514-30d2ead2ff16?t=1733242195610";
        modalImg.alt = "imagen de error";

        this.dom.errorModal_CotizarSeguro.style.display = "block";
        document.querySelector("#cerrarModalExitoso").addEventListener("click", () => {
            setTimeout(() => location.reload(), 1000);
        });
    }
}


/**
 * @class ApiService
 * Handles all API communications.
 */
class ApiService {
    constructor() {
        this.urls = {
            municipio: "https://core-positiva-apis-pre-apicast-staging.apps.openshift4.positiva.gov.co/municipio/v1/positiva/scp/parametrica/consultaMunicipio",
            departamento: "https://core-positiva-apis-pre-apicast-staging.apps.openshift4.positiva.gov.co/departamento/v1/positiva/scp/parametrica/consultaDepartamento",
            token: "https://keycloak-sso-app.apps.openshift4.positiva.gov.co/auth/realms/apis-pre/protocol/openid-connect/token",
            crm: "https://core-positiva-apis-pre-apicast-staging.apps.openshift4.positiva.gov.co/crm/v1/positiva/crm/creavida"
        };
        this.credentials = {
            clientId: "105e2e9a",
            clientSecret: "aa75c8b9c4a16f31ce1e2a278b341a98",
        };
        this.accessToken = null;
    }

    /**
     * Fetches the access token from the API.
     * @returns {Promise<string>} A promise that resolves with the access token.
     */
    async getAccessToken() {
        if (this.accessToken) return this.accessToken;

        const response = await fetch(this.urls.token, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `grant_type=client_credentials&client_id=${this.credentials.clientId}&client_secret=${this.credentials.clientSecret}`,
        });
        if (!response.ok) throw new Error("Error al obtener el token de acceso");
        const data = await response.json();
        this.accessToken = data.access_token;
        return this.accessToken;
    }

    /**
     * Fetches data from a protected endpoint.
     * @param {string} url - The URL to fetch from.
     * @returns {Promise<Object>} A promise that resolves with the fetched data.
     */
    async fetchData(url) {
        const token = await this.getAccessToken();
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Accept": "*/*",
            },
        };
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`La solicitud a ${url} no se completó exitosamente`);
        return response.json();
    }

    /**
     * Fetches municipality data.
     * @returns {Promise<Object>}
     */
    getMunicipios() {
        return this.fetchData(this.urls.municipio);
    }

    /**
     * Fetches department data.
     * @returns {Promise<Object>}
     */
    getDepartamentos() {
        return this.fetchData(this.urls.departamento);
    }

    /**
     * Submits the lead data to the CRM.
     * @param {Object} requestData - The lead data to submit.
     * @returns {Promise<Object>}
     */
    async submitLead(requestData) {
        const token = await this.getAccessToken();
        const response = await fetch(this.urls.crm, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) throw new Error("Error al enviar el formulario de lead");
        return response.json();
    }
}

function permitirSoloLetras(inputElement) {
    if (!inputElement) return;
    inputElement.addEventListener("input", () => {
        inputElement.value = inputElement.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ\s]/g, '');
    });
}

function emailValido(email) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "El campo email es obligatorio";
  }

  if (!trimmedEmail.includes("@")) {
    return "El email debe contener el símbolo @";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(trimmedEmail)) {
    return "El formato del email no es válido";
  }

  return true;
}


/**
 * @class FormManager
 * Manages form logic, validation, and submission.
 */
class FormManager {
    constructor(uiManager, apiService, initialData) {
        this.uiManager = uiManager;
        this.apiService = apiService;
        this.data = initialData;
        this.municipiosData = [];
        this.departamentosData = [];
        this.selectedTownID = null;
        this.selectedDepartmentID = null;

        this.dom = {
            // Quote Form
            formCotiza: document.getElementById("formCotizaSeguroVida"),
            valorActualDinero: document.getElementById("valorActualDinero"),
            switchInputFormCotiza: document.getElementById("enfermedadtotalypermanten"),
            errorDeIncapacidadLabel: document.querySelector(".labelCheckEnfermedades"),
            tipoCreditoSelect: document.getElementById("tipoCreditoSegurosDeudores"),
            motoSelect: document.getElementById("motoSegurosDeudores"),
            ocupacionInput: document.getElementById("ocupacionSegurosDeudores"),
            departamentoInput: document.getElementById("departamentoFormCotiza"),
            auxilioFunerioOption: document.getElementById("auxilioFunerioOption"),
            enfermedadesGraves: document.getElementById("enfermedadesGraves"),
            quieroSeguroForm: document.getElementById("resultadoCotizacionInfoCoti_button"),

            // Contact Form
            formNosComunicamos: document.getElementById("formNosComunicamos"),
            contactFormInputs: document.querySelectorAll(".containerFormContact_form_input"),
            nameInput: document.getElementById("nameNosComunicamos"),
            lastNameInput: document.getElementById("lastNameNosComunicamos"),
            emailInput: document.getElementById("emailNosComunicamos"),
            deparmentSelect: document.getElementById("deparmentID"),
            townSelect: document.getElementById("townID"),
            indicativoInput: document.querySelector("#indicativoNosComunicamos"),
            telefonoInput: document.querySelector("#telefonoNosComunicamos"),
        };

        this.hayErrores = [];
    }

    initValidacionesInputSoloLetras() {
        const campos = [
            this.dom.ocupacionInput,
            this.dom.departamentoInput,
            this.dom.nameInput,
            this.dom.lastNameInput,     
        ].filter(Boolean);

        campos.forEach(permitirSoloLetras);
    }

    /**
     * Initializes all form-related functionalities.
     */
    async init() {
        this.initQuoteFormListeners();
        this.initContactFormListeners();
        this.initDataPopulation();
        this.initValidacionesInputSoloLetras();
        try {
            [this.municipiosData, this.departamentosData] = await Promise.all([
                this.apiService.getMunicipios(),
                this.apiService.getDepartamentos(),
            ]);
            this.initLocationDropdowns();
        } catch (error) {
            console.error("Error al cargar datos de ubicación:", error);
        }
    }

    /**
     * Initializes listeners for the main quotation form.
     */
    initQuoteFormListeners() {
        this.dom.formCotiza.addEventListener("submit", this.handleQuoteSubmit.bind(this));
        this.dom.valorActualDinero.addEventListener("input", this.uiManager.formatCurrency);
        this.dom.quieroSeguroForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.uiManager.dom.containerFormContactCotiza.style.display = "block";
        });
        this.initAutocomplete();
    }

    /**
     * Initializes listeners for the contact form.
     */
    initContactFormListeners() {
        this.dom.formNosComunicamos.addEventListener("submit", this.handleContactSubmit.bind(this));
        this.dom.indicativoInput.addEventListener("input", (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ""));
        this.dom.telefonoInput.addEventListener("input", (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ""));

        this.dom.contactFormInputs.forEach((input) => {
            input.addEventListener("input", () => {
                if (input.value.trim() !== "" && input.value.length >= 3) {
                    const errorMessage = input.parentElement.querySelector(".formCotizaSeguroVida_errorP");
                    if (errorMessage) errorMessage.remove();
                    input.style.border = "";
                }
            });
        });
    }

    /**
     * Populates initial data into form selects.
     */
    initDataPopulation() {
        this.uiManager.populateSelect("motoSegurosDeudores", this.data[0].motoSegurosDeudores);
        this.uiManager.populateSelect("ocupacionSegurosDeudores", this.data[1].ocupacionSegurosDeudores);
        this.uiManager.populateSelect("tipoCreditoSegurosDeudores", this.data[2].tipoCreditoSegurosDeudores);
        this.uiManager.populateAgeSelect();
    }

    /**
     * Populates and sets up listeners for location dropdowns in the contact form.
     */
    initLocationDropdowns() {
        const mappedDepartamentos = this.departamentosData.map(d => ({ value: d.idDepartamento, body: d.NombreDepartamento }));
        this.uiManager.populateSelect("deparmentID", mappedDepartamentos, false);

        this.dom.deparmentSelect.addEventListener("change", (e) => {
            this.selectedDepartmentID = e.target.value;
            const filteredMunicipios = this.municipiosData.filter(m => m.idDepartamento === parseInt(this.selectedDepartmentID));
            const mappedMunicipios = filteredMunicipios.map(m => ({ value: m.idMunicipio, body: m.nombreMunicipio }));
            this.dom.townSelect.innerHTML = '<option value="" hidden selected>Selecciona tu ciudad</option>'; // Clear previous options
            this.uiManager.populateSelect("townID", mappedMunicipios, false);
        });

        this.dom.townSelect.addEventListener("change", (e) => {
            this.selectedTownID = e.target.value;
        });
    }

    /**
     * Handles the submission of the quotation form.
     * @param {Event} event - The submit event.
     */
    handleQuoteSubmit(event) {
        event.preventDefault();
        this.hayErrores = [];

        this.validateQuoteForm();

        if (this.hayErrores.length === 0) {
            const value = parseInt(this.dom.valorActualDinero.value.replace(/\D/g, ""), 10);
            const cotizacion = this.buildCotizacionObject(value);
            this.uiManager.displayQuoteResults(cotizacion);
        }
    }

    /**
     * Validates all fields in the quotation form.
     */
    validateQuoteForm() {
        // Clear previous errors
        document.querySelectorAll(".formCotizaSeguroVida_errorP").forEach(el => el.remove());

        // Validate debt amount
        const value = parseInt(this.dom.valorActualDinero.value.replace(/\D/g, ""), 10);
        if (!this.dom.valorActualDinero.value.trim()) {
            this.hayErrores.push("Hay un campo vacío");
            this.uiManager.showErrorModal("Completa los campos faltantes", "Por favor, completa todos los campos obligatorios para continuar.");
            this.dom.valorActualDinero.classList.add("borderRojoError");
        } else if (isNaN(value) || value < 500000 || value >= 14000000) {
            this.hayErrores.push("Monto no válido");
            this.uiManager.showSpecificErrorModal("Monto no válido", "El monto debe ser igual o mayor a $500,000 o igual o menor a  $14,000,000 para continuar.");
        } else {
            this.dom.valorActualDinero.classList.remove("borderRojoError");
        }

        // Validate credit type switch
        const creditValue = this.dom.tipoCreditoSelect.value;
        const requiredCredits = ["Leasing_habitacional_no_vis_en_uvr", "Leasing_habitacional_no_vis_en_pesos", "Hipotecario_no_vis_en_pesos", "Hipotecario_no_vis_en_uvrs"];
        if (requiredCredits.includes(creditValue) && !this.dom.switchInputFormCotiza.checked) {
            this.hayErrores.push("El switch debe estar activado.");
            this.dom.errorDeIncapacidadLabel.classList.add("textoRojoError");
            this.uiManager.showErrorModal("Para poder continuar", "Debes seleccionar la cobertura Incapacidad Total y Permanente (TTP) para continuar con este crédito.");
        } else {
            this.dom.errorDeIncapacidadLabel.classList.remove("textoRojoError");
        }

        // Validate other selects
        if (!this.validateAllSelects()) {
            this.hayErrores.push("Campos de selección inválidos");
            this.uiManager.showErrorModal("Completa los campos faltantes", "Por favor, completa todos los campos obligatorios para continuar.");
        }

        // Validate occupation
        if (!this.ocupacionValida(this.dom.ocupacionInput.value)) {
            this.hayErrores.push("Ocupación no válida");
            this.uiManager.showErrorModal("Comuníquese con un asesor", "Usted ha seleccionado una ocupacion sin recargo");
        }
    }

    /**
     * Builds the final quotation object based on form inputs.
     * @param {number} value - The debt value.
     * @returns {Object} The final cotizacion object.
     */
    buildCotizacionObject(value) {
        let cotizacion = JSON.parse(JSON.stringify({
            total: 0,
            pagofechas: "anual",
            motoSegurosDeudores: [
                { nombre: "Muerte por cualquier causa", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Amparo de auxilio funerario", monto: 0, signo: false, valorDefecto: true },
                { nombre: "Amparo de enfermedades graves", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Daños a terceros", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Incapacidad total o permanente (Invalidez)", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Gastos de defensa", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Terremoto", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Amit", monto: 0, signo: false, valorDefecto: false },
                { nombre: "Huracan", descripcion: "Premium", signo: false, valorDefecto: false },
            ],
        }));

        cotizacion.motoSegurosDeudores.forEach((beneficio) => {
            beneficio.monto = beneficio.valorDefecto ? 10000000 : value;
        });

        if (!this.dom.switchInputFormCotiza.checked) {
            cotizacion.motoSegurosDeudores = cotizacion.motoSegurosDeudores.filter(b => b.nombre !== "Incapacidad total o permanente (Invalidez)");
        }
        if (!this.dom.auxilioFunerioOption.checked) {
            cotizacion.motoSegurosDeudores = cotizacion.motoSegurosDeudores.filter(b => b.nombre !== "Amparo de auxilio funerario");
        }
        if (!this.dom.enfermedadesGraves.checked) {
            cotizacion.motoSegurosDeudores = cotizacion.motoSegurosDeudores.filter(b => b.nombre !== "Amparo de enfermedades graves");
        }
        return cotizacion;
    }

    /**
     * Handles the contact form submission.
     * @param {Event} event - The submit event.
     */
    async handleContactSubmit(event) {
        event.preventDefault();
        if (this.validateContactForm()) {
            try {
                const name = this.dom.nameInput.value;
                const lastName = this.dom.lastNameInput.value;
                const numberInput = this.dom.telefonoInput.value;
                const emailInput = this.dom.emailInput.value;
                const paddedTownID = this.selectedTownID.toString().padStart(3, "0");
                const stringDepartmentID = this.selectedDepartmentID.toString();

                const requestData = {
                    lead: {
                        name: `${name} ${lastName}`,
                        type_person: "person",
                        first_name: name,
                        last_name: lastName,
                        department_code: stringDepartmentID,
                        city_code: stringDepartmentID + paddedTownID,
                        product_code: "7064",
                        email_from: emailInput,
                        mobile: numberInput,
                        campaign: "Pagina Web",
                    },
                };
                await this.apiService.submitLead(requestData);
                this.uiManager.showSuccessModal();
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                this.uiManager.showErrorSubmitModal();
            }
        }
    }

    /**
     * Validates the fields of the contact form.
     * @returns {boolean} - True if the form is valid, otherwise false.
     */
    validateContactForm() {
        let isValid = true;
        // Basic implementation, you can expand this based on your original complex validation
        this.dom.contactFormInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.border = "1px solid #E60003";
                // Show error message
                const errorMessage = input.parentElement.querySelector(".formCotizaSeguroVida_errorP") || document.createElement("span");
                errorMessage.className = "formCotizaSeguroVida_errorP";
                errorMessage.textContent = "Este campo es obligatorio";
                if (!input.parentElement.querySelector(".formCotizaSeguroVida_errorP")) {
                    input.parentElement.appendChild(errorMessage);
                }
            }
        });

        const emailInput = this.dom.emailInput;
        const emailValidation = emailValido(emailInput.value.trim());
        if (emailValidation !== true) {
            isValid = false;
            emailInput.style.border = "1px solid #E60003";

            let errorMessage = emailInput.parentElement.querySelector(".formCotizaSeguroVida_errorP");
            if (!errorMessage) {
                errorMessage = document.createElement("span");
                errorMessage.className = "formCotizaSeguroVida_errorP";
                emailInput.parentElement.appendChild(errorMessage);
            }
            errorMessage.textContent = emailValidation;
        }

        if (!document.getElementById("acceptarPoliticasNosComunicamos").checked) {
            isValid = false;
            this.uiManager.showErrorModal("Completa los campos faltantes", "Debes aceptar la política de privacidad para continuar.");
        }

        // Assuming grecaptcha is available globally
        // if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length === 0) {
        //     isValid = false;
        //     this.uiManager.showErrorModal("Completa los campos faltantes", "Por favor, completa el reCAPTCHA.");
        // }

        return isValid;
    }

    /**
     * Initializes autocomplete functionality for occupation and department inputs.
     */
    initAutocomplete() {
        // Occupation Autocomplete
        this.dom.ocupacionInput.addEventListener("input", () => {
            const query = this.dom.ocupacionInput.value.toLowerCase();
            this.uiManager.dom.autocompleteListOcupacion.innerHTML = "";
            const filteredOptions = this.data[1].ocupacionSegurosDeudores
                .filter(o => o.description.toLowerCase().includes(query))
                .slice(0, 5);

            this.uiManager.renderAutocomplete(this.uiManager.dom.autocompleteListOcupacion, filteredOptions, (option) => {
                this.dom.ocupacionInput.value = option.description;
                this.validateSelectAutocomplete("ocupacionSegurosDeudores", this.data[1].ocupacionSegurosDeudores, "ocupacionSegurosDeudoresError");
                this.uiManager.dom.autocompleteListOcupacion.innerHTML = "";
            });
        });

        // Department/Location Autocomplete
        this.dom.departamentoInput.addEventListener("input", () => {

            const query = this.dom.departamentoInput.value.toLowerCase();
            this.uiManager.dom.autocompleteListDepartamento.innerHTML = "";
            if (!query || query.length < 2 || this.municipiosData.length === 0) return;

            const deptoMap = new Map(this.departamentosData.map(dep => [dep.idDepartamento, dep.NombreDepartamento]));
            const combinedOptions = this.municipiosData.map(m => `${m.nombreMunicipio} - ${deptoMap.get(m.idDepartamento)?.toUpperCase()}`);

            const filteredOptions = combinedOptions.filter(o => o.toLowerCase().includes(query)).slice(0, 5);

            this.uiManager.renderAutocomplete(this.uiManager.dom.autocompleteListDepartamento, filteredOptions, (optionText) => {
                this.dom.departamentoInput.value = optionText;
                this.uiManager.dom.autocompleteListDepartamento.innerHTML = "";
                this.validateUbicacion("departamentoFormCotiza", "departamentoSegurosDeudoresError");
            });
        });
    }

    // --- Validation Helpers ---

    selectValidate(id, array, errorId) {
        let idValue = document.getElementById(id).value;
        let error = document.getElementById(errorId);
        let isValid = array.some(
            (selectValue) => idValue == selectValue.description.trim().replace(/\s+/g, "_")
        );
        error.style.display = isValid ? "none" : "block";
        return isValid;
    }

    validateSelectAutocomplete(id, array, errorId) {
        let idValue = document.getElementById(id).value;
        let error = document.getElementById(errorId);
        let isValid = array.some((selectValue) => idValue == selectValue.description);
        error.style.display = isValid ? "none" : "block";
        if (isValid && !this.ocupacionValida(idValue)) {
            this.uiManager.showSpecificErrorModal("Lo sentimos", "No puedes adquirir este producto, comunícate con un asesor");
            return false;
        }
        return isValid;
    }

    validateUbicacion(id, errorId) {
        const inputElement = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = inputElement.value;

        if (!value) {
            errorElement.style.display = 'block';
            return false;
        }

        const [ciudad, departamento] = value.split(" - ").map(s => s.trim().toUpperCase());
        if (!ciudad || !departamento) {
            errorElement.style.display = 'block';
            return false;
        }

        const departamentoMap = new Map(this.departamentosData.map(dep => [dep.NombreDepartamento.toUpperCase(), dep.idDepartamento]));
        const targetDepartamentoId = departamentoMap.get(departamento);

        if (targetDepartamentoId === undefined) {
            errorElement.style.display = 'block';
            return false;
        }

        const isValid = this.municipiosData.some(municipio =>
            municipio.nombreMunicipio.toUpperCase() === ciudad && municipio.idDepartamento === targetDepartamentoId
        );

        errorElement.style.display = isValid ? 'none' : 'block';
        return isValid;
    }

    validateAllSelects() {
        const selectConfigs = [
            { id: "motoSegurosDeudores", validValues: this.data[0].motoSegurosDeudores, errorId: "motoSegurosDeudoresError" },
            { id: "tipoCreditoSegurosDeudores", validValues: this.data[2].tipoCreditoSegurosDeudores, errorId: "tipoCreditoSegurosDeudoresError" },
        ];

        const isOcupacionValid = this.validateSelectAutocomplete("ocupacionSegurosDeudores", this.data[1].ocupacionSegurosDeudores, "ocupacionSegurosDeudoresError");
        const isDepartamentoValid = this.validateUbicacion("departamentoFormCotiza", "departamentoSegurosDeudoresError");
        const areOtherSelectsValid = selectConfigs.every(({ id, validValues, errorId }) => this.selectValidate(id, validValues, errorId));

        return isOcupacionValid && isDepartamentoValid && areOtherSelectsValid;
    }

    ocupacionValida(valor) {
        const ocupacion = this.data[1].ocupacionSegurosDeudores.find(item => item.description === valor);
        return ocupacion ? ocupacion.recargo : false;
    }
}


/**
 * @class CotizadorApp
 * Main application class to initialize and manage the cotizador.
 */
class CotizadorApp {
    constructor() {
        this.initialData = this.getInitialData();
        this.uiManager = new UIManager();
        this.apiService = new ApiService();
        this.formManager = new FormManager(this.uiManager, this.apiService, this.initialData);
    }

    /**
     * Initializes the application.
     */
    init() {
        this.uiManager.init();
        this.formManager.init();
        this.uiManager.dom.containerButtonResultadoCotiza.style.display = "none";
        this.uiManager.dom.containerFormContactCotiza.style.display = "none";
    }

    /**
     * Provides the initial static data for the forms.
     * @returns {Array<Object>}
     */
    getInitialData() {
        return [
            { motoSegurosDeudores: [{ description: "Motocicleta transporte" }, { description: "Motocicleta trabajo" }, { description: " Otras ocupaciones" }] },
            {
                ocupacionSegurosDeudores: [
                    { description: "Acrobacias", recargo: true }, { description: "Aguador - Construcción", recargo: true }, { description: "Aislador - Construcción", recargo: true },
                    { description: "Alcalde", recargo: false }, { description: "Alicatador, Remachador, Techador", recargo: true }, { description: "Arquitecto o ingeniero en obras", recargo: true },
                    { description: "Artes marciales", recargo: true }, { description: "Atletismo, béisbol, baloncesto, hockey, fútbol, voleibol", recargo: true },
                    { description: "Aviación Privada Aparatos de ala fija (aviones)", recargo: true }, { description: "Aviación Privada Aparatos de ala giratoria (helicópteros)", recargo: true },
                    { description: "Barrenero - Construcción", recargo: true }, { description: "Buceo Libre", recargo: true }, { description: "Bungee, bungy jumping o puenting", recargo: true },
                    { description: "Boxeo, Kickboxing", recargo: true }, { description: "Cacería", recargo: true }, { description: "Campesino, Agricultor y Ganadero", recargo: true },
                    { description: "Canoas y kayaks", recargo: true }, { description: "Capataz de Asbesto", recargo: true }, { description: "Carreras de Automovilismo", recargo: true },
                    { description: "Carreras en circuitos", recargo: true }, { description: "Carreras en pista", recargo: true }, { description: "Caída libre o salto de competición", recargo: true },
                    { description: "Constructor Obrero especializado", recargo: true }, { description: "Constructor en obras", recargo: true }, { description: "Concejal", recargo: false },
                    { description: "Cargador - Aviación - Personal Tierra", recargo: true }, { description: "Cargador de pozos, montador, registrador eléctrico", recargo: true },
                    { description: "Encargado de campo y construcción", recargo: true }, { description: "Ensamblador, aislador, perforador, procesador u operario de maquinaria - Asbesto", recargo: true },
                    { description: "Ensamblador de conducciones, operador de planta", recargo: true }, { description: "Escalada", recargo: true }, { description: "Esgrima", recargo: true },
                    { description: "Espeleología, expediciones en cavernas", recargo: true }, { description: "Esquí acuático", recargo: true }, { description: "Estilo libre", recargo: true },
                    { description: "Estudiante de Piloto, Fotografía aérea, instructor aéreo", recargo: true }, { description: "Excavador de plataforma Operario de presión, sala de control y válvulas", recargo: true },
                    { description: "Geólogo en ingeniería - Construcción", recargo: true }, { description: "Hockey sobre hielo", recargo: true }, { description: "Jet ski", recargo: true },
                    { description: "Jockey", recargo: true }, { description: "Lucha", recargo: true }, { description: "Manipulador de equipaje - Aviación", recargo: true },
                    { description: "Montador de grúa, Soldador, Tirador de grúa", recargo: true }, { description: "Montañismo, alpinismo, escalada en rocas", recargo: true },
                    { description: "Moto como medio de transporte", recargo: true }, { description: "Moto como medio de trabajo", recargo: true }, { description: "Motos Competición", recargo: true },
                    { description: "Motociclismo Speedway", recargo: true }, { description: "Motocross", recargo: true }, { description: "Motonáutica", recargo: true },
                    { description: "Natación", recargo: true }, { description: "Novillero", recargo: true }, { description: "Observación técnica Todos los casos", recargo: true },
                    { description: "Operario de cinta transportadora (Aeropuerto)", recargo: true }, { description: "Operario y mantenimiento eléctrico electrónico pozos", recargo: true },
                    { description: "Paracaidismo", recargo: true }, { description: "Parapente y vuelo con ala delta", recargo: true }, { description: "Pintor Altura", recargo: true },
                    { description: "Polo", recargo: true }, { description: "Profesional en Pozos y perforación", recargo: true }, { description: "Rafting", recargo: true },
                    { description: "Rejoneador", recargo: true }, { description: "Snorkel", recargo: true }, { description: "Supervisor de construcciones", recargo: true },
                    { description: "Surf", recargo: true }, { description: "Tirador, Tunelador", recargo: true }, { description: "Torero, Picador, Banderillero", recargo: true },
                    { description: "Trabajador de andamiajes, pozo petrolífero, suelo, torre de perforación", recargo: true }, { description: "Trabajador de mantenimiento y obras públicas", recargo: true },
                    { description: "Técnico mantenimiento eléctrico", recargo: true }, { description: "Tripulación Aeronaves de ala fija", recargo: true }, { description: "Tripulación Aeronaves de ala rotativa", recargo: true },
                    { description: "Otra", recargo: true }, { description: "Secretario de Gobierno", recargo: false }, { description: "Representante Cámara y Senado", recargo: false },
                    { description: "Personero", recargo: false }, { description: "Gobernador", recargo: false }, { description: "Policía y Fuerzas Militares", recargo: false },
                    { description: "Consejal", recargo: false }, { description: "Diputado", recargo: false }, { description: "Edil", recargo: false },
                ]
            },
            {
                tipoCreditoSegurosDeudores: [
                    { description: "Hipotecario no vis en pesos" }, { description: "Libre inversión" }, { description: "Libranza" },
                    { description: "Vehículo" }, { description: "Hipotecario no vis en uvrs" }, { description: "Leasing habitacional no vis en uvr" },
                    { description: "Leasing habitacional no vis en pesos" }, { description: "Microcrédito mayores a 25 SMMLV" },
                ]
            },
            { ubicacionGeograficaSegurosDeudores: [{ description: "Bogota D.C" }, { description: "Tunja" }, { description: "Médellin" }, { description: "Cali" }, { description: "Barranquilla" }] },
            { resultadoCotizacion: [{ description: "Bogota D.C" }, { description: "Tunja" }, { description: "Médellin" }, { description: "Cali" }, { description: "Barranquilla" }] },
        ];
    }
}


// --- Application Entry Point ---
document.addEventListener("DOMContentLoaded", () => {
    const app = new CotizadorApp();
    app.init();
});