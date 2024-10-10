const url = "http://localhost:8080/evaluacion";
const urlBackendEvaluadoresArticulos = "http://localhost:8080";



async function findArticulosAprobados() {
    const result = await fetch(`${urlRailway}/evaluacion`, {
        method: 'GET'
    });
    return result;
}

async function buscarArticulosEstado(estado = '') {
    const url = estado ? `${urlRailway}/articulos/estado/${estado}` : `${urlRailway}/articulos`;
    const result = await fetch(url, { method: 'GET' });
    return result.json();
}

function mostrarArticulos(articulos) {
    const tablaArticulos = document.getElementById('tabla-articulos');
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
        cellEstado.textContent = articulo.estado;
        cellConferencia.textContent = articulo.conferencia.nombre;
       cellVerAutor.textContent = articulo.autor.nombre + " " + articulo.autor.apellido;
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

let idArticuloGlobal;

function asignarEvaluacion (idArticulo) {
    var modalAsignarEvaluador = new bootstrap.Modal(document.getElementById('modalAsignarEvaluador'));
    modalAsignarEvaluador.show();

    idArticuloGlobal = idArticulo; 

    cargarEvaluadores();

   async function obtenerEvaluadores() {
    const response = await fetch(`${urlRailway}/usuarios/findUsuarios/EVALUADOR`);
    const evaluadores = await response.json();
    return evaluadores;
    } 

    async function cargarEvaluadores() {
        const evaluadores = await obtenerEvaluadores();
        const evaluadoresSelect = document.getElementById('evaluador');
        evaluadoresSelect.innerHTML = ''; // Limpiar opciones existentes
        evaluadores.forEach(evaluador => {
            const option = document.createElement('option');
            option.text = `${evaluador.nombre} ${evaluador.apellido} `;
            option.value = evaluador.id_usuarios;
            evaluadoresSelect.appendChild(option);
        });
    }
}


async function guardarEvaluacion(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
    
    const articuloSeleccionado = idArticuloGlobal;
    console.log(articuloSeleccionado)
    const evaluadorSeleccionado = document.getElementById('evaluador').value;
    console.log(evaluadorSeleccionado)
    const fechaSeleccionada = document.getElementById('fecha').value;
    const horaSeleccionada = document.getElementById('hora').value;

    // Combinar la fecha y la hora seleccionadas en un formato completo
    const fechaHora = `${fechaSeleccionada} ${horaSeleccionada}:00`;
    const estado = 'PENDIENTE'; // Estado por defecto

    
    const evaluacion = {
        fechaHora: fechaHora,
        estado: estado
    };

    try {
        await fetch(`${urlRailway}/evaluacion/asignar/${evaluadorSeleccionado}/evaluacion/${articuloSeleccionado}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evaluacion)
        });

        var modalAsignarEvaluador = new bootstrap.Modal(document.getElementById('modalAsignarEvaluador'));
        modalAsignarEvaluador.hide(); 
        alert("Evaluacion guardada exitosamente")       
   
    } catch (error) {
        console.error('Error al guardar la evaluación:', error);
    }
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
            document.getElementById("section-articulos-aprobado").style.display = 'block';
        })
        .catch(e => {
            console.log(e);
        });
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarArticulosAprobados();
});