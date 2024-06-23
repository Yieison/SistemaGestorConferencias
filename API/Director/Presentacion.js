// Función para obtener artículos desde la API
async function obtenerArticulosPresentacion() {
    const response = await fetch('http://localhost:8080/articulos');
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

    if (!titulo || !resumen || !palabrasClave || !fecha || !horaInicio || !horaFin) {
        alert('Todos los campos son requeridos. Por favor, completa todos los campos.');
        return; // Detener la función si falta algún dato requerido
    }

    const presentacionData = {
        titulo: titulo,
        resumen: resumen,
        palabras_clave: palabrasClave,
        fecha_presentacion: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin
    };

    fetch(`http://localhost:8080/presentaciones/guardar/${articuloSeleccionado}`, {
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
