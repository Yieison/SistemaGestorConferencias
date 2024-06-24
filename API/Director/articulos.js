/**
const urlBackendarticulos = "http://localhost:8080";

// Función para obtener la lista de evaluaciones aprobadas
async function findEvaluacionesAprobadas() {
    try {
        const result = await fetch(urlBackendarticulos + "/evaluacion", {
            method: 'GET'
        });
        return result.json(); // Devolver el resultado como JSON
    } catch (error) {
        console.error('Error al obtener la lista de evaluaciones aprobadas:', error);
        throw error;
    }
}

// Función para obtener la información de un artículo por su ID
async function findArticuloById(articuloId) {
    try {
        const result = await fetch(urlBackendarticulos + `/articulos/${articuloId}`, {
            method: 'GET'
        });
        return result.json();
    } catch (error) {
        console.error(`Error al obtener el artículo con ID ${articuloId}:`, error);
        throw error;
    }
}

// Función para obtener la información de un evaluador por su ID
async function findEvaluadorById(evaluadorId) {
    try {
        const result = await fetch(urlBackendarticulos + `/usuarios/evaluadores/${evaluadorId}`, {
            method: 'GET'
        });
        return result.json();
    } catch (error) {
        console.error(`Error al obtener el evaluador con ID ${evaluadorId}:`, error);
        throw error;
    }
}

// Función para mostrar la lista de evaluaciones aprobadas en la tabla
async function mostrarListadoEvaluacionesAprobadas() {
    try {
        const evaluaciones = await findEvaluacionesAprobadas();
        let body = "";
        for (const evaluacion of evaluaciones) {
            const articulo = await findArticuloById(evaluacion.articulo.id_articulo);
            const evaluador = await findEvaluadorById(evaluacion.evaluador.id_usuarios);
            body += `<tr>
                <td>${evaluacion.id}</td>
                <td>${articulo.titulo}</td>
                <td>${evaluador.nombre}</td>
            </tr>`;
        }
        document.getElementById("tablaEvaluacionesAprobadas").innerHTML = body;
    } catch (error) {
        console.error('Error al mostrar la lista de evaluaciones aprobadas:', error);
    }
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', mostrarListadoEvaluacionesAprobadas);
*/



const urlBackendaprobados = "https://unique-courage-production.up.railway.app/evaluacion";

async function findArticulosAprobados() {
    const result = await fetch(urlBackendaprobados, {
        method: 'GET'
    });
    return result;
}

async function buscarArticulosEstado(estado = '') {
    const url = estado ? `https://unique-courage-production.up.railway.app/articulos/estado/${estado}` : 'https://unique-courage-production.up.railway.app/articulos';
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

console.log(body)