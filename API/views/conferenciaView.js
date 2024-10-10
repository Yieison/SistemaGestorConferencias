export function renderizarConferencias(conferencias) {
    let body = '';
    for (const conferencia of conferencias) {
        body += `<tr>
                    <td class="align-middle text-center text-sm">
                        <img class="imagen-conference" src="${conferencia.imagenUrl}">
                    </td>
                    <td>
                        <h6 class="mb-0 text-sm">${conferencia.id_conferencia}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${conferencia.chair ? conferencia.chair.nombre + " " + conferencia.chair.apellido : 'Sin Chair'}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${conferencia.nombre}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${conferencia.fecha_inicio}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="mb-0 text-secondary text-xs">${conferencia.fecha_fin}</span>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openModalConferencias(${conferencia.id_conferencia})">
                            <i class="fa-solid fa-eye" style="color:blue; font-size:1rem;"></i>
                        </span>
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editarConferencia(${conferencia.id_conferencia})">
                            <i class="fa-solid fa-pen-to-square" style="color:orange; font-size:1rem;"></i>
                        </span>
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="eliminarConferencia(${conferencia.id_conferencia})">
                            <i class="fa-solid fa-trash" style="color:red; font-size:1rem;"></i>
                        </span>
                    </td>
                </tr>`;
    }
    document.getElementById("tablaConferencias").innerHTML = body;
}

const urlBackendConferencia = "http://localhost:8080/conferencias"

export function openModalConferencias(idConferencia) {
    // Mostrar el modal de detalles de la conferencia
    const myModal = new bootstrap.Modal(document.getElementById('modalConferenciaDetalles'));

    // Realizar la llamada fetch para obtener los detalles de la conferencia seleccionada
    fetch(`${urlBackendConferencia}/${idConferencia}`)
        .then(response => response.json())
        .then(conferencia => {
            // Rellenar el contenido de la pestaña "Detalles"
            let detailsContent = `
                <h6>ID: ${conferencia.id_conferencia}</h6>
                <p><strong>Nombre:</strong> ${conferencia.nombre}</p>
                <p><strong>Chair:</strong> ${conferencia.chair ? conferencia.chair.nombre + " " + conferencia.chair.apellido : 'Sin Chair'}</p>
                <p><strong>Descripción:</strong> ${conferencia.descripcion}</p>
                <p><strong>Lugar:</strong> ${conferencia.lugar}</p>
                <p><strong>Fecha Inicio:</strong> ${conferencia.fecha_inicio}</p>
                <p><strong>Fecha Fin:</strong> ${conferencia.fecha_fin}</p>
                <img src="${conferencia.imagenUrl}" alt="Imagen de la Conferencia" class="img-fluid">
            `;
            document.getElementById('details-content').innerHTML = detailsContent;

            // Mostrar el modal de detalles de la conferencia
            myModal.show();

            // Limpiar la tabla de tópicos al abrir el modal
            document.getElementById('tablaTopicosAdmin').innerHTML = '';

            // Mostrar los tópicos cuando se hace clic en la pestaña "Tópicos"
            document.getElementById('topics-tab').addEventListener('click', function topicsTabClickHandler() {
               
                // Obtener los tópicos de la conferencia seleccionada
                fetch(`${urlBackendConferencia}/${idConferencia}/topicos`)
                    .then(response => response.json())
                    .then(topicos => {
                        // Limpiar la tabla existente
                        const tablaDocumento = document.getElementById('tablaTopicosAdmin');
                        tablaDocumento.innerHTML = '';

                        // Rellenar la tabla con los nuevos datos
                        topicos.forEach(topico => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${topico.id_topico}</td>
                                <td>${topico.tema}</td>
                                <td><i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i></td>
                                <td><i class="fa-solid fa-trash" style="color: red; font-size: 1rem;"></i></td>
                            `;
                            tablaDocumento.appendChild(row);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching topicos:', error);
                        alert('Error al cargar los tópicos. Por favor, inténtalo de nuevo.');
                    });
                
                // Remover el event listener después de que se haya ejecutado una vez
                document.getElementById('topics-tab').removeEventListener('click', topicsTabClickHandler);
            });
        })
        .catch(error => {
            console.error('Error al obtener los detalles de la conferencia:', error);
            alert('Error al obtener los detalles de la conferencia. Inténtalo de nuevo más tarde.');
        });
}

async function obtenerChairs() {
    const response = await fetch(`http://localhost:8080/usuarios/findUsuarios/CHAIR`);
    const chairs = await response.json();
    return chairs;
}

async function cargarChairs() {
    const chairs = await obtenerChairs();
    const chairsSelect = document.getElementById('selectChair');
    chairsSelect.innerHTML = ''; // Limpiar opciones existentes
    chairs.forEach(chair => {
        const option = document.createElement('option');
        option.text = `Asignar CHAIR : ${chair.nombre} ${chair.apellido}`;
        option.value = chair.id_usuarios;
        chairsSelect.appendChild(option);
    });
}


    cargarChairs(); 




