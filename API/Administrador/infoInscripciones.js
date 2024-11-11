async function cargarInscripciones() {

    const response = await fetch(`${urlRailway}/inscripciones`);
    const inscripciones = await response.json();
    listaInscripcionesAdministrador.innerHTML = ""; // Limpiar el contenido antes de agregar nuevas filas

    inscripciones.forEach(inscripcion => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${inscripcion.conferencia.nombre}</td>
            <td>${inscripcion.conferencia.fecha_inicio}</td>
            <td>${inscripcion.conferencia.fecha_fin}</td>
            <td>${inscripcion.asistente.nombre} ${inscripcion.asistente.apellido}</td>
            <td>${inscripcion.asistente.rol.nombre}</td>
            <td>${inscripcion.estado}</td>
            <td>
                
                <button class="btn btn-info btn-sm" onclick="verPago(${inscripcion.id})">
                    <i class="fas fa-eye"></i> Ver Pago
                </button>
                <button class="btn btn-primary btn-sm" onclick="realizarPago(${inscripcion.id})">
                    <i class="fas fa-credit-card"></i>Estado
                </button>
            </td>
        `;

        listaInscripcionesAdministrador.appendChild(row);
    });
}

// Llama a esta función al cargar la página para mostrar las inscripciones
cargarInscripciones();