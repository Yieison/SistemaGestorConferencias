async function cargarInscripciones() {

    const response = await fetch(`${urlRailway}/inscripciones`);
    const inscripciones = await response.json();
    console.log(inscripciones)
    listaInscripcionesAdministrador.innerHTML = ""; // Limpiar el contenido antes de agregar nuevas filas

    // Recorrer cada inscripción
    for (const inscripcion of inscripciones) {
        const row = document.createElement("tr");

        let estadoColor = "";
        switch (inscripcion.estado.toLowerCase()) {
            case "pendiente":
                estadoColor = "badge bg-warning"; // Naranja
                break;
            case "aprobada":
                estadoColor = "badge bg-success"; // Verde
                break;
            case "cancelada":
                estadoColor = "badge bg-danger"; // Rojo
                break;
            default:
                estadoColor = "badge bg-secondary"; // Gris por defecto
        }

        // Obtener los datos del asistente
        console.log(inscripcion.asistente.id_usuarios)
        let nombreCompleto = '';
        let Rol = '';
        if (inscripcion.asistente) {
            // Verificar si es un objeto con datos completos del asistente
            if (inscripcion.asistente.nombre && inscripcion.asistente.apellido) {
                nombreCompleto = `${inscripcion.asistente.nombre} ${inscripcion.asistente.apellido}`;
                Rol = `${inscripcion.asistente.rol.nombre}`
            } else {
                // Si solo tiene el id del asistente, hacer la consulta para obtener los datos completos
                try {
                    const asistenteResponse = await fetch(`${urlRailway}/usuarios/${inscripcion.asistente}`);
                    const asistente = await asistenteResponse.json();
                    nombreCompleto = `${asistente.nombre} ${asistente.apellido}`;
                    Rol = `${asistente.rol.nombre}`
                } catch (error) {
                    console.error("Error al obtener el asistente: ", error);
                    nombreCompleto = "Desconocido"; // Valor predeterminado en caso de error
                }
            }
        } else {
            nombreCompleto = "Desconocido"; // Si no existe el asistente
        }
        
          // Mostrará el nombre completo del asistente
        // Crear la fila de la tabla
        row.innerHTML = `
            <td>${inscripcion.conferencia.nombre}</td>
            <td>${nombreCompleto}</td>
            <td>${Rol}</td>
            <td>${inscripcion.fechaInscripcion}</td>
            <td class="${estadoColor}">${inscripcion.estado}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="verPago(${inscripcion.id})">
                    <i class="fas fa-eye"></i> Ver Pago
                </button>
                <button class="btn btn-primary btn-sm" onclick="activarInscripcion(${inscripcion.id})">
                    <i class="fas fa-credit-card"></i> Estado
                </button>
            </td>
        `;

        // Agregar la fila a la tabla
        listaInscripcionesAdministrador.appendChild(row);
    }
}

// Llamar a esta función al cargar la página para mostrar las inscripciones
cargarInscripciones();



function activarInscripcion(idInscripcion) {
    // Guarda el ID de la inscripción en un campo oculto dentro del modal
    document.getElementById("inscripcionId").value = idInscripcion;

    // Abre el modal
    const modal = new bootstrap.Modal(document.getElementById("modalEstado"));
    modal.show();
}


async function enviarEstado(estado) {
    const idInscripcion = document.getElementById("inscripcionId").value;
    const url = `${urlRailway}/inscripciones/activar/${idInscripcion}/new/${estado}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert(`Estado cambiado a ${estado}`);
            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalEstado"));
            modal.hide();
            // Recargar la lista de inscripciones para reflejar los cambios
            cargarInscripciones();
        } else {
            alert('Error al cambiar el estado');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la conexión');
    }
}