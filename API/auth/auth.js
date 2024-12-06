function verificarAutenticacion(rolRequerido) {
    // Obtén los datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem("Data"));
  
    // Si no hay datos de usuario en localStorage, redirige a la página de inicio de sesión
    if (!userData) {
      window.location.href = "/index.html"; // Reemplaza con la URL de tu página de inicio de sesión
      return false;
    }
  
    // Verifica si el rol del usuario coincide con el rol requerido para la página
    if (userData.rol.id_rol !== rolRequerido) {
      alert("No tienes permiso para acceder a esta página");
      window.location.href = "/Paginas/noAutorizado.html"; // Redirige si no tiene permiso
      return false;
    }
  
    return true; // Autorizado
  }
  
  
  
  
  function logout() {
    localStorage.removeItem("Data"); // Limpia los datos del usuario
    window.location.href = "/";
 // Redirige al usuario al login
  }