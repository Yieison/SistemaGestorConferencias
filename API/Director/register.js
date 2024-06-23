


function guardarUsuario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("password").value;
    const tipo_documento = document.getElementById("tipo_documento").value;
    const documento = document.getElementById("documento").value;
    const rol = document.getElementById("rol").value;
    let rol_id = 0;

    if(rol == "EVALUADOR"){
        rol_id = 5;
    }else if(rol == "ASISTENTE"){
        rol_id=4;
    }else if(rol == "AUTOR"){
        rol_id =2;
    }
    

    const usuarioData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: contraseña,
        tipoDocumento: tipo_documento,
        documento : documento,
    };

    fetch(`http://localhost:8080/usuarios/register/${rol_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar el usuario');
        }
        console.log('Usuario guardado exitosamente');
        // Cerrar el modal u otra lógica de tu aplicación
        alert('Se ha registrado exitosamente, En tu correo podras ver las credenciales');
        document.querySelector('#login-section').style.display = 'block'; // Ocultar formulario de inicio de sesión
        document.querySelector('#register-section').style.display = 'none'; // Mostrar formulario de registro
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
    
    return false;
}
