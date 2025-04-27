
const urlBackendeva = "https://backendsistemagestorconferencia-production.up.railway.app";

async function findListEvaluadores() {
    const result = await fetch(urlBackendeva + "/findUsuarios/EVALUADOR", {
        method: 'GET'
    });
    return result;
}

function mostrarListadoEvaluadores() {
    findListEvaluadores()
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let body = "";
            for (const usuario of data) {
                body += `<tr>
                    <td>
                        <h6 class="mb-0 text-sm">${usuario.id_usuarios}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${usuario.tipoDocumento}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${usuario.documento}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${usuario.nombre}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${usuario.correo}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="mb-0 text-secondary text-xs">${usuario.rol.nombre}</span>
                    </td>
                    <td class="align-middle text-center text-sm">
                        <span class="my-2 mb-0 text-secondary text-xs">
                            <i class="fa-solid fa-pen-to-square" style="color: orange; font-size: 1rem;"></i>
                        </span>
                        <span class="my-2 mb-0 text-secondary text-xs">
                            <i class="fa-solid fa-trash" style="color: red; font-size: 1rem;"></i>
                         </span>
                    </td>
                </tr>`;
            }
            document.getElementById("tablaEvaluadores").innerHTML = body;

            // Mostrar la sección de evaluadores
            document.getElementById("section-evaluador").style.display = 'none';
        })
        .catch(e => {
            console.log(e);
        });
}

// Llama a la función al cargar la página

function mostrarInformacion() {
    document.getElementById("section-evaluador").style.display = 'none';
    document.getElementById("section-info").style.display = 'block';
}

// Mostrar la información del usuario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarInformacion();
    mostrarListadoEvaluadores();
});
console.log(body)



function guardarEvaluador() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;
    const tipo_documento = document.getElementById("tipo_documento").value;
    const documento = document.getElementById("documento").value;
    const rol_id = {
        id_rol: 5,
        nombre: "EVALUADOR"
    };
    

    const evaluadorData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: contraseña,
        tipoDocumento: tipo_documento,
        documento : documento,
        rol : rol_id
    };

    fetch(`${urlBackendeva}/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(evaluadorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el evaluador');
        }
        console.log('Evaluador guardado exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        $('#modalPresentacion').modal('hide');
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
}




