// CLASE PARA CENTRALIZAR MENSAJES DE ERROR
class ErrorMessages {
    constructor() {
        this.messages = {
            REQUIRED: "Este campo es obligatorio.",
            INVALID_EMAIL_STRUCTURE: "Estructura de correo inválida.",
            PHONE_LENGTH: "El campo debe tener al menos 10 dígitos.",
            INVALID_CITY: "Por favor, selecciona una ciudad válida de la lista.",
            AGE_UNDER_18: "Debe ser mayor de 18 años para contratar el seguro.",
            AGE_OVER_70: "La edad máxima para contratar el seguro es de 70 años.",
            AGE_RANGE_MODAL: {
                title: "Edad no permitida",
                body: "La edad debe estar entre 18 y 65 años para continuar."
            },
            BLOCKED_ID: {
                title: "Solicitud no procesada",
                body: "La validación de identidad no fue exitosa. Por favor, verifica que tus datos sean correctos.<br>Si tienes alguna inquietud, comunícate con nuestro equipo de soporte. "
            },
            INVALID_EXPEDITION_DATE: {
                title: "Fecha de expedición no válida",
                body: "Por favor, asegúrate de que la fecha de expedición del documento sea correcta para poder continuar con el proceso."
            },
        };
    }
    get(key) {
        return this.messages[key] || "Error desconocido.";
    }
}

class InputValidator {
    constructor(inputElement) {
        this.inputElement = inputElement;
        const parentWrapper = inputElement.closest('.form-Ex-camp, .form-re-one');
        this.errorElement = parentWrapper ? parentWrapper.querySelector('.mensaje-error-EX') : null;
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
    static validateAlphanumeric(inputElement) {
        inputElement.addEventListener("keypress", (event) => {
            const char = String.fromCharCode(event.which);
            const alphanumericRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
            if (!alphanumericRegex.test(char)) {
                event.preventDefault();
            }
        });
    }
    static validateAddress(inputElement) {
        inputElement.addEventListener("keypress", (event) => {
            const char = String.fromCharCode(event.which);
            const addressRegex = /^[a-zA-Z0-9 #-]$/;
            if (!addressRegex.test(char)) {
                event.preventDefault();
            }
        });
    }
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

// CLASES ESPECIALIZADAS QUE AHORA HEREDAN DE InputValidator
class EmailValidator extends InputValidator {
    constructor(inputElement, errorMessages) {
        super(inputElement);
        this.errorMessages = errorMessages;
        this.setupEmailValidation();
    }
    setupEmailValidation() {
        // ... (el contenido del método no cambia)
    }
    validateStructure() {
        // ... (el contenido del método no cambia)
    }
}

class PhoneValidator extends InputValidator {
    constructor(inputElement, errorMessages) {
        super(inputElement);
        this.errorMessages = errorMessages;
        this.setupPhoneValidation();
    }
    validatePhone() {
        const isValid = this.inputElement.value.trim().length >= 10;
        if (!isValid) {
            // Muestra el error si no es válido
            this.showError(this.errorMessages.get('PHONE_LENGTH'));
            return false;
        } else {
            // Limpia el error si es válido
            this.clearError();
            return true;
        }
    }
    setupPhoneValidation() {
        InputValidator.validateNumbers(this.inputElement);
    }
}

class BirthDateValidator extends InputValidator {
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


class Validador {
    constructor() {
        this.locationService = new LocationService();
        this.toastElement = null;
        this.toastTimeout = null;
        this.popUpElement = null;
        this.errorMessages = new ErrorMessages();
        this.validators = {};
        this.blockedCedula = "123456789";
        this.incorrectExpeditionDate = "2014-06-25";
        this.precios = {
            casado: {
                proteccionGarantizada: {
                    total: 960633,
                    mas: 709097,
                    plus: 534111,
                    esencial: 429121
                },
                auxilioFallecimiento: {
                    total: 450000,
                    mas: 350000,
                    plus: 250000,
                    esencial: 180000
                },
                asistenciaExequialMascota: {
                    total: 125000,
                    mas: 98000,
                    plus: 75000,
                    esencial: 55000
                },
                auxilioFallecimientoAseguradoPrincipal: {
                    total: 320000,
                    mas: 285000,
                    plus: 210000,
                    esencial: 165000
                }
            },
            soltero: {
                proteccionGarantizada: {
                    total: 800000,
                    mas: 600000,
                    plus: 450000,
                    esencial: 350000
                },
                auxilioFallecimiento: {
                    total: 380000,
                    mas: 290000,
                    plus: 210000,
                    esencial: 150000
                },
                asistenciaExequialMascota: {
                    total: 105000,
                    mas: 80000,
                    plus: 60000,
                    esencial: 45000
                },
                auxilioFallecimientoAseguradoPrincipal: {
                    total: 280000,
                    mas: 240000,
                    plus: 180000,
                    esencial: 140000
                }
            },
            familia5: {
                proteccionGarantizada: {
                    total: 1200000,
                    mas: 900000,
                    plus: 680000,
                    esencial: 550000
                },
                auxilioFallecimiento: {
                    total: 550000,
                    mas: 420000,
                    plus: 320000,
                    esencial: 220000
                },
                asistenciaExequialMascota: {
                    total: 150000,
                    mas: 115000,
                    plus: 90000,
                    esencial: 65000
                },
                auxilioFallecimientoAseguradoPrincipal: {
                    total: 380000,
                    mas: 320000,
                    plus: 250000,
                    esencial: 200000
                }
            },
            familia10: {
                proteccionGarantizada: {
                    total: 1500000,
                    mas: 1100000,
                    plus: 850000,
                    esencial: 680000
                },
                auxilioFallecimiento: {
                    total: 650000,
                    mas: 500000,
                    plus: 380000,
                    esencial: 280000
                },
                asistenciaExequialMascota: {
                    total: 180000,
                    mas: 140000,
                    plus: 110000,
                    esencial: 80000
                },
                auxilioFallecimientoAseguradoPrincipal: {
                    total: 450000,
                    mas: 380000,
                    plus: 300000,
                    esencial: 240000
                }
            }
        };

        // Mapeo de checkboxes a productos
        this.productosCheckbox = {
            'proteccion': 'proteccionGarantizada',
            'auxilioFallecimiento': 'auxilioFallecimiento',
            'asistenciaExequial': 'asistenciaExequialMascota',
            'personasAdicionales': 'personasAdicionales',
            'auxilio': 'auxilioFallecimiento',
            'asistencia': 'asistenciaExequialMascota',
            'auxilioFallecimientoAsegurado': 'auxilioFallecimientoAseguradoPrincipal'
        };

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.inicializarComponentes());
        } else {
            this.inicializarComponentes();
        }
    }

    // Método que agrupa todos los inicializadores
    inicializarComponentes() {
        this.inicializarUbicaciones();
        this.inicializarCalendario();
        this.inicializarSelectorFamilia();
        this.inicializarCheckboxes();
        this.inicializarPlanRadios();
        this.inicializarBotonCotizar();
        this.inicializarContadores();
        this.inicializarBotonContinuar();
        this.inicializarToast();
        this.inicializarPopUp();
        this.inicializarLimpiezaDeErrores();
        this.inicializarValidadoresEspecificos();
    }

    // --- NUEVO: Método para configurar el Toast ---
    inicializarToast() {
        this.toastElement = document.getElementById('toast-notification');
        const closeButton = document.getElementById('Toast-cierre-ex');

        if (closeButton && this.toastElement) {
            closeButton.addEventListener('click', () => {
                this.ocultarToast();
            });
        }
    }

    // --- NUEVO: Método para mostrar el Toast ---
    mostrarToast() {
        if (!this.toastElement) return;

        // Limpiar cualquier timeout anterior para evitar que se oculte prematuramente
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }

        this.toastElement.classList.add('show');

        // Ocultar el toast después de 4 segundos (4000 ms)
        this.toastTimeout = setTimeout(() => {
            this.ocultarToast();
        }, 4000);
    }

    // --- NUEVO: Método para ocultar el Toast ---
    ocultarToast() {
        if (!this.toastElement) return;

        this.toastElement.classList.remove('show');
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
    }

    // --- NUEVO: SECCIÓN DE MANEJO DEL POP-UP ---
    inicializarPopUp() {
        this.popUpElement = document.querySelector('.Fondo-pop-up-EX');
        const closeButton = document.getElementById('pop-up-cierre-ex');

        if (this.popUpElement && closeButton) {
            // Cerrar al hacer clic en el botón de cierre
            closeButton.addEventListener('click', () => this.ocultarPopUp());
            // Cerrar al hacer clic en el fondo oscuro
            this.popUpElement.addEventListener('click', (e) => {
                if (e.target === this.popUpElement) {
                    this.ocultarPopUp();
                }
            });
        }
    }

    mostrarPopUp() {
        if (this.popUpElement) {
            this.popUpElement.style.display = 'block';
        }
    }

    ocultarPopUp() {
        if (this.popUpElement) {
            this.popUpElement.style.display = 'none';
        }
    }

    // --- NUEVO: Función de validación reutilizable ---
    validarFormulario(formElement) {
        if (!formElement) return false;

        const camposRequeridos = formElement.querySelectorAll('[required]');
        let esValido = true;

        camposRequeridos.forEach(campo => {
            // Creamos un validador para cada campo para poder mostrar/ocultar su error
            const validator = new InputValidator(campo);

            if (campo.id === 'politica-cotizar' || campo.id === 'politica-continuar') {
                return;
            }

            const esCheckbox = campo.type === 'checkbox';

            if ((esCheckbox && !campo.checked) || (!esCheckbox && !campo.value)) {
                esValido = false;
                // --- LÓGICA MEJORADA ---
                // Usamos el sistema de errores para mostrar el mensaje
                validator.showError(this.errorMessages.get('REQUIRED'));
            } else {
                // Si el campo es válido, nos aseguramos de limpiar el error
                validator.clearError();
            }
        });

        return esValido;
    }



    // --- NUEVO: Método para cargar datos de la API y configurar los campos ---
    async inicializarUbicaciones() {
        try {
            console.log("Cargando departamentos y municipios desde la API...");
            await this.locationService.loadLocations();
            console.log("Datos de ubicación cargados.");

            this.poblarSelectDepartamentos();

            // Configurar el autocompletado para la ciudad
            const ciudadInput = document.getElementById('ciudad');
            const resultadoCiudadDiv = document.getElementById('resultado-ciudad');
            const departamentoSelect = document.getElementById('departamento');

            new CityAutocomplete(this.locationService, ciudadInput, resultadoCiudadDiv, departamentoSelect);

        } catch (error) {
            console.error("No se pudieron inicializar las ubicaciones:", error);
            // Opcional: Mostrar un mensaje de error al usuario
        }
    }


    // --- NUEVO: Método para llenar el select de departamentos ---
    poblarSelectDepartamentos() {
        const departamentoSelect = document.getElementById('departamento');
        if (!departamentoSelect) return;

        // Limpiar opciones existentes (excepto la primera)
        while (departamentoSelect.options.length > 1) {
            departamentoSelect.remove(1);
        }

        this.locationService.departments.forEach(depto => {
            const option = document.createElement('option');
            option.value = depto.idDepartamento;
            option.textContent = depto.NombreDepartamento;
            departamentoSelect.appendChild(option);
        });
    }

    // --- NUEVO: Método para inicializar los contadores ---
    inicializarContadores() {
        const contenedores = document.querySelectorAll('.Cont-personas-adi');

        contenedores.forEach(contenedor => {
            const botonMenos = contenedor.querySelector('.Cont-min');
            const botonMas = contenedor.querySelector('.Cont-max');
            // --- CORRECCIÓN AQUÍ ---
            // Hacemos el selector más específico para encontrar el <p> dentro de .Cont-cont-ex
            const valorP = contenedor.querySelector('.Cont-cont-ex p');

            if (botonMenos && botonMas && valorP) { // Verificamos que todos los elementos existan
                botonMenos.addEventListener('click', (e) => {
                    e.preventDefault();
                    let valorActual = parseInt(valorP.textContent);
                    if (valorActual > 0) {
                        valorP.textContent = valorActual - 1;
                    }
                });

                botonMas.addEventListener('click', (e) => {
                    e.preventDefault();
                    let valorActual = parseInt(valorP.textContent);
                    valorP.textContent = valorActual + 1;
                });
            }
        });
    }

    // --- NUEVO: Método para mostrar el pop-up con mensajes dinámicos ---
    mostrarPopUpConMensaje(errorKey) {
        if (!this.popUpElement) return;

        const errorData = this.errorMessages.get(errorKey);
        if (!errorData) return;

        const tituloEl = this.popUpElement.querySelector('.pop-up-Ex-title h2');
        const cuerpoEl = this.popUpElement.querySelector('.pop-up-Ex-desc p');

        if (tituloEl) tituloEl.textContent = errorData.title;
        if (cuerpoEl) cuerpoEl.innerHTML = errorData.body.replace(/\n/g, '<br>');

        this.mostrarPopUp(); // Llama a la función que ya teníamos para mostrarlo
    }

    // --- NUEVO: Método que contiene la lógica de validación especial ---
    realizarValidacionEspecial() {
        const documentoInput = document.getElementById('documento');
        const fechaExpeInput = document.getElementById('fecha-expe');

        if (!documentoInput || !fechaExpeInput) return true; // Si no existen los campos, no valida

        const numeroDocumento = documentoInput.value.trim();
        const fechaExpedicion = fechaExpeInput.value;

        // Escenario 1: La cédula es la bloqueada Y la fecha de expedición es la incorrecta
        if (numeroDocumento === this.blockedCedula && fechaExpedicion === this.incorrectExpeditionDate) {
            this.mostrarPopUpConMensaje('INVALID_EXPEDITION_DATE');
            // También marcamos el campo de fecha como inválido
            new InputValidator(fechaExpeInput).showError('Fecha de expedición no válida para este documento.');
            return false; // La validación falla
        }

        // Escenario 2: La cédula es la bloqueada (con cualquier otra fecha)
        if (numeroDocumento === this.blockedCedula) {
            this.mostrarPopUpConMensaje('BLOCKED_ID');
            // Marcamos el campo de documento como inválido
            new InputValidator(documentoInput).showError('Este número de documento no puede continuar.');
            return false; // La validación falla
        }

        return true; // Si no se cumple ninguna condición, la validación especial pasa
    }

    inicializarBotonContinuar() {
        const botonContinuar = document.getElementById('continuar');
        const formularioDetallado = document.querySelector('.Cont-form-total');
        const politicaCheckbox = document.getElementById('politica-continuar');

        if (botonContinuar && formularioDetallado && politicaCheckbox) {
            botonContinuar.addEventListener('click', (e) => {
                e.preventDefault();

                // 1. Ejecutamos PRIMERO la validación especial
                if (!this.realizarValidacionEspecial()) {
                    return; // Si falla, detenemos todo aquí.
                }

                // 2. Si la validación especial pasa, continuamos con las validaciones normales
                const formularioValido = this.validarFormulario(formularioDetallado);
                const politicaAceptada = politicaCheckbox.checked;

                if (!formularioValido) {
                    this.mostrarToast();
                }
                if (!politicaAceptada) {
                    this.mostrarPopUp(); // Muestra el pop-up genérico de "aceptar política"
                }

                // 3. Solo si TODO es correcto, mostramos el resumen
                if (formularioValido && politicaAceptada) {
                    this.mostrarResumen();
                }
            });
        }
    }


    // He movido la lógica de mostrar el resumen a su propio método para más claridad
    mostrarResumen() {
        const formularioDetallado = document.querySelector('.Cont-form-total');
        const vistaResumenItems = document.querySelectorAll('.vista-resumen-item');

        // Recoger y pintar datos
        const tipoDocSelect = document.getElementById('tipo-documento');
        const numDocInput = document.getElementById('documento');
        const auxilioCheckbox = document.getElementById('auxilio');
        const tipoDocTexto = tipoDocSelect.options[tipoDocSelect.selectedIndex].text;
        const numDocValor = numDocInput.value;
        const tieneBeneficioFallecimiento = auxilioCheckbox.checked;

        document.getElementById('resumen-tipo-doc').textContent = tipoDocTexto;
        document.getElementById('resumen-num-doc').textContent = numDocValor;
        document.getElementById('resumen-beneficiario-fallecimiento').textContent = tieneBeneficioFallecimiento ? 'Incluido' : 'No incluido';

        // Cambiar la vista
        if (formularioDetallado && vistaResumenItems.length > 0) {
            formularioDetallado.style.display = 'none';
            vistaResumenItems.forEach(item => {
                if (item.classList.contains('Cont-boton-ex') || item.classList.contains('Cont-boton-cont')) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'block';
                }
            });
        }
    }


    inicializarCalendario() {
        const idsDeCalendarios = ['fechaN', 'fecha-nac', 'fecha-expe'];

        idsDeCalendarios.forEach(id => {
            const fechaInput = document.getElementById(id);

            if (fechaInput) {
                // El calendario se aplica a TODOS los campos de la lista.
                this.crearOverlayCalendario(fechaInput);

                // --- CORRECCIÓN AQUÍ ---
                // La validación de edad SÓLO se aplica a los campos de nacimiento.
                if (id === 'fechaN' || id === 'fecha-nac') {
                    this.agregarValidaciones(fechaInput);
                }
            }
        });
    }
    inicializarSelectorFamilia() {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');
        if (!selectorFamilia) return;

        const opciones = [
            { value: 'soltero', text: 'Soltero' },
            { value: 'casado', text: 'Casado' },
            { value: 'familia5', text: 'Familiar 5' },
            { value: 'familia10', text: 'Familiar 10' }
        ];

        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.value;
            option.textContent = opcion.text;
            selectorFamilia.appendChild(option);
        });

        // RESTAURAMOS ESTE LISTENER para que los precios se actualicen al cambiar el grupo
        selectorFamilia.addEventListener('change', () => {
            this.manejarSeleccionFamilia();
        });
    }

    manejarSeleccionFamilia() {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');

        if (!selectorFamilia) return;

        console.log('Familia seleccionada:', selectorFamilia.value);
        this.actualizarPrecios();
    }

    inicializarCheckboxes() {
        const checkboxes = ['auxilio', 'proteccion', 'asistencia', 'adicional'];
        const contenedorAdicional = document.querySelector('.Cont-adic-gen');

        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    if (id === 'adicional') {
                        if (e.target.checked) {
                            contenedorAdicional.style.display = 'flex';
                        } else {
                            contenedorAdicional.style.display = 'none';
                        }
                    }

                    // RESTAURAMOS ESTA LÓGICA para que los precios se actualicen al marcar un beneficio
                    if (this.productosCheckbox[id]) {
                        this.actualizarPrecios();
                    }
                });
            }
        });
    }
    inicializarPlanRadios() {
        const radios = document.querySelectorAll('.plan-radio-input');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    console.log('Plan seleccionado:', e.target.value);
                    this.actualizarResultadoFinal(e.target.value);
                }
            });
        });
    }

    inicializarBotonCotizar() {
        const botonCotizar = document.getElementById('cotizar');
        const formulario = document.querySelector('.form-Ex');
        // Identificamos el checkbox de política específico para este formulario
        const politicaCheckbox = document.getElementById('politica-cotizar');

        if (botonCotizar && formulario && politicaCheckbox) {
            botonCotizar.addEventListener('click', (e) => {
                e.preventDefault();

                const formularioValido = this.validarFormulario(formulario);
                const politicaAceptada = politicaCheckbox.checked;

                // Lógica independiente para mostrar toast y pop-up
                if (!formularioValido) {
                    this.mostrarToast();
                }
                if (!politicaAceptada) {
                    this.mostrarPopUp();
                }

                // Solo si AMBAS condiciones son verdaderas, procesamos la cotización
                if (formularioValido && politicaAceptada) {
                    this.procesarCotizacion();
                }
            });
        }
    }
    // Método mejorado para obtener productos seleccionados (sin duplicados)
    obtenerProductosSeleccionados() {
        const productosSeleccionados = new Set(); // Usar Set para evitar duplicados

        Object.keys(this.productosCheckbox).forEach(checkboxId => {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox && checkbox.checked) {
                productosSeleccionados.add(this.productosCheckbox[checkboxId]);
            }
        });

        return Array.from(productosSeleccionados); // Convertir Set a Array
    }

    // Método mejorado para calcular precio total de un plan
    calcularPrecioTotalPlan(planValue) {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');
        const tipoFamilia = selectorFamilia?.value || 'casado';

        const productosSeleccionados = this.obtenerProductosSeleccionados();
        let precioTotal = 0;

        console.log(`Calculando precio para ${tipoFamilia} - Plan ${planValue}`);
        console.log('Productos seleccionados:', productosSeleccionados);

        productosSeleccionados.forEach(producto => {
            const precio = this.precios[tipoFamilia]?.[producto]?.[planValue];
            if (precio) {
                console.log(`${producto}: $${this.formatearPrecio(precio)}`);
                precioTotal += precio;
            }
        });

        console.log(`Total: $${this.formatearPrecio(precioTotal)}`);
        return precioTotal;
    }

    procesarCotizacion() {
        console.log('Éxito en la validación, mostrando formulario detallado...');
        // La única acción necesaria es mostrar el formulario de la derecha.
        this.mostrarFormularioDetallado();
    }

    actualizarPrecioEnResultado() {
        // Obtener el plan seleccionado
        const planSeleccionado = document.querySelector('input[name="plan"]:checked');
        const resultadoEl = document.querySelector('.Cont-pre-EX h4');
        const periodoEl = document.querySelector('.Cont-pre-EX p');

        if (planSeleccionado && resultadoEl && periodoEl) {
            const planValue = planSeleccionado.value;
            const precioTotal = this.calcularPrecioTotalPlan(planValue);

            if (precioTotal > 0) {
                // Actualizar el precio
                resultadoEl.textContent = `$ ${this.formatearPrecio(precioTotal)}`;
                // Actualizar el período
                periodoEl.textContent = 'Anual';
            }
        }
    }

    mostrarFormularioDetallado() {
        const formDetallado = document.querySelector('.Cont-form-total');
        const imagenPlaceholder = document.querySelector('.Cont-dil-EX');

        if (formDetallado && imagenPlaceholder) {
            imagenPlaceholder.style.display = 'none';     // Oculta la imagen
            formDetallado.style.display = 'flex';         // Muestra el formulario

            this.inicializarSelectoresDetallados();
        }
    }

    inicializarValidadoresEspecificos() {
        // --- AÑADIMOS LA VALIDACIÓN EN TIEMPO REAL PARA EL DOCUMENTO ---
        const documentoInput = document.getElementById('documento');
        if (documentoInput) {
            // El evento 'blur' se activa cuando el usuario sale del campo
            documentoInput.addEventListener('blur', () => {
                // Llamamos a la función de validación especial que ya creamos
                this.realizarValidacionEspecial();
            });
        }
        // --- FIN DEL CÓDIGO AÑADIDO ---

        // Validación para el Celular (se mantiene igual)
        const celularInput = document.getElementById('celular');
        if (celularInput) {
            this.validators.celular = new PhoneValidator(celularInput, this.errorMessages);
            celularInput.addEventListener('input', () => {
                this.validators.celular.validatePhone();
            });
        }

        // Validación para el Correo (se mantiene igual)
        const correoInput = document.getElementById('correo');
        if (correoInput) {
            this.validators.correo = new EmailValidator(correoInput, this.errorMessages);
            correoInput.addEventListener('input', () => {
                this.validators.correo.validateStructure();
            });
        }
    }

    inicializarSelectoresDetallados() {
        // Tipos de documento
        const tipoDocumento = document.getElementById('tipo-documento');
        if (tipoDocumento) {
            const tiposDoc = [
                { value: 'CC', text: 'Cédula de Ciudadanía' },
                { value: 'CE', text: 'Cédula de Extranjería' },
                { value: 'TI', text: 'Tarjeta de Identidad' }
            ];

            tiposDoc.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.value;
                option.textContent = tipo.text;
                tipoDocumento.appendChild(option);
            });
        }

        // Departamentos (ejemplo básico)
        const departamento = document.getElementById('departamento');
        if (departamento) {
            const departamentos = [
                { value: 'bogota', text: 'Bogotá D.C.' },
                { value: 'antioquia', text: 'Antioquia' },
                { value: 'valle', text: 'Valle del Cauca' }
            ];

            departamentos.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto.value;
                option.textContent = depto.text;
                departamento.appendChild(option);
            });
        }

        // Actividades CIIU (ejemplo básico)
        const ciuu = document.getElementById('ciuu');
        if (ciuu) {
            const actividades = [
                { value: '6201', text: 'Actividades de programación informática' },
                { value: '4711', text: 'Comercio al por menor' },
                { value: '8511', text: 'Educación de la primera infancia' }
            ];

            actividades.forEach(actividad => {
                const option = document.createElement('option');
                option.value = actividad.value;
                option.textContent = actividad.text;
                ciuu.appendChild(option);
            });
        }
    }

    actualizarPrecios() {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');

        if (!selectorFamilia) return;

        const tipoFamilia = selectorFamilia.value;
        const productosSeleccionados = this.obtenerProductosSeleccionados();

        const planes = document.querySelectorAll('.Cont-gen-plan');
        const resultadoFinalEl = document.querySelector('.Cont-pre-EX h4');

        console.log('Actualizando precios - Familia:', tipoFamilia, 'Productos seleccionados:', productosSeleccionados);

        // Verificar que se haya seleccionado un grupo familiar y al menos un producto
        if (tipoFamilia && tipoFamilia !== '' && productosSeleccionados.length > 0) {

            // Actualizar precios en la lista y habilitar radios
            planes.forEach((plan) => {
                const radioInput = plan.querySelector('.plan-radio-input');
                const planId = radioInput.value;
                const precioElemento = plan.querySelector('.Cont-plan-total p');

                // Calcular precio total sumando todos los productos seleccionados
                const precioTotal = this.calcularPrecioTotalPlan(planId);

                if (precioElemento && precioTotal > 0) {
                    precioElemento.textContent = `$ ${this.formatearPrecio(precioTotal)}`;
                }
                if (radioInput) {
                    radioInput.disabled = false;
                    radioInput.style.display = 'block'; // Mostrar el radio button
                }
            });

            // Mostrar el desglose en consola para debug
            this.mostrarDesglosePreciosEnConsola();

        } else {
            // Si no se cumplen las condiciones, resetea todo
            planes.forEach(plan => {
                const precioEl = plan.querySelector('.Cont-plan-total p');
                const radioEl = plan.querySelector('.plan-radio-input');

                if (precioEl) precioEl.textContent = '$ 0';
                if (radioEl) {
                    radioEl.disabled = true;
                    radioEl.checked = false;
                    radioEl.style.display = 'none'; // Ocultar el radio button
                }
                plan.classList.remove('selected');
            });

            if (resultadoFinalEl) {
                resultadoFinalEl.textContent = '------';
            }
        }
    }

    actualizarResultadoFinal(planValue) {
        const resultadoEl = document.querySelector('.Cont-pre-EX h4');
        // --- INICIO DE LA CORRECCIÓN ---
        const periodoEl = document.querySelector('.Cont-pre-EX p'); // 1. Seleccionamos el elemento <p>
        // --- FIN DE LA CORRECCIÓN ---
        const precioTotal = this.calcularPrecioTotalPlan(planValue);

        if (resultadoEl && periodoEl && precioTotal > 0) {
            resultadoEl.textContent = `$ ${this.formatearPrecio(precioTotal)}`;
            periodoEl.textContent = 'Anual';
        }

        // ... resto de la función sin cambios ...
    }
    formatearPrecio(precio) {
        return new Intl.NumberFormat('es-CO').format(precio);
    }

    crearOverlayCalendario(fechaInput) {
        // Crear un div invisible que cubra el área del icono
        const iconArea = document.createElement('div');
        iconArea.style.position = 'absolute';
        iconArea.style.right = '15px';
        iconArea.style.top = '50%';
        iconArea.style.transform = 'translateY(-50%)';
        iconArea.style.width = '20px';
        iconArea.style.height = '20px';
        iconArea.style.cursor = 'pointer';
        iconArea.style.zIndex = '10';

        // Hacer que el contenedor del input sea relativo
        fechaInput.parentElement.style.position = 'relative';
        fechaInput.parentElement.appendChild(iconArea);

        // Evento click en el área del icono
        iconArea.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fechaInput.showPicker();
        });

        // También en el input mismo
        fechaInput.addEventListener('click', (e) => {
            e.stopPropagation();
            fechaInput.showPicker();
        });
    }

    agregarValidaciones(fechaInput) {
        fechaInput.addEventListener('change', () => {
            const validator = new InputValidator(fechaInput);
            const resultadoValidacion = this.validarRangoEdad(fechaInput.value);

            if (resultadoValidacion.isValid) {
                validator.clearError();
            } else {
                validator.showError(resultadoValidacion.message);
                fechaInput.value = ''; // Limpiar el campo si la fecha no es válida
            }
        });
    }

    validarRangoEdad(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);

        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();
        const mesNacimiento = nacimiento.getMonth();
        const diaNacimiento = nacimiento.getDate();

        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
        }

        console.log('Edad calculada:', edad);

        // --- CORRECCIÓN AQUÍ ---
        // Ahora llamamos a los mensajes desde la clase ErrorMessages
        if (edad < 18) {
            return { isValid: false, message: this.errorMessages.get('AGE_UNDER_18') };
        } else if (edad > 70) {
            return { isValid: false, message: this.errorMessages.get('AGE_OVER_70') };
        } else {
            return { isValid: true, message: '' };
        }
    }

    // Método auxiliar para mostrar desglose de precios en consola (debug)
    mostrarDesglosePreciosEnConsola() {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');
        const tipoFamilia = selectorFamilia?.value || 'casado';
        const productosSeleccionados = this.obtenerProductosSeleccionados();

        console.log('=== DESGLOSE DE PRECIOS ===');
        console.log(`Grupo familiar: ${tipoFamilia}`);
        console.log('Productos seleccionados:', productosSeleccionados);

        ['total', 'mas', 'plus', 'esencial'].forEach(plan => {
            let totalPlan = 0;
            console.log(`\nPlan ${plan.toUpperCase()}:`);

            productosSeleccionados.forEach(producto => {
                const precio = this.precios[tipoFamilia]?.[producto]?.[plan];
                if (precio) {
                    console.log(`  ${producto}: $${this.formatearPrecio(precio)}`);
                    totalPlan += precio;
                }
            });

            console.log(`  TOTAL PLAN ${plan.toUpperCase()}: $${this.formatearPrecio(totalPlan)}`);
        });
        console.log('========================');
    }

    // Método auxiliar para mostrar desglose de precios (para uso externo)
    mostrarDesglosePrecio(planValue) {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');
        const tipoFamilia = selectorFamilia?.value || 'casado';
        const productosSeleccionados = this.obtenerProductosSeleccionados();

        console.log('Desglose de precios para el plan', planValue, ':');

        let total = 0;
        productosSeleccionados.forEach(producto => {
            const precio = this.precios[tipoFamilia]?.[producto]?.[planValue];
            if (precio) {
                console.log(`- ${producto}: $${this.formatearPrecio(precio)}`);
                total += precio;
            }
        });

        console.log(`Total: $${this.formatearPrecio(total)}`);
        return total;
    }

    inicializarLimpiezaDeErrores() {
        const camposConValidacion = document.querySelectorAll('.form-Ex [required], .Cont-form-total [required]');

        camposConValidacion.forEach(campo => {
            // --- CORRECCIÓN AQUÍ ---
            // Ahora solo ignoramos los campos de fecha de nacimiento, que tienen validación especial.
            // El campo 'fecha-expe' ya no será ignorado.
            if (campo.id === 'fechaN' || campo.id === 'fecha-nac') {
                return;
            }
            // --- FIN DE LA CORRECCIÓN ---

            const validator = new InputValidator(campo);
            const evento = (campo.tagName.toLowerCase() === 'select' || campo.type === 'checkbox') ? 'change' : 'input';

            campo.addEventListener(evento, () => {
                validator.clearError();
            });
        });
    }

}

// =================================================================
// CLASE PARA MANEJAR DATOS DE UBICACIÓN (DEPARTAMENTOS Y MUNICIPIOS)
// Esta clase fue extraída de tu archivo de ejemplo JS.js
// =================================================================
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
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
        } catch (error) {
            console.error("Error al cargar ubicaciones:", error);
            throw error;
        }
    }

    filterMunicipalities(searchTerm, departmentId = null) {
        let results = this.municipalities;
        // Filtrar por departamento si se proporciona un ID
        if (departmentId) {
            results = results.filter(municipality => municipality.idDepartamento.toString() === departmentId);
        }
        // Filtrar por término de búsqueda
        return results.filter(municipality =>
            municipality.nombreMunicipio.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    getDepartmentById(departmentId) {
        return this.departments.find(dep => dep.idDepartamento === departmentId);
    }
}


// =================================================================
// CLASE PARA MANEJAR LA FUNCIONALIDAD DEL AUTOCOMPLETADO DE CIUDADES
// Esta clase fue extraída y adaptada de tu archivo de ejemplo JS.js
// =================================================================
class CityAutocomplete {
    constructor(locationService, inputElement, resultsElement, departmentSelectElement) {
        this.locationService = locationService;
        this.inputElement = inputElement;
        this.resultsElement = resultsElement;
        this.departmentSelectElement = departmentSelectElement; // El <select> de departamentos
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.inputElement.addEventListener("input", () => this.handleInput());
        // Limpiar resultados si el usuario hace clic en otro lugar
        document.addEventListener("click", (event) => {
            if (!this.inputElement.contains(event.target)) {
                this.clearResults();
            }
        });
        // Si cambia el departamento, limpiar el campo de ciudad
        this.departmentSelectElement.addEventListener('change', () => {
            this.inputElement.value = '';
            this.inputElement.focus();
        });
    }

    handleInput() {
        const value = this.inputElement.value.trim().toLowerCase();
        const selectedDepartmentId = this.departmentSelectElement.value;
        this.clearResults();

        if (value) {
            // Pasamos el ID del departamento para filtrar las ciudades
            const filteredResults = this.locationService.filterMunicipalities(value, selectedDepartmentId);
            this.displayResults(filteredResults);
        }
    }

    displayResults(municipalities) {
        municipalities.forEach(municipality => {
            const department = this.locationService.getDepartmentById(municipality.idDepartamento);
            const resultDiv = document.createElement("div");
            resultDiv.textContent = `${municipality.nombreMunicipio} - ${department?.NombreDepartamento || 'N/A'}`;
            resultDiv.classList.add("resultado-item-EX"); // Usamos la clase CSS que definimos
            resultDiv.addEventListener("click", () => this.selectResult(municipality, department));
            this.resultsElement.appendChild(resultDiv);
        });
    }

    selectResult(municipality, department) {
        this.inputElement.value = `${municipality.nombreMunicipio} - ${department?.NombreDepartamento || 'N/A'}`;
        this.clearResults();
    }

    clearResults() {
        this.resultsElement.innerHTML = "";
    }
}


// Inicializar la clase cuando se carga la página
const validador = new Validador();