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
                        <p class="text-xs text-secondary mb-0">${conferencia.nombre}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary text-wrap mb-0">${conferencia.descripcion}</p>
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
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openModalAndFetchTopicos(${conferencia.id_conferencia})">
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





async function getTopicos(id) {
    const response = await fetch(`${urlBackendConferencia}/${id}/topicos`, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Error fetching topicos');
    }
    const result = await response.json();
    return result;
}

function openModalAndFetchTopicos(id) {
    // Mostrar el modal
    const myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    myModal.show();

    // Obtener los tópicos
    getTopicos(id).then(topicos => {
        // Limpiar la tabla existente
        const tablaDocumento = document.getElementById('tablaTopicos');
        tablaDocumento.innerHTML = '';

        // Rellenar la tabla con los nuevos datos
        topicos.forEach(topico => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${topico.id_topico}</td>
                <td>${topico.tema}</td>
                <td><i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i></td>
                <td><i class="fa-solid fa-trash" style="color: red; font-size: 1rem;"></td>
            `;
            tablaDocumento.appendChild(row);
        });
    }).catch(error => {
        console.error('Error fetching topicos:', error);
        alert('Error al cargar los tópicos. Por favor, inténtalo de nuevo.');
    });
}


function crearConferencia(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const lugar = document.getElementById("lugar").value;
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;
    const archivoImagen = document.getElementById("archivoImagen").files[0];

    const conferenciaData = {
        nombre: nombre,
        descripcion: descripcion,
        lugar: lugar,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    };

    const formData = new FormData();
    formData.append("file", archivoImagen);
    formData.append("conferencia", new Blob([JSON.stringify(conferenciaData)], { type: "application/json" }));

   

    fetch(urlBackendConferencia + "/saveConferencia", {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la conferencia');
        }
        console.log('Conferencia guardada exitosamente');
        alert('Conferencia creada exitosamente.');
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
        alert("No se pudo crear la conferencia")
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
        id_rol: 2,
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

    fetch('https://localhost:8080/usuarios/save', {
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


