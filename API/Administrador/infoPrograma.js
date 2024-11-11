// Función para mostrar/ocultar la programación de una sesión específica
function verProgramacion(sesionId) {
    const programacion = document.getElementById(`programacionSesion${sesionId}`);
    programacion.style.display = programacion.style.display === "none" ? "block" : "none";
}

// Función para mostrar el modal de agregar presentación para una sesión específica
function mostrarModalAgregarPresentacion(sesionId) {
    // Guarda el id de la sesión en un campo oculto del modal o en una variable global si es necesario
    document.getElementById('sesionIdHiddenInput').value = sesionId;
    $('#modalAgregarPresentacion').modal('show');
}

// Función para mostrar el modal de agregar evento para una sesión específica
function mostrarModalAgregarEvento(sesionId) {
    document.getElementById('sesionIdHiddenInput').value = sesionId;
    $('#modalAgregarEvento').modal('show');
}