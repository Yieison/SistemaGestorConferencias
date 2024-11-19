async function obtenerConferenciasPrecios() {
    const response = await fetch(`${urlRailway}/conferencias/estado/ACTIVA`);
    const conferencias = await response.json();
    return conferencias;    
}

// Función para cargar los artículos en el dropdown
async function cargarConferencias() {
    const conferencias = await obtenerConferencias();
    const conferenciasSelect = document.getElementById('conferenciaPrecios');
    conferenciasSelect.innerHTML = ''; // Limpiar opciones existentes
    conferencias.forEach(conferencia => {
        const option = document.createElement('option');
        option.value = conferencia.id_conferencia;
        option.textContent = ` ${conferencia.nombre}`;
        conferenciasSelect.appendChild(option);
    });
}

cargarConferencias();


 async function guardarPrecios(event){

    event.preventDefault();

    const form = document.getElementById("formAgregarPrecio");


        // Obtén los datos del formulario
        const conferenciaId = document.getElementById("conferenciaPrecios").value;
        const monto = document.getElementById("monto").value;
        const tipoUsuario = document.getElementById("tipoUsuario").value;
      
        // Construye el objeto a enviar
        const precioData = {
            monto: parseFloat(monto),
            tipoUsuario: tipoUsuario
        };

        try {
            // Realiza la solicitud POST al backend
            const response = await fetch(`${urlRailway}/precios/agregarPrecio/${conferenciaId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(precioData),
            });

            if (response.ok) {
                alert("Precio agregado con éxito.");
                // const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgregarPrecio'));
                // modal.hide(); // Cierra el modal
                $('#modalAgregarPrecio').modal('hide');
                $(".modal-backdrop").remove();
                form.reset();
                listarPrecios();
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al agregar el precio.");
        }


    }



    async function listarPrecios() {
        try {
            // URL de tu API (modifica según corresponda)
            const response = await fetch(`${urlRailway}/precios`);
            if (!response.ok) {
                throw new Error("Error al obtener los precios");
            }
    
            const precios = await response.json();
    
            // Referencia al cuerpo de la tabla
            const tablaBody = document.getElementById("tablaPrecios")
            tablaBody.innerHTML = ""; // Limpia la tabla antes de agregar datos
    
            // Itera sobre los precios y crea filas dinámicamente
            precios.forEach((precio) => {
                const fila = `
                    <tr>
                        <td>${precio.id}</td>
                        <td>${precio.conferencia.nombre}</td>
                        <td>${precio.monto}</td>
                        <td>${precio.tipoUsuario}</td>

                        <td>
                       <button class="btn btn-sm btn-warning text-white px-2 my-2 mb-0 text-xs" data-bs-toggle="modal" data-id="${precio.id}"
                        onclick="guardarIdComite(this)" data-bs-target="#modalEditarSala">
                    <i class="fa-solid fa-pen-to-square" style="font-size: 0.9rem;"></i> 
                        </button>

                    <button class="btn btn-sm btn-danger text-white px-2 my-2 mb-0 text-xs" data-bs-toggle="modal" data-bs-target="#modalEliminarSala" onclick="eliminarSala(${precio.id})">
                        <i class="fa-solid fa-trash" style="font-size: 0.9rem;"></i> 
                    </button>
                    </td>
                    </tr>
                `;
                tablaBody.innerHTML += fila;
            });
        } catch (error) {
            console.error("Error al listar precios:", error);
            alert("Hubo un problema al cargar los precios.");
        }
    }
    
    // Llama a la función al cargar la página
    document.addEventListener("DOMContentLoaded", listarPrecios);
    
    