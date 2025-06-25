class Validador {
    constructor() {
        this.precios = {
            casado: {
                proteccionGarantizada: {
                    total: 960633,
                    mas: 709097,
                    plus: 534111,
                    esencial: 429121
                }
            }
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
        this.inicializarCalendario();
        this.inicializarSelectorFamilia();
        this.inicializarCheckboxes();
        this.inicializarPlanRadios();
        this.inicializarBotonCotizar();
    }

    inicializarCalendario() {
        const fechaInput = document.getElementById('fechaN');
        if (!fechaInput) return;
        this.crearOverlayCalendario(fechaInput);
        this.agregarValidaciones(fechaInput);
    }

    inicializarSelectorFamilia() {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');
        if (!selectorFamilia) return;

        // Agregar opciones al selector
        const opciones = [
            { value: 'soltero', text: 'Soltero' },
            { value: 'casado', text: 'Casado' },
            { value: 'familia', text: 'Familia con hijos' }
        ];

        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.value;
            option.textContent = opcion.text;
            selectorFamilia.appendChild(option);
        });

        // Agregar evento de cambio
        selectorFamilia.addEventListener('change', () => {
            this.manejarSeleccionFamilia();
        });
    }

    manejarSeleccionFamilia() {
        const selectorFamilia = document.getElementById('grupo-fam-Ex');
        const checkProteccion = document.getElementById('proteccion');

        if (!selectorFamilia || !checkProteccion) return;

        console.log('Familia seleccionada:', selectorFamilia.value);
        this.actualizarPrecios();
    }

    inicializarCheckboxes() {
        const checkboxes = ['peps', 'proteccion', 'asistencia', 'adicional', 'politica'];

        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    console.log(`Checkbox ${id} cambiado:`, e.target.checked);

                    // Si es el checkbox de protección, actualizar precios
                    if (id === 'proteccion') {
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
        if (botonCotizar) {
            botonCotizar.addEventListener('click', (e) => {
                e.preventDefault();
                this.procesarCotizacion();
            });
        }
    }

   procesarCotizacion() {
    console.log('Procesando cotización...');

    // Validar campos obligatorios
    const camposObligatorios = [
        { id: 'grupo-fam-Ex', nombre: 'Grupo familiar' },
        { id: 'fechaN', nombre: 'Fecha de nacimiento' },
        { id: 'politica', nombre: 'Política de privacidad', tipo: 'checkbox' }
    ];

    let hayErrores = false;

    camposObligatorios.forEach(campo => {
        const elemento = document.getElementById(campo.id);
        const mensajeError = elemento?.parentElement?.querySelector('.mensaje-error-EX');

        if (campo.tipo === 'checkbox') {
            if (!elemento?.checked) {
                if (mensajeError) mensajeError.style.display = 'block';
                hayErrores = true;
            } else {
                if (mensajeError) mensajeError.style.display = 'none';
            }
        } else {
            if (!elemento?.value) {
                if (mensajeError) mensajeError.style.display = 'block';
                hayErrores = true;
            } else {
                if (mensajeError) mensajeError.style.display = 'none';
            }
        }
    });

    if (!hayErrores) {
        // NUEVA FUNCIONALIDAD: Actualizar el precio en el resultado
        this.actualizarPrecioEnResultado();
        this.mostrarFormularioDetallado();
    }
}

actualizarPrecioEnResultado() {
    // Obtener el plan seleccionado
    const planSeleccionado = document.querySelector('input[name="plan"]:checked');
    const resultadoEl = document.querySelector('.Cont-pre-EX h4');
    const periodoEl = document.querySelector('.Cont-pre-EX p');
    
    if (planSeleccionado && resultadoEl && periodoEl) {
        const planValue = planSeleccionado.value;
        const precio = this.precios.casado.proteccionGarantizada[planValue];
        
        if (precio) {
            // Actualizar el precio
            resultadoEl.textContent = `$ ${this.formatearPrecio(precio)}`;
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
        const checkProteccion = document.getElementById('proteccion');

        if (!selectorFamilia || !checkProteccion) return;

        const tipoFamilia = selectorFamilia.value;
        const proteccionActivada = checkProteccion.checked;

        const planes = document.querySelectorAll('.Cont-gen-plan');
        const resultadoFinalEl = document.querySelector('.Cont-pre-EX h4');

        console.log('Actualizando precios - Familia:', tipoFamilia, 'Protección:', proteccionActivada);

        // --- ESTA ES LA LÍNEA CORREGIDA ---
        // Ahora verifica que se haya seleccionado CUALQUIER grupo familiar (no esté vacío)
        // y que la protección esté activada.
        if (tipoFamilia && tipoFamilia !== '' && proteccionActivada) {
            const precios = this.precios.casado.proteccionGarantizada;

            // Actualizar precios en la lista y habilitar radios
            planes.forEach((plan) => {
                const radioInput = plan.querySelector('.plan-radio-input');
                const planId = radioInput.value;
                const precioElemento = plan.querySelector('.Cont-plan-total p');

                if (precioElemento && precios[planId]) {
                    precioElemento.textContent = `$ ${this.formatearPrecio(precios[planId])}`;
                }
                if (radioInput) {
                    radioInput.disabled = false;
                    radioInput.style.display = 'block'; // Mostrar el radio button
                }
            });
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
        const precio = this.precios.casado.proteccionGarantizada[planValue];

        if (resultadoEl && precio) {
            resultadoEl.textContent = `$ ${this.formatearPrecio(precio)}`;
        }

        // Resaltado visual del plan seleccionado
        document.querySelectorAll('.Cont-gen-plan').forEach(div => {
            div.classList.remove('selected');
        });

        const radioSeleccionado = document.getElementById(`plan-${planValue}`);
        if (radioSeleccionado) {
            radioSeleccionado.closest('.Cont-gen-plan').classList.add('selected');
        }
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
            console.log('Fecha seleccionada:', fechaInput.value);
            this.validarEdadMinima(fechaInput.value);
        });
    }

    validarEdadMinima(fechaNacimiento) {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        const edad = hoy.getFullYear() - nacimiento.getFullYear();

        console.log('Edad calculada:', edad);

        if (edad < 18) {
            alert('Debe ser mayor de edad para contratar el seguro');
            return false;
        }
        return true;
    }
}

// Inicializar la clase cuando se carga la página
const validador = new Validador();