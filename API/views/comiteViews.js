const comites = [
    {
      "id": 1,
      "nombre": "COMITE ORGANIZADOR",
      "conferencia": {
        "id_conferencia": 2,
        "nombre": "Conferencia sobre Javascript",
        "descripcion": "Se hablaran temas muy importantes sobre EMASCRIPT16",
        "lugar": "Auditorio San pablo",
        "fecha_inicio": "2024-08-21",
        "fecha_fin": "2024-09-05"
      },
      "usuarios": [
        {
          "id_usuarios": 8,
          "nombre": "Juan",
          "apellido": "Simarra",
          "rol": {
            "nombre": "ASISTENTE"
          }
        },
        {
          "id_usuarios": 6,
          "nombre": "Kevin",
          "apellido": "Trigos",
          "rol": {
            "nombre": "CHAIR"
          }
        }
      ]
    }
  ];
  
  // Función para generar la tabla de comités
  export function listarComites() {
    const tableBody = document.getElementById('tablaComites').querySelector('tbody');
  
    comites.forEach(comite => {
      // Crear la fila
      let row = document.createElement('tr');
      
      // Celda para el ID del comité
      let cellId = document.createElement('td');
      cellId.textContent = comite.id;
      row.appendChild(cellId);
  
      // Celda para el nombre del comité
      let cellNombre = document.createElement('td');
      cellNombre.textContent = comite.nombre;
      row.appendChild(cellNombre);
  
      // Celda para el nombre de la conferencia
      let cellConferencia = document.createElement('td');
      cellConferencia.textContent = comite.conferencia.nombre;
      row.appendChild(cellConferencia);
  
      // Celda para los usuarios con un botón de despliegue
      let cellUsuarios = document.createElement('td');
  
      // Crear un botón que desplegará los usuarios
      let btnUsuarios = document.createElement('button');
      btnUsuarios.textContent = 'Mostrar Usuarios';
      btnUsuarios.classList.add('btn', 'btn-info', 'btn-sm');
      
      // Crear un contenedor para los usuarios que estará oculto al principio
      let userList = document.createElement('div');
      userList.style.display = 'none'; // Oculto por defecto
      userList.classList.add('mt-2'); // Espaciado superior
      
      // Poblamos el contenedor con los usuarios
      comite.usuarios.forEach(usuario => {
        let userItem = document.createElement('p');
        userItem.textContent = `${usuario.nombre} ${usuario.apellido} (${usuario.rol.nombre})`;
        userList.appendChild(userItem);
      });
  
      // Agregar funcionalidad para mostrar/ocultar los usuarios
      btnUsuarios.onclick = function() {
        if (userList.style.display === 'none') {
          userList.style.display = 'block';
          btnUsuarios.textContent = 'Ocultar Usuarios';
        } else {
          userList.style.display = 'none';
          btnUsuarios.textContent = 'Mostrar Usuarios';
        }
      };
  
      // Añadir el botón y la lista de usuarios a la celda
      cellUsuarios.appendChild(btnUsuarios);
      cellUsuarios.appendChild(userList);
      row.appendChild(cellUsuarios);
  
      // Agregar la fila a la tabla
      tableBody.appendChild(row);
    });
  }
  
  // Llamamos a la función para listar los comités
  listarComites();