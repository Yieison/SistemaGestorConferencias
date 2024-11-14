const urlBackendeva = "https://remarkable-commitment-production.up.railway.app/usuarios";

const urlLocal = "https://remarkable-commitment-production.up.railway.app/usuarios";

/**
async function loginUser(loginDTO) {
  const result = await fetch(urlBackend + "usuarios/iniciarSesion", {
    method: 'POST',
    body: JSON.stringify(loginDTO),
    headers: {
      "Content-type": "application/json"
    }
  })
  return result;
}
  */

async function loginUser1(Usuario) {
  const result = await fetch(urlLocal + "/iniciarSesion", {
    method: 'POST',
    body: JSON.stringify(Usuario),
    headers: {
      "Content-type": "application/json"
    }
  })
  return result;
}

function iniciarSesionChair() {

  event.preventDefault();
  // Obtener los valores de los campos de entrada
  var correo = document.getElementById('correoChair').value;
  var password = document.getElementById('passwordChair').value;
  //Creo el objeto Usuario 

  const Usuario = {
    correo,
    password
  }
  
  //Llamar a la funcion loginUser
  loginUser1(Usuario)
    .then(res => res.json())
    .then(data => {
      
       // Almacenar los datos del usuario en localStorage
       localStorage.setItem("Data", JSON.stringify(data));
      
      if (data.rol.id_rol === 1) {
        localStorage.setItem("Data", JSON.stringify(data))
        window.location.href = "/Paginas/inicioAdministrador.html";
      }else if(data.rol.id_rol === 2){
        localStorage.setItem("Data", JSON.stringify(data))
        window.location.href = "../Paginas/InicioChair.html";
      }else if(data.rol.id_rol === 3){
        window.location.href = "../Paginas/inicioEvaluador.html";
      }else if(data.rol.id_rol === 4){
        window.location.href = "../Paginas/inicioAutor.html";
      }else if(data.rol.id_rol === 5){
        window.location.href = "../Paginas/inicioAsistente.html";
      } else {
        alert("usuario no autorizado")
      }
    })
    .catch(e => {
      console.log(e)
      alert("Contraseña o email incorrecto")
    })
    return false;
}


document.addEventListener('DOMContentLoaded', function() {
  const togglePassword = document.getElementById('togglePassword');
  const passwordField = document.getElementById('passwordChair');
  const iconEye = document.getElementById('icon-eye');

  togglePassword.addEventListener('click', function () {
    // Alternar entre mostrar/ocultar contraseña
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      iconEye.src = "https://img.icons8.com/ios-glyphs/30/000000/invisible.png"; // Cambiar a ícono de "ocultar"
    } else {
      passwordField.type = 'password';
      iconEye.src = "https://img.icons8.com/ios-glyphs/30/000000/visible.png"; // Cambiar a ícono de "mostrar"
    }
  });
});



