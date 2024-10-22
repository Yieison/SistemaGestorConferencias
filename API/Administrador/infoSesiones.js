// Función para obtener artículos desde la API
async function obtenerSalasSesiones() {
    const response = await fetch(`${urlRailway}/salas`);
    const salas = await response.json();
    return salas;
}

// Función para cargar los artículos en el dropdown
async function cargarSalas() {
    const salas = await obtenerSalasSesiones();
    console.log('Salas obtenidas:', salas)
    const salasSelect = document.getElementById('selectSala');
    salasSelect.innerHTML = ''; // Limpiar opciones existentes
    salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id;
        option.textContent = `Nombre : ${sala.nombre}`;
        salasSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la págin

async function obtenerConferenciasSesiones() {
    const response = await fetch(`${urlRailway}/conferencias`);
    const conferencias = await response.json();
    return conferencias;    
}

// Función para cargar los artículos en el dropdown
async function cargarConferencias() {
    const conferencias = await obtenerConferenciasSesiones();
    console.log('Conferencias obtenidas:', conferencias);
    const conferenciasSelect = document.getElementById('selectConferencia');
    conferenciasSelect.innerHTML = ''; // Limpiar opciones existentes
    conferencias.forEach(conferencia => {
        const option = document.createElement('option');
        option.value = conferencia.id_conferencia;
        option.textContent = ` ${conferencia.nombre}`;
        conferenciasSelect.appendChild(option);
    });
}

cargarConferencias();
cargarSalas();



function guardarSesion() {

    const nombre = document.getElementById("nombreSesion").value;
    const fecha = document.getElementById("fechaDiaSesion").value;
    const horaInicio = document.getElementById("horaInicioSesion").value;
    const horaFin = document.getElementById("horaFinSesion").value;
    const conferencia = document.getElementById('selectConferencia').value;
    const sala = document.getElementById('selectSala').value;

    const sesionData = {
        nombre: nombre,
        fechaDia: fecha,
        horaInicio : horaInicio,
        horaFin : horaFin,

    };

    fetch(`${urlRailway}/sesiones/agregar/${conferencia}/sala/${sala}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sesionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la sesion');
        }
        console.log('sesion exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalSesion').modal('hide');
        $('.modal-backdrop').remove();
        // Mostrar la notificación de éxito
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}