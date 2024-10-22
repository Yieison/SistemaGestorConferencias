const urlBackendaprobados = "http://localhost:8080/evaluacion";
const urlBackendEvaluadores = "http://localhost:8080"


async function findEvaluaciones() {
    const result = await fetch(`${urlRailway}/evaluacion`, {
        method: "GET",
    });
    return result;
}

function mostrarEvaluaciones() {
    findEvaluaciones()
        .then((res) => res.json())
        .then((data) => {
            let body = "";
            // Dado que el JSON ya devuelve los artículos aprobados
            const articulosAprobados = Array.isArray(data) ? data : [data];

            for (const articulo of articulosAprobados) {
                let estadoColor = "";
                switch (articulo.estado.toLowerCase()) {
                    case "pendiente":
                        estadoColor = "badge bg-warning"; // Naranja
                        break;
                    case "aprobado":
                        estadoColor = "badge bg-success"; // Verde
                        break;
                    case "correcciones":
                        estadoColor = "badge bg-primary"; // Azul
                        break;
                    case "rechazado":
                        estadoColor = "badge bg-danger"; // Rojo
                        break;
                    default:
                        estadoColor = "badge bg-secondary"; // Color gris por defecto
                }
                body += `<tr>
                    <td>
                        <h6 class="mb-0 text-sm">${articulo.id}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${new Date(
                    articulo.fechaHora
                ).toLocaleString()}</p>
                    </td>
                    <td>
                    <p class="text-xs text-secondary mb-0">${articulo.evaluador.nombre} ${articulo.evaluador.apellido}</p>
                    </td>
                    <td>
                    <div class="nombre-articulo">
                    <p class="text-xs text-secondary mb-0">${articulo.articulo.nombre}</p>
                    </div>                    
                    </td>
                    <td>
                        <a href="${articulo.articulo.url
                    }" target="_blank">Ver Artículo</a>
                    </td>
                    <td>
                     <span class="${estadoColor}">${articulo.estado}</span> <!-- Aquí va el span de estado -->
                    </td>
                   <td>
                        <i class="fa-solid fa-comment" style="cursor: pointer;" onclick="toggleComentario(${articulo.id})"></i>
                        <div id="comentario-${articulo.id}" class="comentario" style="display: none;">
                        <p class="text-xs text-secondary mb-0">${articulo.comentario}</p> <!-- Aquí se mostrará el comentario -->
                        </div>
                    </td>
                    <td>
                    <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="realizarEvaluacion(${articulo.id
                    })">
                    <i class="fa-solid fa-pen-to-square" style="color:orange; font-size:1rem;"></i>
                    </span>
                    </td>
                </tr>`;
            }
            document.getElementById("tablaEvaluaciones").innerHTML = body;

            // Mostrar la sección de artículos aprobados
            document.getElementById("section-articulos-aprobado").style.display =
                "block";
        })
        .catch((e) => {
            console.log(e);
        });
}


function toggleComentario(id) {
    const comentarioElement = document.getElementById(`comentario-${id}`);
    
    // Alterna el estilo de display entre 'none' y 'block'
    if (comentarioElement.style.display === "none") {
        comentarioElement.style.display = "block"; // Muestra el comentario
    } else {
        comentarioElement.style.display = "none"; // Oculta el comentario
    }
}


function realizarEvaluacion(idEvaluacion) {
    const myModalEvaluacion = new bootstrap.Modal(document.getElementById("modalRealizarEvaluacion"));
    document.getElementById("idEvaluacion").value = idEvaluacion; // Cargar el ID de la evaluación seleccionada
    myModalEvaluacion.show();
}

function mostrarToast(titulo = 'Notificación', mensaje = 'Operación realizada con éxito', tipo = 'success') {
    const toastElement = document.getElementById('toastNotificacion');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
  
    // Establecer título y mensaje
    toastTitle.textContent = titulo;
    toastBody.textContent = mensaje;
  
    // Eliminar todas las clases de color previas
    const toastHeader = toastElement.querySelector('.toast-header');
    toastHeader.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
  
    // Añadir la clase de color según el tipo de notificación
    switch (tipo) {
      case 'success':
        toastHeader.classList.add('bg-success'); // Verde
        break;
      case 'error':
        toastHeader.classList.add('bg-danger'); // Rojo
        break;
      case 'warning':
        toastHeader.classList.add('bg-warning'); // Amarillo
        break;
      case 'info':
        toastHeader.classList.add('bg-info'); // Azul
        break;
      default:
        toastHeader.classList.add('bg-secondary'); // Gris por defecto
        break;
    }
  
    // Inicializar y mostrar el toast
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
  


function enviarEvaluacion() {
    const idEvaluacion = document.getElementById("idEvaluacion").value;
    const nuevoEstado = document.getElementById("nuevoEstado").value;
    const comentarios = document.getElementById("comentariosEvaluacion").value;
  
    if (!nuevoEstado || !comentarios) {
      alert("Debe completar todos los campos.");
      return;
    }
  
    fetch(`${urlRailway}/evaluacion/${idEvaluacion}/realizarEvaluacion/${nuevoEstado}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comentarios),
    })
      .then((response) => {
        if (response.ok) {
        $("#modalRealizarEvaluacion").modal("hide");
        $(".modal-backdrop").remove();
          mostrarToast('Éxito', 'Evaluación realizada con éxito', 'success');
          // Actualizar la UI según sea necesario
          mostrarEvaluaciones();// Recargar la página o actualizar la tabla dinámicamente

        } else {
          throw new Error("Error al realizar la evaluación");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Ocurrió un error al realizar la evaluación");
      });
  }
  

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarEvaluaciones();
});
