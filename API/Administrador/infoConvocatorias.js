// Mantener el método findComites tal como está
async function findConvocatorias() {
    const result = await fetch(`${urlRailway}/convocatorias`, {
      method: 'GET'
    });
    return result;
  }

  async function obtenerConferenciasConvocatorias() {
    const response = await fetch(`${urlRailway}/conferencias`);
    const conferencias = await response.json();
    return conferencias;    
}

// Función para cargar los artículos en el dropdown
async function cargarConferencias() {
    const conferencias = await obtenerConferenciasConvocatorias();
    const conferenciasSelect = document.getElementById('selectConferenciaConvocatoria');
    conferenciasSelect.innerHTML = ''; // Limpiar opciones existentes
    conferencias.forEach(conferencia => {
        const option = document.createElement('option');
        option.value = conferencia.id_conferencia;
        option.textContent = ` ${conferencia.nombre}`;
        conferenciasSelect.appendChild(option);
    });
}

cargarConferencias();
  
  
  // Función para generar la tabla de comités
  function listarConvocatorias() {
    findConvocatorias()
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las convocatorias');
            }
            return response.json();
        })
        .then(convocatorias => {
            const tableBody = document.getElementById("tablaConvocatorias");
            
            // Verificar si el tbody existe
            if (!tableBody) {
                throw new Error('No se encontró el elemento tbody en la tabla');
            }
            let body = "";
            convocatorias.forEach(convocatoria => {
                body += `<tr>
                    <td>${convocatoria.id}</td>
                    <td class = "truncate-text" data-bs-toggle="tooltip" title="Descripción completa de la convocatoria">${convocatoria.descripcion}</td>
                    <td>${convocatoria.conferencia.nombre}</td>
                    <td>
                        <button class="btn btn-sm btn-info text-white px-2 my-2 mb-0 text-xs" onclick="toggleConvocatorias(${convocatoria.id})">
                          <i class="fa-solid fa-eye" style="font-size: 0.9rem;"></i> Ver
                        </button>

                        <button class="btn btn-sm btn-warning text-white px-2 my-2 mb-0 text-xs" data-bs-toggle="modal" data-id="${convocatoria.id}"
                           onclick="guardarIdComite(this)" data-bs-target="#modalEditarConvocatoria">
                        <i class="fa-solid fa-pen-to-square" style="font-size: 0.9rem;"></i> Editar 
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


  document.addEventListener('DOMContentLoaded', () => {
    listarConvocatorias();
  });

  document.addEventListener("DOMContentLoaded", function() {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});


  function toggleConvocatorias(convocatoriaId) {
    // Llamada a la API para obtener los detalles de la convocatoria
    fetch(`${urlRailway}/convocatorias/${convocatoriaId}`)
        .then(response => response.json())
        .then(data => {
            // Cargar datos en el modal
            document.getElementById("convocatoriaDescripcion").textContent = data.descripcion;
            document.getElementById("convocatoriaFechaInicioEnvio").textContent = data.fechaInicioEnvio;
            document.getElementById("convocatoriaFechaLimiteEnvio").textContent = data.fechaLimiteEnvio;
            document.getElementById("convocatoriaFechaAceptacion").textContent = data.fechaAceptacion;
            document.getElementById("convocatoriaFechaPublicacion").textContent = data.fechaPublicacion;
            document.getElementById("convocatoriaFechaEnvioPublicaciones").textContent = data.fechaEnvioPublicaciones;
            
            // Mostrar el modal
            const convocatoriaModal = new bootstrap.Modal(document.getElementById("convocatoriaModal"));
            convocatoriaModal.show();
        })
        .catch(error => console.error("Error al obtener los detalles de la convocatoria:", error));
}

  


  document.getElementById('formNuevaConvocatoria').addEventListener('submit', function(event) {
    event.preventDefault();

    const idConferencia = document.getElementById('selectConferenciaConvocatoria').value;

    const convocatoria = {
        descripcion: document.getElementById('descripcion').value,
        fechaInicioEnvio: document.getElementById('fechaInicioEnvio').value,
        fechaLimiteEnvio: document.getElementById('fechaLimiteEnvio').value,
        fechaAceptacion: document.getElementById('fechaAceptacion').value,
        fechaPublicacion: document.getElementById('fechaPublicacion').value,
        fechaEnvioPublicaciones: document.getElementById('fechaEnvioPublicaciones').value,
    };

    fetch(`${urlRailway}/convocatorias/agregar/${idConferencia}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(convocatoria),
      })
        .then((response) => {
          if (response.ok) {
             document.getElementById('formNuevaConvocatoria').reset();
             $('#modalNuevaConvocatoria').modal('hide');
             $(".modal-backdrop").remove();

            listarConvocatorias();// Recargar la página o actualizar la tabla dinámicamente
  
          } else {
            throw new Error("Error al agregar la convocatoria");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Ocurrió un error al agregar la convocatoria");
        });
});
  