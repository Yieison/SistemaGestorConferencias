// URL del backend
const urlBackendConferencia = "https://remarkable-commitment-production.up.railway.app";

// Función para cargar conferencias desde el backend
async function loadConferences() {
  try {
    const response = await fetch(`${urlBackendConferencia}/conferencias/estado/ACTIVA`);
    const conferences = await response.json();
    console.log(conferences);
    const container = document.getElementById('conferencesContainer');
    container.innerHTML = '';

    conferences.forEach(conference => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      const cardContent = `
 <div class="card h-100 d-flex flex-column m-2">
    <h5 class="card-title m-3 text-center">${conference.nombre}</h5>
      <div class="d-flex justify-content-center align-items-center">
        <img src="${conference.imagenUrl}" class="card-img-top" alt="${conference.nombre}" style="max-height: 300px; width: 50%; object-fit: cover;">
      </div>
      <div class="card-body d-flex flex-column justify-content-between" style="font-size: 0.9rem;"> <!-- Reducir tamaño del contenido -->
        <p class="card-text" style="font-size: 0.8rem;">${conference.descripcion.substring(0, 200)}...</p>
        
        <!-- Agrupar fechas y darles margen pequeño -->
        <div class="d-flex flex-column" style="font-size: 0.85rem; margin-top: 10px;">
          <p class="card-text mb-1"><strong>Fecha inicio:</strong> ${conference.fecha_inicio}</p>
          <p class="card-text mb-1"><strong>Fecha fin:</strong> ${conference.fecha_fin}</p>
          <p class="card-text mb-1"><strong>Lugar:</strong> ${conference.lugar}</p>
        </div>

        <div class="mt-auto d-flex justify-content-between">
  <button class="btn btn-primary w-48" onclick="showDetails(${conference.id_conferencia})" data-bs-toggle="modal" data-bs-target="#detailsModal">Ver Detalles</button>
  <button class="btn btn-success w-48" onclick="inscribirseConferencia(${conference.id_conferencia})" data-bs-toggle="modal" data-bs-target="#inscriptionModal">Inscribirse</button>
</div>
      </div>
    </div>
  `;


card.innerHTML = cardContent;
container.appendChild(card);
      console.log(card);
    });
  } catch (error) {
    console.error("Error al cargar conferencias:", error);
  }
}



async function inscribirseConferencia(idConferencia){
  //guarda una variable local con el id de la conferencia
  window.idConferencia = idConferencia;  
}

function enviarInscripcion() {
  // Extraer los datos del usuario desde localStorage
  let usuario = JSON.parse(localStorage.getItem('Data'));

  let idUsuario = usuario.id_usuarios;

  console.log(idUsuario);

  // Obtener la fecha actual en formato ISO
  let fecha = new Date().toISOString();

  // Preparar los datos de inscripción
  let inscripcionData = {
    estado: "PENDIENTE",                       // Estado de la inscripción
    fechaInscripcion: fecha                               // Fecha de la inscripción       
  };

  // Enviar los datos al endpoint (reemplaza URL_ENDPOINT con la URL real de tu API)
  fetch(`${urlBackendConferencia}/inscripciones/registrar/${idUsuario}/conferencia/${idConferencia}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inscripcionData)
  })
  .then(response => {
    if (response.ok) {
      alert("Inscripción enviada con éxito.");
      // Opcional: Cerrar el modal
      let modal = bootstrap.Modal.getInstance(document.getElementById('inscriptionModal'));
      modal.hide();
      $('.modal-backdrop').remove();
      cargarInscripciones();
    } else {
      alert("Error al enviar la inscripción.");
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Error al enviar la inscripción.");
  });
}

async function showDetails(id) {
    try {
      // Llamada para obtener los detalles básicos de la conferencia
      const response = await fetch(`${urlBackendConferencia}/conferencias/${id}`);
      const conference = await response.json();
  
      // Cargar información básica en el modal
      const modalContent = document.getElementById('detailsModalContent');
      modalContent.innerHTML = `
        <h5>${conference.nombre}</h5>
        <p><strong>Descripción:</strong> ${conference.descripcion}</p>
        <p><strong>Lugar:</strong> ${conference.lugar}</p>
        <p><strong>Estado:</strong> ${conference.estado}</p>
        <p><strong>Fecha Inicio:</strong> ${conference.fecha_inicio}</p>
        <p><strong>Fecha Fin:</strong> ${conference.fecha_fin}</p>
      `;
      
      // Cargar el contenido de las pestañas (tópicos, precios, comités, convocatoria)
      loadTabContent(id);
  
    } catch (error) {
      console.error("Error al cargar los detalles de la conferencia:", error);
    }
  }
  
  async function loadTabContent(id) {
    // Cargar tópicos
    const topicsContainer = document.getElementById('topicsContent');
    topicsContainer.innerHTML = 'Cargando tópicos...';
    try {
      const topicsResponse = await fetch(`${urlBackendConferencia}/conferencias/${id}/topicos`);
      const topics = await topicsResponse.json();
      console.log(topics)
      topicsContainer.innerHTML = topics.map(topic => `<p>${topic.tema}</p>`).join('');
    } catch (error) {
      topicsContainer.innerHTML = 'Error al cargar los tópicos.';
    }
  
    // Cargar precios
    const pricesContainer = document.getElementById('pricesContent');
    pricesContainer.innerHTML = 'Cargando precios...';
    try {
      const pricesResponse = await fetch(`${urlBackendConferencia}/conferencias/${id}/precios`);
      const prices = await pricesResponse.json();
      pricesContainer.innerHTML = prices.map(price => `<p>${price.descripcion}: ${price.costo}</p>`).join('');
    } catch (error) {
      pricesContainer.innerHTML = 'Error al cargar los precios.';
    }
  
    // Cargar comités
    const committeesContainer = document.getElementById('committeesContent');
    committeesContainer.innerHTML = 'Cargando comités...';
    try {
      const committeesResponse = await fetch(`${urlBackendConferencia}/conferencias/${id}/comites`);
      const committees = await committeesResponse.json();
      committeesContainer.innerHTML = committees.map(committee => `<p>${committee.nombre}</p>`).join('');
    } catch (error) {
      committeesContainer.innerHTML = 'Error al cargar los comités.';
    }
  
    // Cargar convocatoria
    const callContainer = document.getElementById('callContent');
    callContainer.innerHTML = 'Cargando convocatoria...';
    try {
      const callResponse = await fetch(`${urlBackendConferencia}/conferencias/${id}/convocatoria`);
      const call = await callResponse.json();
      callContainer.innerHTML = `<p>${call.descripcion}</p>`;
    } catch (error) {
      callContainer.innerHTML = 'Error al cargar la convocatoria.';
    }
  }
  


// Cargar conferencias al cargar la página
document.getElementById('navConferences').addEventListener('click', (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    loadConferences(); // Llamar a la función para cargar conferencias
});






