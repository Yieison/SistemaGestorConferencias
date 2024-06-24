

async function obtenerArticulos() {
    const response = await fetch('https://unique-courage-production.up.railway.app/articulos');
    const articulos = await response.json();
    return articulos;
}

// Obtener lista de evaluadores
async function obtenerEvaluadores() {
    const response = await fetch('https://unique-courage-production.up.railway.app/usuarios/findUsuarios/EVALUADOR');
    const evaluadores = await response.json();
    return evaluadores;
}

// Función para cargar los artículos en el dropdown
async function cargarArticulos() {
    const articulos = await obtenerArticulos();
    const articulosSelect = document.getElementById('articulo');
    articulosSelect.innerHTML = ''; // Limpiar opciones existentes
    articulos.forEach(articulo => {
        const option = document.createElement('option');
        option.text = `ID: ${articulo.id_articulo} - ARTICULO: ${articulo.nombre} `;
        option.value = articulo.id_articulo;
        articulosSelect.appendChild(option);
    });
}

// Función para cargar los evaluadores en el dropdown
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

async function cargarDropdowns() {
    await cargarArticulos();
    await cargarEvaluadores();
}


// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDropdowns();
});



async function guardarEvaluacion(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
    
    const articuloSeleccionado = document.getElementById('articulo').value;
    const evaluadorSeleccionado = document.getElementById('evaluador').value;
    const fechaSeleccionada = document.getElementById('fecha').value;
    const horaSeleccionada = document.getElementById('hora').value;

    // Combinar la fecha y la hora seleccionadas en un formato completo
    const fechaHora = `${fechaSeleccionada} ${horaSeleccionada}:00`;
    const estado = 'PENDIENTE'; // Estado por defecto

    console.log('Artículo seleccionado:', articuloSeleccionado);
console.log('Evaluador seleccionado:', evaluadorSeleccionado);


    const evaluacion = {
        articulo_id_articulo: articuloSeleccionado,
        evaluador_id: evaluadorSeleccionado,
        fechaHora: fechaHora,
        estado: estado
    };

    try {
        const response = await fetch(`https://unique-courage-production.up.railway.app/evaluacion/asignar/${evaluadorSeleccionado}/evaluacion/${articuloSeleccionado}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evaluacion)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status);
        }

        const data = await response.json();
        console.log('Evaluación guardada:', data);
        alert('Evaluación guardada exitosamente.');
    } catch (error) {
        console.error('Error al guardar la evaluación:', error);
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    }
}


/** 
// Realiza la solicitud GET para obtener el JSON de las empresas
fetch('https://localhost:8080/evaluadores')
  .then(response => response.json())
  .then(data => {
    // Filtra y extrae solo el "id" y el nombre del usuario de cada empresa
    const evaluador = data.map(evaluador => ({
      id: evaluador.id_usuarios,
      nombre: evaluador.nombre
    }));

    // Llena la lista desplegable con las opciones obtenidas
    const selectEvaluador = document.getElementById('evaluador');
    evaluadores.forEach(evaluador => {
      const option = document.createElement('option');
      option.value = evaluador.id_usuarios;
      option.text = `${evaluador.nombre} ${evaluador.apellido} `;
      selectEvaluador.appendChild(option);
    });
  })
  .catch(error => console.error('Error al obtener los evaluadores:', error));

  fetch('https://localhost:8080/articulos')
    .then(response => response.json())
    .then(data => {
        // Insertar los nombres en el select
        const selectArticulo = document.getElementById('articulo');
        data.forEach(articulo => {
            const option = document.createElement('option');
            option.text =  `ID: ${articulo.id_articulo} - URL: ${articulo.url} `
            option.value = articulo.id_articulo;
            selectArticulo.appendChild(option);
        });
    })
    .catch(error => console.error('Error al obtener la lista de articulos:', error));
*/

/** 
function guardarEvaluacion() {
    console.log('Guardando Proyecto...');


    var formData = new FormData(document.getElementById('form-evaluacion'));

    fetch('http://localhost:8080/evaluacion/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
    })
    .then(response => {
        console.log('Respuesta del backend:', response);
        if (!response.ok) {
            throw new Error('Error al Proyecto el empresa');
        }
        return response.json();
    })
   
}

/** 
function guardarEvaluacion(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    const articuloId = document.getElementById("articulo").value;
    const evaluadorId = document.getElementById("evaluador").value;
    const fechaHora = document.getElementById("fechaHora").value;
    const estado = document.getElementById("estado").value;

    const evaluacionData = {
        articulo: {
            id: articuloId
        },
        evaluador: {
            id: evaluadorId
        },
        fechaHora: fechaHora,
        estado: estado
    };

    fetch('http://localhost:8080/evaluacion/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(evaluacionData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error al guardar la evaluación:', errorData);
                throw new Error('Error al guardar la evaluación');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Evaluación guardada exitosamente', data);
        // Lógica adicional, por ejemplo, cerrar el modal o actualizar la interfaz
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
}
*/

