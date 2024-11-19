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


async function verPago(idInscripcion) {
    // Elementos del modal
    const modalLabel = document.getElementById('modalVerPagoLabel');
    const modalBody = document.getElementById('modalVerPagoBody');

    // Configurar el título del modal y mostrar cargando
    modalLabel.textContent = 'Detalles del Pago';
    modalBody.innerHTML = '<p>Cargando detalles del pago...</p>';

    try {
        // Petición al backend
        const response = await fetch(`${urlRailway}/pagos/inscripcion/${idInscripcion}`);
        
        // Manejar errores de la respuesta
        if (!response.ok) {
            modalBody.innerHTML = '<p>No se pudo cargar la información del pago.</p>';
            return;
        }

        // Procesar la respuesta
        const pagos = await response.json();

        // Validar si hay pagos asociados
        if (pagos.length === 0) {
            modalBody.innerHTML = '<p>No hay pagos registrados para esta inscripción.</p>';
            return;
        }

        // Generar contenido dinámico para cada pago
        let contenido = '';
        pagos.forEach(pago => {
            contenido += `
                <div class="mb-4">
                    <p><strong>Monto:</strong> ${pago.monto}</p>
                    <p><strong>Estado:</strong> ${pago.estado_pago}</p>
                    <p><strong>Fecha:</strong> ${new Date(pago.inscripcion.fechaInscripcion).toLocaleDateString()}</p>
                    <p><strong>Conferencia:</strong> ${pago.inscripcion.conferencia.nombre}</p>
                    <p><strong>Comprobante:</strong></p>
                    <img src="${pago.urlSoporte}" alt="Comprobante" class="img-fluid mb-3" style="max-width: 300px; height: auto;">
                    <hr>
                </div>
            `;
        });

        // Insertar contenido en el modal
        modalBody.innerHTML = contenido;

    } catch (error) {
        console.error('Error al cargar los detalles del pago:', error);
        modalBody.innerHTML = '<p>Ocurrió un error al cargar los detalles del pago.</p>';
    }

    // Mostrar el modal
    $('#modalVerPago').modal('show');
}
