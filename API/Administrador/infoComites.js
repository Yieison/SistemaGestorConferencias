const urlBackendComites = "http://localhost:8080/comites";


// Mantener el método findComites tal como está
async function findComites() {
  const result = await fetch(`${urlRailway}/comites`, {
    method: 'GET'
  });
  return result;
}


// Función para generar la tabla de comités
function listarComites() {
  findComites()
      .then(response => {
          if (!response.ok) {
              throw new Error('Error al obtener los comités');
          }
          return response.json();
      })
      .then(comites => {
          const tableBody = document.getElementById("tablaComites");
          
          // Verificar si el tbody existe
          if (!tableBody) {
              throw new Error('No se encontró el elemento tbody en la tabla');
          }

          let body = "";
          console.log(comites);
          comites.forEach(comite => {
              body += `<tr>
                  <td>${comite.id}</td>
                  <td>${comite.nombre}</td>
                  <td>${comite.conferencia?.nombre || 'Sin conferencia'}</td>
                  <td>
                      <span class="my-2 mb-0 text-secondary text-xs" onclick="toggleUsuarios(${comite.id})">
                            <i class="fa-solid fa-eye" style="color:blue; font-size:1rem;"></i>
                        </span>
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#modalAgregarMiembro">
                              <i class="fa-solid fa-pen-to-square" style="color:orange; font-size:1rem;"></i>    
                        </span>
                      <div id="usuarios-${comite.id}" style="display:none;" class="mt-2">
                          ${Array.isArray(comite.usuarios) && comite.usuarios.length > 0
                              ? comite.usuarios.map(usuario => `
                                  <p>${usuario?.nombre || 'Desconocido'} ${usuario?.apellido || ''} (${usuario?.rol?.nombre || 'Sin rol'})</p>
                              `).join('')
                              : '<p>No hay usuarios asignados</p>'}
                      </div>
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


// Función para alternar la visibilidad de la lista de usuarios
function toggleUsuarios(comiteId) {
  const userList = document.getElementById(`usuarios-${comiteId}`);
  
  if (userList.style.display === 'none' || userList.style.display === '') {
      userList.style.display = 'block';
  } else {
      userList.style.display = 'none';
  }
}

// Llamamos a la función para listar los comités una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  listarComites();
});



async function obtenerConferencias() {
    const response = await fetch(`${urlRailway}/conferencias`);
    const conferencias = await response.json();
    return conferencias;
}

// Función para cargar los artículos en el dropdown
async function cargarConferencias() {
    const conferencias = await obtenerConferencias();
    const conferenciasSelect = document.getElementById('selectConferenciaComite');
    conferenciasSelect.innerHTML = ''; // Limpiar opciones existentes
    conferencias.forEach(conferencia => {
        const option = document.createElement('option');
        option.value = conferencia.id_conferencia;
        option.textContent = ` ${conferencia.nombre}`;
        conferenciasSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarConferencias();
});



function guardarComite() {

    const nombre = document.getElementById("nombreComite").value;
    const conferencia = document.getElementById("selectConferenciaComite").value;
    

    const conferenciaData = {
        nombre: nombre
    };

    fetch(`${urlRailway}/comites/agregarComite/conferencia/${conferencia}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(conferenciaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la sala');
        }
        console.log('Sala guardada exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalComite').modal('hide');
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}
