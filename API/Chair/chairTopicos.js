var userDataString = localStorage.getItem('Data');
var userData = userDataString ? JSON.parse(userDataString) : null;



async function cargarConferencias() {
    var idChair = userData.id_usuarios;
    try {
        const response = await fetch(`${urlRailway}/conferencias/lista/${idChair}`);
        const conferencias = await response.json();
        console.log(conferencias)
        const selectConferencia = document.getElementById("conferencia");

        conferencias.forEach(conferencia => {
            const option = document.createElement("option");
            option.value = conferencia.id_conferencia;
            option.text = conferencia.nombre;
            selectConferencia.add(option);
        });
    } catch (error) {
        console.error("Error al cargar conferencias:", error);
    }
}

// Llamada a cargarConferencias al cargar la página
window.onload = cargarConferencias;

// Función para enviar el formulario
async function agregarTopico(event) {
    event.preventDefault();

    const tema = document.getElementById("tema").value;
    const idConferencia = document.getElementById("conferencia").value;

    const topico = {
        tema: tema
    };

    try {
        const response = await fetch(`${urlRailway}/topicos/save/${idConferencia}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(topico)
        });

        if (response.ok) {
            alert("Tópico agregado exitosamente.");
            document.getElementById("topicoForm").reset();
            $('#topicoModal').modal('hide'); // Cerrar el modal después de agregar el tópico
            $(".modal-backdrop").remove();
            getTopicos();
        } else {
            alert("Error al agregar el tópico.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}




async function getTopicos() {
    try {
        const response = await fetch(`${urlRailway}/topicos`, {
            method: 'GET'
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error fetching topicos');
        }

        const topicos = await response.json();

        // Verificar si 'topicos' es un array antes de proceder
        if (Array.isArray(topicos)) {
            // Limpiar la tabla existente
            const tablaDocumento = document.getElementById('tabla-topicos');
            tablaDocumento.innerHTML = '';

            // Rellenar la tabla con los nuevos datos
            topicos.forEach(topico => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${topico.id_topico}</td>
                    <td>${topico.tema}</td>
                    <td><i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i></td>
                    <td><i class="fa-solid fa-trash" style="color: red; font-size: 1rem;"></i></td>
                `;
                tablaDocumento.appendChild(row);
            });
        } else {
            console.error('La respuesta no contiene un array de tópicos');
            alert('No se encontraron tópicos. Verifica la respuesta de la API.');
        }
    } catch (error) {
        console.error('Error fetching topicos:', error);
        alert('Error al cargar los tópicos. Por favor, inténtalo de nuevo.');
    }
}


getTopicos();


