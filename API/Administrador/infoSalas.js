// Función para obtener artículos desde la API
async function obtenerInstituciones() {
    const response = await fetch(`${urlRailway}/ubicacion/institucion`);
    const instituciones = await response.json();
    return instituciones;
}

// Función para cargar los artículos en el dropdown
async function cargarInstituciones() {
    const instituciones = await obtenerInstituciones();
    const institucionesSelect = document.getElementById('selectInstitucion');
    institucionesSelect.innerHTML = ''; // Limpiar opciones existentes
    instituciones.forEach(institucion => {
        const option = document.createElement('option');
        option.value = institucion.id;
        option.textContent = `Nombre : ${institucion.nombreInstitucion}`;
        institucionesSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarInstituciones();
});


function guardarSala() {

    const nombre = document.getElementById("nombreSala").value;
    const institucion = document.getElementById("selectInstitucion").value;
    const tipo = document.getElementById("selectTipoSala").value;
    

    const salaData = {
        nombre: nombre,
        tipo: tipo,
    };

    fetch(`${urlRailway}/salas/agregarSala/${institucion}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(salaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la sala');
        }
        console.log('Sala guardada exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalSala').modal('hide');
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}