async function findArticulosAprobados() {
    const result = await fetch(`${urlBackendConferencia}/evaluacion`, {
        method: 'GET'
    });
    return result;
}




async function buscarArticulosEstado(estado = '') {
    let usuario = JSON.parse(localStorage.getItem('Data'));
    let idAutor = usuario.id_usuarios;
    const url = estado ? `${urlBackendConferencia}/articulos/estado/${estado}` : `${urlBackendConferencia}/articulos/autor/${idAutor}`;
    const result = await fetch(url, { method: 'GET' });
    return result.json();
}

function mostrarArticulos(articulos) {
    const tablaArticulos = document.getElementById('tabla-articulos-autor');
    tablaArticulos.innerHTML = ''; // Limpiar el contenido anterior
    articulos.forEach(articulo => {
        const row = tablaArticulos.insertRow();
        const cellId = row.insertCell(0);
        const cellNombre = row.insertCell(1);
        const cellEstado = row.insertCell(2);
        const cellConferencia = row.insertCell(3);
        const cellVerArticulo = row.insertCell(4);
        const cellVerAutor = row.insertCell(5);
        const cellEvaluacion = row.insertCell(6);

        cellId.textContent = articulo.id_articulo;
        cellNombre.textContent = articulo.nombre;
        //cellEstado.textContent = articulo.estado;
        cellConferencia.textContent = articulo.conferencia.nombre;
       cellVerAutor.textContent = articulo.autor.nombre + " " + articulo.autor.apellido;

        // Crear el span para el estado
        let estadoColor = "";
        switch (articulo.estado.toLowerCase()) {
            case "correcciones":
                estadoColor = "badge bg-warning"; // Naranja
                break;
            case "aprobado":
                estadoColor = "badge bg-success"; // Verde
                break;
            case "enviado":
                estadoColor = "badge bg-info"; // Azul
                break;
            case "rechazado":
                estadoColor = "badge bg-danger"; // Rojo
                break;
            default:
                estadoColor = "badge bg-secondary"; // Gris por defecto
        }

        // Crear el span con la clase de estado y añadirlo a la celda de estado
        const spanEstado = document.createElement('span');
        spanEstado.className = estadoColor;
        spanEstado.textContent = articulo.estado;
        cellEstado.appendChild(spanEstado);

       
        // Crear el enlace "Ver Artículo"
        const enlace = document.createElement('a');
        enlace.textContent = 'Ver Artículo';
        enlace.href = articulo.url;
        enlace.target = '_blank'; // Para abrir en una nueva pestaña
        cellVerArticulo.appendChild(enlace);
        const span = document.createElement('span');
        span.classList.add('my-2', 'mb-0', 'text-secondary', 'text-xs');
        span.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i>';
        span.onclick = function() {
            asignarEvaluacion(articulo.id_articulo); // Llamar a la función de edición pasando el id del artículo
        };
    
        // Añadir el <span> a la celda de la fila
        cellEvaluacion.appendChild(span);

    });
}


async function cargarTodosLosArticulos() {
    try {
        const data = await buscarArticulosEstado();
        mostrarArticulos(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function buscarArticulosPorEstado() {
    const estadoSeleccionado = document.getElementById('estado').value;
    try {
        const data = await buscarArticulosEstado(estadoSeleccionado);
        mostrarArticulos(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar todos los artículos al abrir la página
document.addEventListener('DOMContentLoaded', cargarTodosLosArticulos);





function mostrarArticulosAprobados() {
    findArticulosAprobados()
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let body = "";
            // Dado que el JSON ya devuelve los artículos aprobados
            const articulosAprobados = Array.isArray(data) ? data : [data];

            for (const articulo of articulosAprobados) {
                body += `<tr>
                    <td>
                        <h6 class="mb-0 text-sm">${articulo.id}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${new Date(articulo.fechaHora).toLocaleString()}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.evaluador.nombre} ${articulo.evaluador.apellido}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.estado}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.articulo.nombre}</p>
                    </td>
                    <td>
                        <a href="${articulo.articulo.url}" target="_blank">Ver Artículo</a>
                    </td>
                    <td>
                    <span class="my-2 mb-0 text-secondary text-xs" onclick="asignarEvaluacion(${articulo.id_articulo})">
                            <i class="fa-solid fa-eye" style="color:blue; font-size:1rem;"></i>
                        </span>
                    </td>
                </tr>`;
            }
            document.getElementById("tablaArticulosAprobados").innerHTML = body;

            // Mostrar la sección de artículos aprobados
            document.getElementById("section-articulos-lista").style.display = 'block';
        })
        .catch(e => {
            console.log(e);
        });
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarArticulosAprobados();
});



async function findInscripciones(){
    let usuario = JSON.parse(localStorage.getItem('Data'));

    let idUsuario = usuario.id_usuarios;

const response = await fetch(`${urlBackendConferencia}/inscripciones/usuario/${idUsuario}`);
const inscripciones = await response.json();
return inscripciones;
}

async function cargarConferenciasUsuario(){
    const inscripciones = await findInscripciones();
    const conferenciasSelect = document.getElementById('selectConferenciaUsuario');
    conferenciasSelect.innerHTML = ''; // Limpiar opciones existentes
    inscripciones.forEach(inscripcion => {
        const option = document.createElement('option');
        option.value = inscripcion.conferencia.id_conferencia;
        option.textContent = ` ${inscripcion.conferencia.nombre}`;
        conferenciasSelect.appendChild(option);
    }); 
}

cargarConferenciasUsuario();

function subirArticulo(event) {
    event.preventDefault();

    const titulo = document.getElementById("nombre").value;
    const resumen = document.getElementById("resumen").value;
    const palabrasclave = document.getElementById("palabrasClave").value;
    const archivo = document.getElementById("archivo").files[0];

    const articuloData = {
        nombre : titulo,
        resumen : resumen,
        palabrasClave : palabrasclave
    }
    



    const formData = new FormData();
    formData.append("file", archivo);
    formData.append(
        "articulo",
        new Blob([JSON.stringify(articuloData)], { type: "application/json" })
      );
    
    

    const idConferencia= document.getElementById("selectConferenciaUsuario").value; // Aquí debes obtener el id de la conferencia correctamente
    let usuario = JSON.parse(localStorage.getItem('Data'));

    let idAutor = usuario.id_usuarios;; // Aquí debes obtener el id del autor correctamente

    fetch(`${urlBackendConferencia}/articulos/save/${idConferencia}/autor/${idAutor}`, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al guardar el artículo");
            }
            alert("Artículo guardado exitosamente");
            // Limpiar formulario
            document.getElementById("uploadForm").reset();
        })
        .catch((error) => {
            console.error("Error al subir el artículo:", error);
        });
}



// Obtener los datos del usuario desde localStorage
let usuario = JSON.parse(localStorage.getItem('Data'));

// Verificar si el usuario existe en localStorage antes de intentar acceder a sus propiedades
if (usuario) {
    document.getElementById('nombreUsuarioEmp').textContent = usuario.nombre || "N/A";
    document.getElementById('correoEmp').textContent = usuario.correo || "N/A";
    document.getElementById('rolUsuarioEmp').textContent = usuario.rol.nombre || "N/A";
    document.getElementById('apellidoEmp').textContent = usuario.apellido || "N/A";
    document.getElementById('cedulaEmp').textContent = usuario.documento || "N/A";
} else {
    console.error("No se encontraron datos de usuario en localStorage.");
}


