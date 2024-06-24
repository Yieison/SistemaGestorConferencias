const urlBackendAut = "https://unique-courage-production.up.railway.app/usuarios";

async function findListAutores() {
    const result = await fetch(urlBackendAut + "/findUsuarios/AUTOR", {
        method: 'GET'
    });
    return result;
}

function mostrarListadoAutores() {
    findListAutores()
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
            document.getElementById("tablaAutores").innerHTML = body;

            // Mostrar la sección de evaluadores
            document.getElementById("section-autores").style.display = 'none';
        })
        .catch(e => {
            console.log(e);
        });
}

// Llama a la función al cargar la página

function mostrarInformacion() {
    document.getElementById("section-autores").style.display = 'none';
    document.getElementById("section-info").style.display = 'block';
}

// Mostrar la información del usuario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarInformacion();
    mostrarListadoAutores();
});
console.log(body)