// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto );

    formulario.addEventListener('submit', agregarGasto);
}


// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);   
        this.restante = Number(presupuesto);   
        this.gastos = [];  
    }    

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;        
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}


class Ui {
    insertarPresupuesto( cantidad ) {
        // Extrayendo los valores
        const { presupuesto, restante } = cantidad;
       
        // Agregar al HTML
        document.querySelector('#total').textContent = presupuesto, restante;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('text-center','alert');

        if( tipo === 'error') {
            divAlerta.classList.add('alert-danger');
        } else {
            divAlerta.classList.add('alert-success');
                     
        }

        // Mensaje de error
        divAlerta.textContent = mensaje;

        // Insertar en el HTML
        // InsertBefore toma dos argumentos
        document.querySelector('.primario').insertBefore( divAlerta, formulario );

        // Quitar del HTML
        setTimeout(() => {
            divAlerta.remove();            
        }, 3000);
    }    

    mostrarGastos(gastos) {
        
        // Limpia el HTML
        this.limpiarHTML();


        // Iterar sobre los gatos
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-item-center';

            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;               

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $${cantidad} </span>`;

            // Boton para borrar
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            
            
            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);      
        })
    }

    limpiarHTML() {
        while ( gastoListado.firstChild ) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoColor) {
        const {presupuesto, restante } = presupuestoColor;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar 75%
        if ( ( presupuesto / 4 ) > restante ) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ( ( presupuesto / 2 ) > restante ) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success');
        }

        // Si el total es 0 o menor
        if ( restante <= 0 ) {
            ui.imprimirAlerta('Presupuesto agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}


// Instanciar
const ui = new Ui();
let presupuesto;


// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');    


    if( presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {        
        window.location.reload();
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

// Añadir gastos
function agregarGasto(e) {
    // Prevenir la accion x default
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');  
        return;  
    } else if ( cantidad <= 0 || isNaN(cantidad) || cantidad === null ) {
        ui.imprimirAlerta('Cantidad no valida', 'error'); 
        return;     
    }else {
        ui.imprimirAlerta('Gasto agregado Correctamente');
    }
    // Generar un objeto con el gasto ( Object literal )
    const gasto = { nombre, cantidad, id: Date.now() };

    // Añade un nuevo gasto
    presupuesto.nuevoGasto( gasto );    

    // Imprimir los gastos
    const { gastos, restante } = presupuesto
    ui.mostrarGastos( gastos );

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    
    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    // Elimina del objeto
    presupuesto.eliminarGasto(id);

    //Elimina los gatos del HTML
    const { gastos, restante } = presupuesto
    ui.mostrarGastos( gastos );
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}