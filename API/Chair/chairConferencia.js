const urlBackendConferencia = "https://unique-courage-production.up.railway.app/conferencias"

// Obtener los datos del usuario desde localStorage
var userDataString = localStorage.getItem('Data');
var userData = userDataString ? JSON.parse(userDataString) : null;

if (userData) {
    var idChair = userData.id_usuarios;
    console.log(userData.id_usuarios)

    async function findListConferenciasChair() {
        const result = await fetch( `https://unique-courage-production.up.railway.app/conferencias/lista/${idChair}`, {
            method: 'GET'
        });
        return result;
    }

    function mostrarListadoConferenciasChair() {
        findListConferenciasChair()
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
                document.getElementById("tablaConferenciasChair").innerHTML = body;
    
                // Mostrar la sección de evaluadores
                document.getElementById("section-conferenciasChair").style.display = 'none';
            })
            .catch(e => {
                console.log(e);
            });
            
    }
    
    function mostrarInformacion() {
        document.getElementById("section-conferenciasChair").style.display = 'none';
        document.getElementById("section-info").style.display = 'block';
    }
    
    // Mostrar la información del usuario al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
        mostrarInformacion();
        mostrarListadoConferenciasChair();
    });
    
    console.log(body)


}


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
    const myModal = new bootstrap.Modal(document.getElementById('staticBackdropTopicos'));
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

   