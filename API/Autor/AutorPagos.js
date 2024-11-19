


async function realizarPago(idInscripcion) {
    // Configurar el modal para realizar el pago
    const modalLabel = document.getElementById('modalPagoLabel');
    const modalBody = document.getElementById('modalPagoBody');
    const modalActionButton = document.getElementById('modalPagoActionButton');

    // Configurar el contenido del modal
    modalLabel.textContent = 'Realizar Pago';
    modalBody.innerHTML = `
        <form id="formRealizarPago" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="monto" class="form-label">Monto:</label>
                <input type="number" class="form-control" id="monto" name="monto" placeholder="Ingrese el monto" required>
            </div>
            <div class="mb-3">
                <label for="comprobante" class="form-label">Subir Comprobante:</label>
                <input type="file" class="form-control" id="comprobante" name="comprobante" accept="image/*" required>
            </div>
        </form>
    `;

    // Mostrar el botón de acción y asignar el evento
    modalActionButton.style.display = 'block';
    modalActionButton.textContent = 'Guardar';
    modalActionButton.onclick = async function () {
        const form = document.getElementById('formRealizarPago'); // Formulario
        const fileInput = document.getElementById('comprobante').files[0]; // Input de archivo
        const montoInput = parseFloat(document.getElementById('monto').value); // Input del monto
        
        // Validar campos
        if (!fileInput || !montoInput) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const pago = {
            estado_pago : "PENDIENTE VERIFICACION",
            monto : montoInput
        }

        // Construir el FormData
        const formData = new FormData();
        formData.append('file', fileInput); // Archivo
        formData.append('pago', 
            new Blob([JSON.stringify(pago)], { type: "application/json" })
        ); // Datos del pago en JSON


        try {
            // Enviar solicitud al backend
            const response = await fetch(`${urlBackendConferencia}/pagos/savePago/${idInscripcion}`, {
                method: 'POST',
                body: formData, // Enviar el cuerpo como FormData
            });

            if (response.ok) {
                alert('Pago realizado con éxito.');
                $('#modalPago').modal('hide'); // Cerrar el modal
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'No se pudo realizar el pago'}`);
            }
        } catch (error) {
            console.error('Error al realizar el pago:', error);
            alert('Hubo un problema al procesar el pago.');
        }
    };

    // Mostrar el modal
    $('#modalPago').modal('show');
}

async function verPago(idInscripcion) {
    // Configurar el modal para ver el pago
    const modalLabel = document.getElementById('modalPagoLabel');
    const modalBody = document.getElementById('modalPagoBody');
    const modalActionButton = document.getElementById('modalPagoActionButton');

    modalLabel.textContent = 'Detalles del Pago';
    modalBody.innerHTML = 'Cargando...';
    modalActionButton.style.display = 'none'; // Ocultar el botón de acción

    try {
        // Obtener datos del pago desde el backend
        const response = await fetch(`${urlBackendConferencia}/pagos/inscripcion/${idInscripcion}`);
        const pago = await response.json();

        if (response.ok) {
            // Verificar si hay pagos disponibles
            if (pago.length > 0) {
                // Generar contenido dinámico para cada pago
                modalBody.innerHTML = pago.map((pago) => `
                    <div class="mb-3">
                        <p><strong>Monto:</strong> ${pago.monto}</p>
                        <p><strong>Estado:</strong> ${pago.estado_pago}</p>
                        <p><strong>Fecha Inscripción:</strong> ${pago.inscripcion.fechaInscripcion}</p>
                        <p><strong>Conferencia:</strong> ${pago.inscripcion.conferencia.nombre}</p>
                        <p><strong>Comprobante:</strong></p>
                        <img src="${pago.urlSoporte}" alt="Comprobante" class="img-fluid mb-3" style="max-width: 300px; height: auto;">
                        <hr>
                    </div>
                `).join(''); // Une todos los pagos en un solo contenido
            } else {
                modalBody.innerHTML = '<p>No hay pagos registrados para esta inscripción.</p>';
            }
        } else {
            modalBody.innerHTML = '<p>No se pudo cargar la información del pago.</p>';
        }
    } catch (error) {
        console.error('Error al cargar el pago:', error);
        modalBody.innerHTML = '<p>Error al cargar la información del pago.</p>';
    }

    // Mostrar el modal
    $('#modalPago').modal('show');
}
