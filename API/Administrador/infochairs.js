const urlBackendeva = "http://localhost:8080/usuarios";


let usuarios = [];

async function buscarUsuariosporRol(rol = '') {
    const url = rol === "TODOS" || !rol ?  urlBackendeva : `http://localhost:8080/usuarios/findUsuarios/${rol}`;
    const result = await fetch(url, { method: 'GET' });
    return result.json();
}

async function findListUsuarios() {
    const result = await fetch(urlBackendeva, {
        method: 'GET'
    });
    return result.json;
}

async function cargarUsuarios() {
    try {
        usuarios = await findListUsuarios(); // Llama a la función para obtener todos los usuarios
        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function buscarUsuarios() {
    const rolSeleccionado = document.getElementById('rol').value;
    try {
        const data = await buscarUsuariosporRol(rolSeleccionado);
        mostrarUsuarios(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarUsuarios(usuarios) {
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    tablaUsuarios.innerHTML = ''; // Limpiar el contenido anterior
    usuarios.forEach(usuario => {
        const row = `
            <tr>
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
                    <p class="text-xs text-secondary mb-0">${usuario.nombre} ${usuario.apellido}</p>
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
        tablaUsuarios.innerHTML += row;
    });
}





function filtrarPersonas() {
    const nombreBusqueda = document.getElementById('nombre').value.toLowerCase();
    const personasFiltradas = usuarios.filter(usuario => usuario.nombre.toLowerCase().includes(nombreBusqueda));
     cargarUsuarios(personasFiltradas);
}




// Llama a la función al cargar la página

function mostrarInformacion() {
    document.getElementById("section-usuarios").style.display = 'none';
    document.getElementById("section-info").style.display = 'block';
}

// Mostrar la información del usuario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarInformacion();
    cargarUsuarios();
});

// Agrega un evento de entrada al campo de búsqueda para filtrar en tiempo real
document.getElementById('nombre').addEventListener('input', filtrarPersonas);



