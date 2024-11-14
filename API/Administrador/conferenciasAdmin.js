const urlBackendConferencia =
 "https://remarkable-commitment-production.up.railway.app/conferencias";
const urlRailway = "https://remarkable-commitment-production.up.railway.app";

/* document.addEventListener('DOMContentLoaded', () => {
    // Manejador para los enlaces del menú de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();  // Previene el comportamiento predeterminado del enlace

            // Ocultar todas las sections
            hideAllSections();

            // Muestra la sección correspondiente
            const sectionId = this.getAttribute('href').replace('#', '');
            document.getElementById(sectionId).style.display = 'block';

            // Verifica si se hizo clic en Conferencias para cargar los datos
            if (sectionId === 'section-conferencias') {
                mostrarListadoConferencias();
            }
        });
    });
});

// Función para ocultar todas las sections
function hideAllSections() {
    document.querySelectorAll('div[id^="section-"]').forEach(section => {
        section.style.display = 'none';
    });
} */

async function findListConferencias() {
  const result = await fetch(urlBackendConferencia, {
    method: "GET",
  });
  return result;
}

function mostrarListadoConferencias() {
  if (
    !document.getElementById("section-conferencias").hasAttribute("data-loaded")
  ) {
    findListConferencias()
      .then((res) => res.json())
      .then((data) => {
        let body = "";
        for (const conferencia of data) {
          let estadoColor = "";
          switch (conferencia.estado.toLowerCase()) {
            case "activa":
              estadoColor = "badge bg-success"; // Naranja
              break;
            case "inactiva":
              estadoColor = "badge bg-danger"; // Verde
              break;
            default:
              estadoColor = "badge bg-secondary"; // Gris por defecto
          }
          body += `<tr>
                     <td class="align-middle text-center text-sm">
                        <img class="imagen-conference" src="${
                          conferencia.imagenUrl
                        }"></span>
                    </td>
                    <td>
                        <h6 class="mb-0 text-sm">${
                          conferencia.id_conferencia
                        }</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${
                          conferencia.chair
                            ? conferencia.chair.nombre +
                              " " +
                              conferencia.chair.apellido
                            : "Sin Chair"
                        }</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${
                          conferencia.nombre
                        }</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${
                          conferencia.fecha_inicio
                        }</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="mb-0 text-secondary text-xs">${
                          conferencia.fecha_fin
                        }</span>
                    </td>

                    <td>
                     <span class="${estadoColor}">${conferencia.estado}</span> <!-- Aquí va el span de estado -->
                    </td>
                    
                   
                    <td class="align-middle text-center text-sm">
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="openModalConferencias(${
                          conferencia.id_conferencia
                        })">
                            <i class="fa-solid fa-eye" style="color:blue; font-size:1rem;"></i>
                        </span>
                        <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editarConferencia(${
                          conferencia.id_conferencia
                        })">
                            <i class="fa-solid fa-pen-to-square" style="color:orange; font-size:1rem;"></i>
                    </span>
                    <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="eliminarConferencia(${
                      conferencia.id_conferencia
                    })">
                            <i class="fa-solid fa-toggle-off" style="color:gray; font-size:1rem;"></i>
                    </span>
                    </td>
                </tr>`;
        }
        document.getElementById("tablaConferencias").innerHTML = body;
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

function mostrarInformacion() {
  document.getElementById("section-conferencias").style.display = "none";
  document.getElementById("section-info").style.display = "block";
}

// Mostrar la información del usuario al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  mostrarInformacion();
  mostrarListadoConferencias();
});

function openModalConferencias(idConferencia) {
  // Mostrar el modal de detalles de la conferencia
  const myModal = new bootstrap.Modal(
    document.getElementById("modalConferenciaDetalles")
  );

  // Realizar la llamada fetch para obtener los detalles de la conferencia seleccionada
  fetch(`${urlRailway}/conferencias/${idConferencia}`)
    .then((response) => response.json())
    .then((conferencia) => {
      // Rellenar el contenido de la pestaña "Detalles"
      let detailsContent = `
                <h6>ID: ${conferencia.id_conferencia}</h6>
                <p><strong>Nombre:</strong> ${conferencia.nombre}</p>
                <p><strong>Chair:</strong> ${
                  conferencia.chair
                    ? conferencia.chair.nombre +
                      " " +
                      conferencia.chair.apellido
                    : "Sin Chair"
                }</p>
                <p><strong>Descripción:</strong> ${conferencia.descripcion}</p>
                <p><strong>Lugar:</strong> ${conferencia.lugar}</p>
                <p><strong>Fecha Inicio:</strong> ${
                  conferencia.fecha_inicio
                }</p>
                <p><strong>Fecha Fin:</strong> ${conferencia.fecha_fin}</p>
                <img src="${
                  conferencia.imagenUrl
                }" alt="Imagen de la Conferencia" class="img-fluid">
            `;
      document.getElementById("details-content").innerHTML = detailsContent;

      // Mostrar el modal de detalles de la conferencia
      myModal.show();

      // Limpiar la tabla de tópicos al abrir el modal
      document.getElementById("tablaTopicosAdmin").innerHTML = "";

      // Mostrar los tópicos cuando se hace clic en la pestaña "Tópicos"
      document
        .getElementById("topics-tab")
        .addEventListener("click", function topicsTabClickHandler() {
          // Obtener los tópicos de la conferencia seleccionada
          fetch(`${urlRailway}/conferencias/${idConferencia}/topicos`)
            .then((response) => response.json())
            .then((topicos) => {
              // Limpiar la tabla existente
              const tablaDocumento =
                document.getElementById("tablaTopicosAdmin");
              tablaDocumento.innerHTML = "";

              // Rellenar la tabla con los nuevos datos
              topicos.forEach((topico) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                                <td>${topico.id_topico}</td>
                                <td>${topico.tema}</td>
                                <td><i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i></td>
                                <td><i class="fa-solid fa-trash" style="color: red; font-size: 1rem;"></i></td>
                            `;
                tablaDocumento.appendChild(row);
              });
            })
            .catch((error) => {
              console.error("Error fetching topicos:", error);
              alert(
                "Error al cargar los tópicos. Por favor, inténtalo de nuevo."
              );
            });

          // Remover el event listener después de que se haya ejecutado una vez
          document
            .getElementById("topics-tab")
            .removeEventListener("click", topicsTabClickHandler);
        });
        document
        .getElementById("dates-tab")
        .addEventListener("click", function topicsTabClickHandler() {
          // Obtener los tópicos de la conferencia seleccionada
          fetch(`${urlRailway}/conferencias/${idConferencia}/topicos`)
            .then((response) => response.json())
            .then((topicos) => {
              // Limpiar la tabla existente
              const tablaDocumento =
                document.getElementById("tablaTopicosAdmin");
              tablaDocumento.innerHTML = "";

              // Rellenar la tabla con los nuevos datos
              topicos.forEach((topico) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                                <td>${topico.id_topico}</td>
                                <td>${topico.tema}</td>
                                <td><i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i></td>
                                <td><i class="fa-solid fa-trash" style="color: red; font-size: 1rem;"></i></td>
                            `;
                tablaDocumento.appendChild(row);
              });
            })
            .catch((error) => {
              console.error("Error fetching topicos:", error);
              alert(
                "Error al cargar los tópicos. Por favor, inténtalo de nuevo."
              );
            });

          // Remover el event listener después de que se haya ejecutado una vez
          document
            .getElementById("topics-tab")
            .removeEventListener("click", topicsTabClickHandler);
        });
    })
    .catch((error) => {
      console.error("Error al obtener los detalles de la conferencia:", error);
      alert(
        "Error al obtener los detalles de la conferencia. Inténtalo de nuevo más tarde."
      );
    });
}

async function obtenerChairs() {
  const response = await fetch(`${urlRailway}/usuarios/findUsuarios/CHAIR`);
  const chairs = await response.json();
  return chairs;
}

async function cargarChairs() {
  const chairs = await obtenerChairs();
  const chairsSelect = document.getElementById("selectChair");
  chairsSelect.innerHTML = ""; // Limpiar opciones existentes
  chairs.forEach((chair) => {
    const option = document.createElement("option");
    option.text = `Asignar CHAIR : ${chair.nombre} ${chair.apellido}`;
    option.value = chair.id_usuarios;
    chairsSelect.appendChild(option);
  });
}

cargarChairs();

const toastElementConference = document.getElementById(
  "successToastConference"
);
const toastConference = new bootstrap.Toast(toastElement);

function crearConferencia(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombreConferencia").value;
  const descripcion = document.getElementById("descripcionConferencia").value;
  const lugar = document.getElementById("lugar").value;
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const archivoImagen = document.getElementById("archivoImagen").files[0];
  const chairSeleccionado = document.getElementById("selectChair").value;

  const conferenciaData = {
    nombre: nombre,
    descripcion: descripcion,
    lugar: lugar,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  };

  const formData = new FormData();
  formData.append("file", archivoImagen);
  formData.append(
    "conferencia",
    new Blob([JSON.stringify(conferenciaData)], { type: "application/json" })
  );

  fetch(`${urlBackendConferencia}/saveConferencia/${chairSeleccionado}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar la conferencia");
      }
      $("#modalConferencia").modal("hide");
      $(".modal-backdrop").remove();
      // Mostrar la notificación de éxito
      toastConference.show();

      /* const modal = document.getElementById("modalConferencia"); // Cambia esto al ID correcto de tu modal
        if (modal) {
            modal.style.display = "none";
        }

        // Remover las clases del modal y el overlay
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
        } */

      // Reflejar los cambios automáticamente llamando a la función para obtener conferencias
      mostrarListadoConferencias(); // Asegúrate de que esta función actualice la lista de conferencias en tu página
      location.reload(); // Recarga la página para mostrar los cambios
      // Limpiar el formulario
      document.getElementById("nombreConferencia").value = "";
      document.getElementById("descripcion").value = "";
      document.getElementById("lugar").value = "";
      document.getElementById("fechaInicio").value = "";
      document.getElementById("fechaFin").value = "";
      document.getElementById("archivoImagen").value = "";
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud POST:", error);
    });
}

// Mostrar el toast de éxito
const toastElement = document.getElementById("successToastChair");
const toastChair = new bootstrap.Toast(toastElement);

function guardarChair() {
  const nombre = document.getElementById("nombreChair").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;
  const tipo_documento = document.getElementById("tipo_documento").value;
  const documento = document.getElementById("documento").value;
  const rol_id = {
    id_rol: 2,
    nombre: "CHAIR",
  };

  const chairData = {
    nombre: nombre,
    apellido: apellido,
    correo: correo,
    password: contraseña,
    tipoDocumento: tipo_documento,
    documento: documento,
    rol: rol_id,
  };

  fetch(`${urlRailway}/usuarios/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chairData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al guardar el chair");
      }
      console.log("chair guardado exitosamente");
      // Cerrar el modal u otra lógica de tu aplicación
      $("#modalChair").modal("hide");
      $(".modal-backdrop").remove();
      // Mostrar la notificación de éxito
      toastChair.show();
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud POST:", error);
    });
}

async function obtenerConferenciaActualizada(idConferencia) {
  try {
    const response = await fetch(`${urlRailway}/conferencias/${idConferencia}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener la conferencia actualizada');
    }

    const conferencia = await response.json();
    return conferencia; // Retorna la conferencia actualizada
  } catch (error) {
    console.error("Error al obtener la conferencia:", error);
    throw error; // Lanza el error para que pueda ser manejado en la función que llama a esta
  }
}


function eliminarConferencia(idConferencia) {
    const myModalEliminar = new bootstrap.Modal(
      document.getElementById("modalEliminarConferencia")
    );
    myModalEliminar.show();
    
    // Asigna un evento al botón de confirmación dentro del modal
    document.getElementById("btnConfirmarEliminar").onclick = async function () {
      try {
        // Realiza la solicitud POST al backend
        const response = await fetch(
          `${urlRailway}/conferencias/desactivar/conferencia/${idConferencia}`,
          {
            method: "POST", // Cambiado a POST
          }
        );
  
        if (response.ok) {
          // Mostrar el toast
        const toastMessage = document.getElementById("toastMessage");
        toastMessage.innerText = "Estado de la conferencia cambiado"; // Mensaje personalizado
        const toast = new bootstrap.Toast(document.getElementById("toast"));
        toast.show(); // Muestra el toast
          // Aquí puedes agregar código para actualizar la interfaz, por ejemplo, eliminar la conferencia de una lista en la UI
           // Obtener la conferencia actualizada
        /* const conferenciaActualizada = await obtenerConferenciaActualizada(idConferencia);

        // Cambiar el color del estado basado en la conferencia actualizada
        let estadoColor = "";
        switch (conferenciaActualizada.estado.toLowerCase()) {
          case "activa":
            estadoColor = "badge bg-success"; // Verde
            break;
          case "inactiva":
            estadoColor = "badge bg-danger"; // Rojo
            break;
          default:
            estadoColor = "badge bg-secondary"; // Gris por defecto
        }

        // Actualizar la UI con el nuevo estado y color
        filaConferencia.querySelector('.badge').className = estadoColor; // Cambia el color de la badge
        filaConferencia.querySelector('.badge').innerText = conferenciaActualizada.estado; // Actualiza el texto del estado */
          // Oculta el modal después de la eliminación
          myModalEliminar.hide();
          mostrarListadoConferencias();
        } else {
          const mensaje = await response.text();
          alert(mensaje); // Muestra un mensaje de error
        }
      } catch (error) {
        console.error("Error al eliminar la conferencia:", error);
        alert("Ha ocurrido un error al cambiar el estado de la conferencia ");
      }
    };
  }


  
  

async function cargarChairsEdit() {
  const chairs = await obtenerChairs();
  const chairsSelect = document.getElementById("selectChairEdit");
  chairsSelect.innerHTML = ""; // Limpiar opciones existentes
  chairs.forEach((chair) => {
    const option = document.createElement("option");
    option.text = `Asignar CHAIR : ${chair.nombre} ${chair.apellido}`;
    option.value = chair.id_usuarios;
    chairsSelect.appendChild(option);
  });
  const newOption = document.createElement("option");
  newOption.text = "Sin Chair";
  newOption.value = "Sin Chair";
  chairsSelect.appendChild(newOption);
}

function editarConferencia(idConferencia) {
  const myModalEditar = new bootstrap.Modal(
    document.getElementById("modalConferenciaEditar")
  );
  myModalEditar.show();
  cargarChairsEdit();
  // Obtener los datos de la conferencia desde el servidor
  fetch(`${urlRailway}/conferencias/${idConferencia}`)
    .then((response) => response.json())
    .then((data) => {
      // Cargar los datos en los campos del formulario
      document.getElementById("nombreConferenciaEdit").value = data.nombre;
      document.getElementById("descripcionEdit").value = data.descripcion;
      document.getElementById("lugarEdit").value = data.lugar;
      document.getElementById("fechaInicioEdit").value = data.fecha_inicio;
      document.getElementById("fechaFinEdit").value = data.fecha_fin;
      document.getElementById("idConferenciaEdit").value = data.id_conferencia;
      // Si tienes opciones para el select, cargarlas aquí
      const selectChairEdit = document.getElementById("selectChairEdit");
      // Aquí deberías cargar las opciones del select, y luego seleccionar la opción actual
      selectChairEdit.value = data.chair.id_usuarios; // Esto es solo un ejemplo, ajusta según tu estructura de datos
    })
    .catch((error) =>
      console.error("Error al cargar los datos de la conferencia:", error)
    );
}

function enviarEdicionConferencia(event) {
  
  event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

  const idConferencia = document.getElementById("idConferenciaEdit").value;
  console.log(idConferencia);
  const nombre = document.getElementById("nombreConferenciaEdit").value;
  const descripcion = document.getElementById("descripcionEdit").value;
  const lugar = document.getElementById("lugarEdit").value;
  const fechaInicio = document.getElementById("fechaInicioEdit").value;
  const fechaFin = document.getElementById("fechaFinEdit").value;
  const archivoImagen = document.getElementById("archivoImagenEdit").files[0];
  const chairId = document.getElementById("selectChairEdit").value;

  const conferenciaDataEdit = {
    nombre: nombre,
    descripcion: descripcion,
    lugar: lugar,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    // Si estás manejando archivos:
    //archivoImagen : formData.get('archivoImagen') // Este es un archivo, así que necesitas un manejo especial en backend.
  };

  const formData = new FormData();
  formData.append("file", archivoImagen);
  formData.append(
    "conferencia",
    new Blob([JSON.stringify(conferenciaDataEdit)], {
      type: "application/json",
    })
  );

  fetch(`${urlRailway}/conferencias/editar/${idConferencia}/chair/${chairId}`, {
    method: "PUT", // O 'POST', dependiendo de cómo esté configurado tu backend
    headers: {
      "type": "application/json",
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        // Manejar éxito, por ejemplo, cerrar el modal y recargar la lista de conferencias
        alert("Conferencia actualizada exitosamente");
        // Cerrar el modal después de la actualización exitosa
        const myModalEditar = bootstrap.Modal.getInstance(
          document.getElementById("modalConferenciaEditar")
        );
        myModalEditar.hide();
        mostrarListadoConferencias();
      } else {
        throw new Error("Error al actualizar la conferencia");
      }
    })
    .catch((error) => console.error("Error:", error));
}



