// Función para obtener artículos desde la API
async function obtenerInstituciones() {
    const response = await fetch(`${urlRailway}/ubicacion/institucion`);
    const instituciones = await response.json();
    return instituciones;
}

// Función para cargar los artículos en el dropdown
async function cargarInstituciones() {
    const instituciones = await obtenerInstituciones();
    const institucionesSelect = document.getElementById('selectInstitucion');
    institucionesSelect.innerHTML = ''; // Limpiar opciones existentes
    instituciones.forEach(institucion => {
        const option = document.createElement('option');
        option.value = institucion.id;
        option.textContent = `Nombre : ${institucion.nombreInstitucion}`;
        institucionesSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarInstituciones();
});


function guardarSala() {

    const nombre = document.getElementById("nombreSala").value;
    const institucion = document.getElementById("selectInstitucion").value;
    const tipo = document.getElementById("selectTipoSala").value;
    const url = document.getElementById("urlSala").value;

    if (!url && tipo === 'virtual') {
        console.log(url)
        console.log("La URL no se ha proporcionado");
        return; // Evitar guardar si la URL está vacía cuando se selecciona virtual
    }


    const salaData = {
        nombre: nombre,
        tipo: tipo,
        urlSala : url
    };

    fetch(`${urlRailway}/salas/agregarSala/${institucion}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(salaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la sala');
        }
        console.log('Sala guardada exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalSalas').modal('hide');
        $(".modal-backdrop").remove();
        listarSalas();
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}


async function findSalas() {
    const result = await fetch(`${urlRailway}/salas`, {
      method: 'GET'
    });
    return result;
}

function listarSalas() {
    findSalas()
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las salas');
            }
            return response.json();
        })
        .then(salas => {
            const tableBody = document.getElementById("tablaSalas");
            
            // Verificar si el tbody existe
            if (!tableBody) {
                throw new Error('No se encontró el elemento tbody en la tabla');
            }
            let body = "";
            salas.forEach(sala => {
                body += `<tr>
                    <td>${sala.id}</td>
                    <td >${sala.nombre}</td>
                    <td>${sala.tipo}</td>
                    <td>${sala.institucion.nombreInstitucion}</td>
                    <td><span id="url-sala-${sala.id}" class="url-sala">
                    <i class="fa fa-copy" onclick="copiarUrl('${sala.urlSala}')" style="cursor: pointer; margin-left: 10px;"></i>
                    ${sala.urlSala.length > 50 ? sala.urlSala.substring(0, 35) + '...' : sala.urlSala}
                    </span>
                        
                    <td>
                       <button class="btn btn-sm btn-warning text-white px-2 my-2 mb-0 text-xs" data-bs-toggle="modal" data-id="${sala.id}"
                        onclick="guardarIdComite(this)" data-bs-target="#modalEditarSala">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.9rem;"></i> 
                        </button>

                    <button class="btn btn-sm btn-danger text-white px-2 my-2 mb-0 text-xs" data-bs-toggle="modal" data-bs-target="#modalEliminarSala" onclick="eliminarSala(${sala.id})">
                        <i class="fa-solid fa-trash" style="font-size: 0.9rem;"></i> 
                    </button>
                    </td>
                </tr>`;
            });
  
            // Asignar el contenido al tbody
            tableBody.innerHTML = body;
        })
        .catch(error => {
            console.error('Error al listar comités:', error);
        });
  }


  



function copiarUrl(url) {
    // Crea un campo de texto temporal
    const input = document.createElement('input');
    input.value = url;  // La URL a copiar
    document.body.appendChild(input);
    input.select();  // Selecciona el contenido del campo de texto
    document.execCommand('copy');  // Copia el contenido al portapapeles
    document.body.removeChild(input);  // Elimina el campo temporal

    // Opcional: mensaje de confirmación
    alert("URL copiada al portapapeles");
}




  document.addEventListener('DOMContentLoaded', () => {
    listarSalas();
  });


