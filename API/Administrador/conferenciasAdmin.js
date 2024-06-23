const urlBackendConferencia = "http://localhost:8080/conferencias";

async function findListConferencias() {
    const result = await fetch(urlBackendConferencia , {
        method: 'GET'
    });
    return result;
}

function mostrarListadoConferencias() {
    findListConferencias()
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let body = "";
            for (const conferencia of data) {
                body += `<tr>
                     <td class="align-middle text-center text-sm">
                        <img class="imagen-conference" src="${conferencia.imagenUrl}"></span>
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
                        <p class="text-xs text-secondary mb-0">${conferencia.lugar}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${conferencia.fecha_inicio}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="mb-0 text-secondary text-xs">${conferencia.fecha_fin}</span>
                    </td>
                    
                   
                    <td class="align-middle text-center text-sm">
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openModalConferencias(${conferencia.id_conferencia})">
                            <i class="fa-solid fa-eye" style="color:blue; font-size: 1.5rem; "></i>
                        </span>
                    </td>
                </tr>`;
            }
            document.getElementById("tablaConferencias").innerHTML = body;

            // Mostrar la sección de evaluadores
            document.getElementById("section-conferencias").style.display = 'none';
        })
        .catch(e => {
            console.log(e);
        });
}

function mostrarInformacion() {
    document.getElementById("section-conferencias").style.display = 'none';
    document.getElementById("section-info").style.display = 'block';
}

// Mostrar la información del usuario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarInformacion();
    mostrarListadoConferencias();
});

console.log(body)

function openModalConferencias(idConferencia) {
    // Mostrar el modal de detalles de la conferencia
    const myModal = new bootstrap.Modal(document.getElementById('modalConferenciaDetalles'));

    // Realizar la llamada fetch para obtener los detalles de la conferencia seleccionada
    fetch(`http://localhost:8080/conferencias/${idConferencia}`)
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
                fetch(`http://localhost:8080/conferencias/${idConferencia}/topicos`)
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









function crearConferencia(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreConferencia").value;
    const descripcion = document.getElementById("descripcion").value;
    const lugar = document.getElementById("lugar").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const archivoImagen = document.getElementById("archivoImagen").files[0];

    const conferenciaData = {
        nombre: nombre,
        descripcion: descripcion,
        lugar: lugar,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
    };

    const formData = new FormData();
    formData.append("file", archivoImagen);
    formData.append("conferencia", new Blob([JSON.stringify(conferenciaData)], { type: "application/json" }));

   

    fetch("http://localhost:8080/conferencias/saveConferencia", {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la conferencia');
        }
        console.log('Conferencia guardada exitosamente');
        alert('Conferencia creada exitosamente.');

        const modal = document.getElementById("modalConferencia"); // Cambia esto al ID correcto de tu modal
        if (modal) {
            modal.style.display = "none";
        }

        // Remover las clases del modal y el overlay
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        }

        // Reflejar los cambios automáticamente llamando a la función para obtener conferencias
        mostrarListadoConferencias(); // Asegúrate de que esta función actualice la lista de conferencias en tu página

        // Limpiar el formulario
        document.getElementById("nombreConferencia").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("lugar").value = "";
        document.getElementById("fechaInicio").value = "";
        document.getElementById("fechaFin").value = "";
        document.getElementById("archivoImagen").value = "";
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}




function guardarChair() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;
    const tipo_documento = document.getElementById("tipo_documento").value;
    const documento = document.getElementById("documento").value;
    const rol_id = {
        id_rol: 3,
        nombre: "CHAIR"
    };
    

    const chairData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: contraseña,
        tipoDocumento: tipo_documento,
        documento : documento,
        rol : rol_id
    };

    fetch('http://localhost:8080/usuarios/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chairData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el evaluador');
        }
        console.log('chair guardado exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalChair').modal('hide');
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
    
}




