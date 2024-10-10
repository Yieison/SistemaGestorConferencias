

async function buscarArticulosEstado(estado = '') {
    const url = estado ? `http://localhost:8080/articulos/estado/${estado}` : 'http://localhost:8080/articulos';
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
        span.setAttribute('data-bs-toggle', 'modal');
        span.setAttribute('data-bs-target', '#modalAsignarEvaluador'); // ID del modal correcto
        span.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i>';
        span.onclick = function() {
            asignarEvaluacion(); // Llamar a la función de edición pasando el id de la conferencia
        };
    
        // Añadir el <span> a la celda de la fila
        cellEvaluacion.appendChild(span);

    });
}

function asignarEvaluacion () {
    
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






