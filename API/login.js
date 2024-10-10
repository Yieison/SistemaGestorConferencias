const urlBackendeva = "https://remarkable-commitment-production.up.railway.app/usuarios";

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
  const result = await fetch(urlBackendeva + "/iniciarSesion", {
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
  console.log(Usuario)
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
        window.location.href = "../Paginas/InicioAutor.html";
      }else if(data.rol.id_rol === 5){
        window.location.href = "../Paginas/InicioAsistente.html";
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



