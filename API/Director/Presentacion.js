// Función para obtener artículos desde la API
async function obtenerArticulosPresentacion() {
    const response = await fetch('https://unique-courage-production.up.railway.app/articulos');
    const articulos = await response.json();
    return articulos;
}

// Función para cargar los artículos en el dropdown
async function cargarArticulosPresentacion() {
    const articulos = await obtenerArticulosPresentacion();
    const articulosSelect = document.getElementById('articulosPresentacion');
    articulosSelect.innerHTML = ''; // Limpiar opciones existentes
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.value = articulo.id_articulo;
        option.textContent = `ID: ${articulo.id_articulo} - Nombre : ${articulo.nombre}`;
        articulosSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarArticulosPresentacion();
});

function guardarPresentacion() {
    const titulo = document.getElementById("titulo").value;
    const articuloSeleccionado = document.getElementById("articulosPresentacion").value;
    const resumen = document.getElementById("resumen").value;
    const palabrasClave = document.getElementById("palabras-clave").value;
    const fecha = document.getElementById("fecha").value;
    const horaInicio = document.getElementById("hora-inicio").value;
    const horaFin = document.getElementById("hora-fin").value;

   

    const presentacionData = {
        titulo: titulo,
        resumen: resumen,
        palabras_clave: palabrasClave,
        fecha_presentacion: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin
    };

    fetch(`https://unique-courage-production.up.railway.app/presentaciones/guardar/${articuloSeleccionado}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(presentacionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar la presentación');
        }
        console.log('Presentación guardada exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalPresentacion').modal('hide');
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}





async function cargarPresentaciones() {
    try {
        const response = await fetch('https://unique-courage-production.up.railway.app/presentaciones');
        const presentaciones = await response.json();
        
        const tablaPresentaciones = document.getElementById('tablaPresentaciones');
        tablaPresentaciones.innerHTML = ''; // Limpiar tabla actual
        
        presentaciones.forEach(presentacion => {
            const row = document.createElement('tr');
            
            // Columnas de la tabla
            row.innerHTML = `
                <td>${presentacion.id_presentacion}</td>
                <td>${presentacion.titulo}</td>
                <td>${presentacion.palabras_clave}</td>
                <td>${presentacion.fecha_presentacion}</td>
                <td><a href="${presentacion.articulo.url}" target="_blank">Ver Articulo</a></td>
                <td>${presentacion.horaInicio}</td>
                <td>${presentacion.horaFin}</td>
                <td>${presentacion.articulo.conferencia.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verDetalles(${presentacion.id_presentacion})">Ver detalles</button>
                </td>
            `;
            
            tablaPresentaciones.appendChild(row);
        });
        
        // Mostrar la sección de presentaciones después de cargar los datos
        document.getElementById('section-presentaciones').style.display = 'none';
        
    } catch (error) {
        console.error('Error al cargar las presentaciones:', error);
        alert('Error al cargar las presentaciones. Inténtalo de nuevo más tarde.');
    }
}

function verDetalles(idPresentacion) {
    // Aquí puedes implementar la lógica para mostrar los detalles de una presentación específica
    console.log('Ver detalles de la presentación con ID:', idPresentacion);
    // Puedes abrir un modal, cargar más datos, etc.
}

function mostrarInformacion() {
    document.getElementById("section-presentaciones").style.display = 'none';
    document.getElementById("section-info").style.display = 'block';
}

// Mostrar la información del usuario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarInformacion();
    cargarPresentaciones();
});
console.log(body)
