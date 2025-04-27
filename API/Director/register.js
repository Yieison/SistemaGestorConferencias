//creo constantes para manejar los endpoint al servidor
const urlBackendRegistro = "https://backendsistemagestorconferencia-production.up.railway.app/usuarios"
const urlRailway = "https://backendsistemagestorconferencia-production.up.railway.app/"


document.addEventListener("DOMContentLoaded",function(){
    const paisSelect = document.getElementById("paisSelect");
    const ciudadSelect = document.getElementById("ciudadSelect");
    const institucionSelect = document.getElementById("institucionSelect");

    //cargar los paises al cargar la pagina
    fetch(`${urlRailway}/ubicacion/pais`)
    .then(response => response.json())
    .then(data =>{
        data.forEach(pais => {
            const option = document.createElement("option");
            option.value =pais.id;
            option.text = pais.nombre;
            paisSelect.appendChild(option);
        });
    })

    //cuando se selecciona un pais cargar ciudades
    paisSelect.addEventListener("change",function (){
        const paisId = paisSelect.value;
        ciudadSelect.innerHTML = '<option value="">Seleccione una ciudad</option>'
        institucionSelect.innerHTML = '<option value="">Seleccione una institución</option>'; // Resetear instituciones
        if (paisId) {
            fetch(`${urlRailway}/ubicacion/ciudades/${paisId}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(ciudad => {
                        const option = document.createElement("option");
                        option.value = ciudad.id;
                        option.text = ciudad.nombre;
                        ciudadSelect.appendChild(option);
                    });
                });
        }

    })

     // Cuando se selecciona una ciudad, cargar instituciones
     ciudadSelect.addEventListener("change", function () {
        const ciudadId = ciudadSelect.value;
        institucionSelect.innerHTML = '<option value="">Seleccione una institución</option>';

        if (ciudadId) {
            fetch(`${urlRailway}/ubicacion/instituciones/${ciudadId}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(institucion => {
                        const option = document.createElement("option");
                        option.value = institucion.id;
                        option.text = institucion.nombreInstitucion;
                        institucionSelect.appendChild(option);
                    });
                });
        }
    });


})





function guardarUsuario() {
        // Mostrar el toast de éxito
    const toastElement = document.getElementById('successToastRegister');
    const toast = new bootstrap.Toast(toastElement);

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("password").value;
    const tipo_documento = document.getElementById("tipo_documento").value;
    const documento = document.getElementById("documento").value;
    const rol = document.getElementById("rol").value;
    const ciudad = document.getElementById("ciudadSelect").value;
    const institucion = document.getElementById("institucionSelect").value;
    let rol_id = 0;

    if(rol == "EVALUADOR"){
        rol_id = 3;
    }else if(rol == "ASISTENTE"){
        rol_id=5;
    }else if(rol == "AUTOR"){
        rol_id =4;
    }
    

    const usuarioData = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        password: contraseña,
        tipoDocumento: tipo_documento,
        documento : documento,
    };

    fetch(`${urlRailway}/usuarios/register/${rol_id}/ciudad/${ciudad}/institucion/${institucion}`, {
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
        toast.show();
        document.querySelector('#login-section').style.display = 'block'; // Ocultar formulario de inicio de sesión
        document.querySelector('#register-section').style.display = 'none'; // Mostrar formulario de registro
    })
    .catch(error => {
        console.error('Error al realizar la solicitud POST:', error);
    });
    
    return false;
}
