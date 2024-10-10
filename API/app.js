import { findListConferencias } from './Services/ConferenciaService.js';
import { renderizarConferencias } from './views/conferenciaView.js';
import { openModalConferencias } from './views/conferenciaView.js';
import { mostrarUsuarios,buscarUsuarios,cargarUsuarios} from './views/usuarioViews.js';
import { cargarTodosLosArticulos,buscarArticulosEstado } from './views/articulosView.js';
import { mostrarEvaluaciones } from './views/evaluacionView.js';
import { listarComites } from './views/comiteViews.js';
// Hacer la función accesible globalmente
window.openModalConferencias = openModalConferencias;
window.buscarUsuarios = buscarUsuarios;
window.buscarArticulosEstado = buscarArticulosEstado;

document.addEventListener('DOMContentLoaded', () => {
    // Manejador para los enlaces del menú de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();  // Previene el comportamiento predeterminado del enlace

            // Ocultar todas las sections
            hideAllSections();

            // Muestra la sección correspondiente
            const sectionId = this.getAttribute('href').replace('#', '');
            document.getElementById(sectionId).style.display = 'block';

            // Verifica si se hizo clic en Conferencias para cargar los datos
            if (sectionId === 'section-conferencias') {
                mostrarListadoConferencias();
            }else if(sectionId === 'section-usuarios'){
                cargarUsuarios();
            }else if(sectionId === 'section-articulos'){
                cargarTodosLosArticulos();
            }else if(sectionId === 'section-evaluaciones'){
                mostrarEvaluaciones();
            }else if(sectionId === 'section-comites'){
                listarComites();
            }
        });
    });
});

// Función para ocultar todas las sections
function hideAllSections() {
    document.querySelectorAll('div[id^="section-"]').forEach(section => {
        section.style.display = 'none';
    });
}

// Función para mostrar el listado de conferencias
function mostrarListadoConferencias() {
    if (!document.getElementById('section-conferencias').hasAttribute('data-loaded')) {
        findListConferencias()
            .then(data => {
                renderizarConferencias(data);
                document.getElementById('section-conferencias').setAttribute('data-loaded', 'true');
            })
            .catch(e => {
                console.log(e);
            });
    } else {
        // Si ya se cargaron las conferencias, solo asegúrate de que estén visibles
        sectionConferencias.style.display = 'block';
    }
}

let usuarios = [];










