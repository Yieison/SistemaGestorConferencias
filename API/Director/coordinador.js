/**

var urlBackend = "https://practicasapi-production.up.railway.app/";
cargarInformacion()

async function getTutorId(id) {
    const result = await fetch(urlBackend + "coordinador/" + id, {
        method: 'GET'
    })
    return result;
}

function cargarInformacion() {



    const usuario = JSON.parse(localStorage.getItem("Data"))
    document.getElementById("nombreUsuarioCor").innerHTML = usuario.nombre
    document.getElementById("correoUsuarioCor").innerHTML = usuario.correo
    if (usuario.rolId === 6) {

        document.getElementById("rolUsuarioCor").innerHTML = "Coordinador"

        getTutorId(usuario.id)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                localStorage.setItem("coordinador", JSON.stringify(data))
                document.getElementById("codigoUsuarioCor").innerHTML = data.codigo
                document.getElementById("cedulaUsuarioCor").innerHTML = data.cedula

            })
            .catch(err => {
                console.log(err)
            })


    }
}








$(document).ready(function () {
    // Variable para almacenar el estado actual de la edición
    var enEdicion = false;

    // Manejar el clic en el ícono de editar
    $('.fas.fa-user-edit').click(function () {
        if (!enEdicion) {
            // Si no está en modo de edición, cambiar a modo de edición
            habilitarEdicion();
        } else {
            // Si ya está en modo de edición, revertir los cambios
            revertirCambios();
        }
    });

    // Función para cambiar a modo de edición
    function habilitarEdicion() {
        // Obtener los elementos span que contienen los datos
        var nombreSpan = $('#nombreUsuarioCor');
        var correoSpan = $('#correoUsuarioCor');
        var codigoSpan = $('#codigoUsuarioCor');
        var cedulaSpan = $('#cedulaUsuarioCor');

        // Almacenar los valores originales en los elementos data para revertir luego
        nombreSpan.data('original', nombreSpan.text());
        correoSpan.data('original', correoSpan.text());
        codigoSpan.data('original', codigoSpan.text());
        cedulaSpan.data('original', cedulaSpan.text());

        // Reemplazar los elementos span con inputs para los campos editables
        nombreSpan.html('<input type="text" id="inputNombre" value="' + nombreSpan.text() + '">');
        correoSpan.html('<input type="text" id="inputCorreo" value="' + correoSpan.text() + '">');
        codigoSpan.html('<input type="text" id="inputCodigo" value="' + codigoSpan.text() + '">');
        cedulaSpan.html('<input type="text" id="inputCedula" value="' + cedulaSpan.text() + '">');

        // Crear un nuevo botón Guardar
        var guardarBtn = $('<button class="btn btn-primary" id="guardarBtn">Guardar</button>');

        // Insertar el botón Guardar después de la lista
        $('.list-group').after(guardarBtn);

        // Cambiar el estado a enEdicion
        enEdicion = true;

        // Manejar el clic en el botón Guardar
        guardarBtn.click(function () {
            // Obtener los nuevos valores de los inputs
            var nuevoNombre = $('#inputNombre').val();
            var nuevoCorreo = $('#inputCorreo').val();
            var nuevoCodigo = $('#inputCodigo').val();
            var nuevaCedula = $('#inputCedula').val();

            let idUsuario = JSON.parse(localStorage.getItem("Data")).id
            let contraseña = JSON.parse(localStorage.getItem("Data")).contraseña
            let idCoordinador = JSON.parse(localStorage.getItem("coordinador")).id
            const usuario = {
                id: idUsuario,
                nombre: nuevoNombre,
                correo: nuevoCorreo,
                contraseña
            }
            const coordinador = {
                id: idCoordinador,
                codigo: nuevoCodigo,
                cedula: nuevaCedula,
                usuario: usuario,
            }
            console.log(usuario)
            actulizarCoordinador(coordinador)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    alert("Informacion actualizada")
                    localStorage.setItem("coordinador", JSON.stringify(data))
                })
                .catch(e => {
                    console.log(e)
                })

            // Actualizar los valores en el localStorage
            var usuario1 = JSON.parse(localStorage.getItem("Data"));
            usuario1.nombre = nuevoNombre;
            usuario1.correo = nuevoCorreo;
            // Guardar el usuario actualizado en el localStorage
            localStorage.setItem("Data", JSON.stringify(usuario1));

            // Reemplazar los inputs con los nuevos valores
            nombreSpan.html(nuevoNombre);
            correoSpan.html(nuevoCorreo);
            codigoSpan.html(nuevoCodigo);
            cedulaSpan.html(nuevaCedula);

            // Eliminar el botón Guardar
            guardarBtn.remove();

            // Cambiar el estado a no enEdicion
            enEdicion = false;
        });
    }

    // Función para revertir los cambios
    function revertirCambios() {
        // Obtener los elementos span que contienen los datos
        var nombreSpan = $('#nombreUsuarioCor');
        var correoSpan = $('#correoUsuarioCor');
        var codigoSpan = $('#codigoUsuarioCor');
        var cedulaSpan = $('#cedulaUsuarioCor');

        // Obtener los valores originales de los elementos data
        var originalNombre = nombreSpan.data('original');
        var originalCorreo = correoSpan.data('original');
        var originalCodigo = codigoSpan.data('original');
        var originalCedula = cedulaSpan.data('original');

        // Mostrar los valores originales en los span solo para campos editables
        nombreSpan.html(originalNombre);
        correoSpan.html(originalCorreo);
        codigoSpan.html(originalCodigo);
        cedulaSpan.html(originalCedula);

        // Eliminar el botón Guardar
        $('#guardarBtn').remove();

        // Cambiar el estado a no enEdicion
        enEdicion = false;
    }
});

async function actulizarCoordinador(coordinador) {

    const result = await fetch(urlBackend + "coordinador/" + coordinador.id, {
        method: 'PUT',
        body: JSON.stringify(coordinador),
        headers: {
            "Content-type": "application/json"
        }
    })
    return result;
}









async function findListProyectos() {
    const result = await fetch(urlBackend + "docProyectoEmp/list-docs", {
        method: 'GET'
    })
    return result
}
mostrarListadoProyectos()
function mostrarListadoProyectos() {
    findListProyectos()
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const usuario = JSON.parse(localStorage.getItem("estudiante"))
            let body = ""
            for (const proyecto of data) {
                let color = "success"
                let mensaje = "Aceptado"
                if (proyecto.proyecto.estadoPostulacion === false) {
                    color = "danger"
                    mensaje = "Pendiente"
                }
                body += `<tr>
            <td>    
                <h6 class="mb-0 text-sm">${proyecto.proyecto.empresaId}</h6>
            </td>
            <td>
                <p class="text-xs text-secondary mb-0">${proyecto.proyecto.tutorId}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="mb-0 text-secondary text-xs">${proyecto.titulo}</span>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="mb-0 text-secondary text-xs">${proyecto.ruta}</span>
            </td>
        </tr>`

            }
            document.getElementById("tablaProyectos").innerHTML = body;

        })
        .catch(e => {
            console.log(e)
        })
}

function documentosEmpresa(id) {
    findDocuementoByIdEmpresa(id)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let body = ""
            for (const documento of data) {

                body += `<tr>
            <td>
                <h6 class="mb-0 text-sm">${documento.titulo}</h6>
            </td>
            <td>
                <p class="text-xs text-secondary mb-0">${documento.ruta}</p>
            </td>
            
            <td class="align-middle text-center text-sm"  >
           <button onclick="downloadDocumento1('${documento.ruta}')">
           <svg xmlns="http://www.w3.org/2000/svg" class="text-primary" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
           <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
         </svg>
           </button>
            </td>
        </tr>`
            }


            document.getElementById("tablaDocumento").innerHTML = body;
        })
        .catch(err => {
            console.log(err)
        })
}

async function findDocuementoByIdEmpresa(id) {
    const result = await fetch(urlBackend + "docProyectoEmp/" + id, {
        method: 'GET'
    })
    return result;
}

function downloadDocumento1(key) {

    downloadPdfDocumentoEmpresa(key)
        .then((res) => res.blob())
        .then((blob) => {
            if (blob.size === 0) {
                alert("No hay documento");
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "documento_" + key;
                document.body.appendChild(a);
                a.click();
            }
        })
        .catch((e) => {
            console.log(e);
        });
}

async function downloadPdfDocumentoEmpresa(key) {
    const result = await fetch(urlBackend + "docEmpresa/download?key=" + key, {
        method: 'GET'
    })
    return result;
}

async function uploaDocumentoPracticante(id) {
    const { value: { file, title } } = await Swal.fire({
        title: "Subir Documento",
        html:
            '<input type="file" id="file" accept="*" aria-label="Upload your profile picture" class="input">' +
            '<input type="text" id="title" class="swal2-input" placeholder="Titulo">',
        focusConfirm: false,
        preConfirm: () => {
            return {
                file: document.getElementById('file').files[0],
                title: document.getElementById('title').value
            };
        },
        showCancelButton: true,
        confirmButtonText: 'Cargar',
        inputValidator: (value) => {
            if (!value.file) {
                return 'You need to select a file';
            }
        }
    });

    if (file) {
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        uploadDocumentoProyecto(title, id, formDataFile)
            .then(res => res.json())
            .then(data => {
                Swal.fire({
                    title: "El documento :" + title + " se cargo con exito"
                });
            })
            .catch(e => {
                console.log(e)
            })
    }

}


async function uploadDocumentoProyecto(titulo, id, file) {
    const result = await fetch(urlBackend + "docPracticante/upload/" + titulo + "/" + id, {
        method: 'POST',
        body: file
    })
    return result;
}

async function listaProyectos() {
    const result = await fetch(urlBackend + "obProyectos/list-proyectos", {
        method: 'GET'
    })
    return result;
}
async function listaDocumentoProyectos(id) {
    const result = await fetch(urlBackend + "docProyectoEmp/" + id, {
        method: 'GET'
    })
    return result;
}

cargarListaProytectos()
function cargarListaProytectos() {
    let body = ""

    listaProyectos()
        .then(res => res.json())
        .then(data => {

            console.log("PROYECTOS")
            console.log(data)
            for (const proyecto of data) {
                console.log(proyecto)
                
                let color = "success"
                let mensaje = "Aceptado"
                if (proyecto.estadoPostulacion === false) {
                    color = "danger"
                    mensaje = "Pendiente"
                }
                body += `<tr>
                    <td>
                        <h6 class="mb-0 text-sm">${proyecto.empresa.usuario.nombre}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${proyecto.tutor.usuario.nombre}</p>
                    </td>
                    <td>
                    <p class="text-xs text-secondary mb-0"> CC ${proyecto.tutor.cedula}</p>
                </td>
                        <td class="align-middle text-center text-sm" >
                        <a type="button" onclick="documentosEmpresa(${proyecto.id})">
                        <svg data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="text-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
            </svg>
                        </a>
                        </td>    
                        
                        <td class="align-middle text-center text-sm" >
                        <a type="button" onclick="documentosEstudiante(${proyecto.estudianteId.id})">
                        <svg data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="text-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
            </svg>
                        </a>
                        </td>

                        <td class="align-middle text-center text-sm">
                        <a type="button" onclick="comentarios(${proyecto.id})" data-bs-toggle="modal" data-bs-target="#comentariosModal">
                        <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
            </svg>
                        </a>
                        </td>
                   
                </tr>`


            }

            document.getElementById("listaProyectos").innerHTML = body
        })
        .catch(err => {
            console.log(err)
        })

}

// Función para cargar y mostrar los comentarios en el modal
function comentarios(id) {
    localStorage.setItem("proyectoId",id)
    findComentarioByIdProyecto(id)
        .then(res => res.json())
        .then(data => {
            const comentariosModalBody = document.querySelector("#comentariosModal .modal-body");
            // Limpiar contenido existente para evitar duplicados
            comentariosModalBody.innerHTML = "";

            // Iterar sobre cada comentario y agregarlo al modal
            data.forEach(comentario => {
                const comentarioHTML = `
                    <div class="card border-0 mb-2">
                        <div class="card-body">
                            <h5 class="card-title text-primary mb-3">${comentario.titulo}</h5>
                            <p class="card-text text-muted">${comentario.descripcion}</p>
                        </div>
                    </div>`;
                // Agregar el comentario al modal
                comentariosModalBody.insertAdjacentHTML('beforeend', comentarioHTML);
            });
        })
        .catch(err => {
            console.error("Error al obtener los comentarios:", err);
        });
}

// Función para buscar comentarios por ID de proyecto
async function findComentarioByIdProyecto(id) {
    const result = await fetch(urlBackend + "comentario/list-docs/" + id, {
        method: 'GET'
    });
    return result;
}

// Función para buscar comentarios por ID de proyecto
async function crearComentario(comentario) {
    const result = await fetch(urlBackend + "comentario/guardar", {
        method: 'POST',
        body: JSON.stringify(comentario),
        headers: {
            "Content-type": "application/json"
        }
    });
    return result;
}




function CrearComentario2() {
    const usuario = JSON.parse(localStorage.getItem("coordinador"));
    let titulo = document.getElementById("tituloAgregar").value;
    let descripcion = document.getElementById("descripcionAgregar").value;
    const comentario = {
        titulo,
        descripcion,
        coordinadorId: usuario.id,
        proyectoId: localStorage.getItem("proyectoId"),
    };

    console.log(comentario);
    crearComentario(comentario)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            mostrarMensaje("El comentario se guardó exitosamente. La página se actualizará en unos segundos.");
            setTimeout(function() {
                location.reload(); // Recargar la página después de 3 segundos
            }, 1000);
        })
        .catch(err => {
            console.log(err);
        });
}

function mostrarMensaje(mensaje) {
    // Aquí puedes implementar tu lógica para mostrar un mensaje, puede ser con alert, un modal, o algún elemento en tu página
    alert(mensaje);
}













function documentosEstudiante(id) {
    findDocuementoByIdEstudiante(id)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            let body = ""
            for (const documento of data) {

                body += `<tr>
            <td>
                <h6 class="mb-0 text-sm">${documento.titulo}</h6>
            </td>
            <td>
                <p class="text-xs text-secondary mb-0">${documento.ruta}</p>
            </td>
            
            <td class="align-middle text-center text-sm"  >
           <button onclick="downloadDocumento('${documento.ruta}')">
           <svg xmlns="http://www.w3.org/2000/svg" class="text-primary" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
           <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
         </svg>
           </button>
            </td>
        </tr>`
            }


            document.getElementById("tablaDocumento").innerHTML = body;
        })
        .catch(err => {
            console.log(err)
        })
}

async function findDocuementoByIdEstudiante(id) {
    const result = await fetch(urlBackend + "docProyectoEst/" + id, {
        method: 'GET'
    })
    return result;
}

function downloadDocumento(key) {

    downloadPdfDocumentoEstudiante(key)
        .then((res) => res.blob())
        .then((blob) => {
            if (blob.size === 0) {
                alert("No hay documento");
            } else {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "documento_" + key;
                document.body.appendChild(a);
                a.click();
            }
        })
        .catch((e) => {
            console.log(e);
        });
}

async function downloadPdfDocumentoEstudiante(key) {
    const result = await fetch(urlBackend + "docPracticante/download?key=" + key, {
        method: 'GET'
    })
    return result;
}







async function findListProyectosEst() {
    const result = await fetch(urlBackend + "docProyectoEst/list-docs", {
        method: 'GET'
    })
    return result
}
mostrarListadoProyectos2()
function mostrarListadoProyectos2() {
    findListProyectosEst()
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const usuario = JSON.parse(localStorage.getItem("estudiante"))
            let body = ""
            for (const doc of data) {
                body += `<tr>
            <td>    
                <h6 class="mb-0 text-sm">${doc.estudiante.codigo}</h6>
            </td>
            <td>
                <p class="text-xs text-secondary mb-0">${doc.estudiante.cedula}</p>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="mb-0 text-secondary text-xs">${doc.titulo}</span>
            </td>
            <td class="align-middle text-center text-sm">
                <span class="mb-0 text-secondary text-xs">${doc.ruta}</span>
            </td>
        </tr>`

            }
            document.getElementById("tablaProyectos2").innerHTML = body;

        })
        .catch(e => {
            console.log(e)
        })
}
*/