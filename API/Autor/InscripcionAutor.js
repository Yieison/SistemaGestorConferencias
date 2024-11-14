// Suponiendo que tienes una lista de inscripciones basada en el formato que proporcionaste
const inscripciones = [
    {
        id: 2,
        estado: "pendiente",
        asistente: {
            id_usuarios: 4,
            tipoDocumento: "Cedula",
            documento: "1332165165",
            nombre: "Kevin",
            apellido: "Barreto",
            correo: "kevin@gmail.com",
            password: "kevin123",
            rol: {
                id_rol: 4,
                nombre: "AUTOR"
            },
            ciudad: {
                id: 2,
                nombre: "Bogotá",
                pais: {
                    id: 1,
                    nombre: "Colombia"
                }
            },
            institucion: {
                id: 2,
                nombreInstitucion: "Universidad de los Andes"
            },
            evaluaciones: []
        },
        conferencia: {
            id_conferencia: 8,
            nombre: "Conferencia Internacional de Ciencia y Tecnologia",
            descripcion: "Descripción de la conferencia de ciencia y tecnologia",
            lugar: "Auditorio Eustorgio Colmenares",
            estado: "Activa",
            chair: 2,
            imagenUrl: "https://files-conferences.s3.amazonaws.com/1729034898055_33.png",
            fecha_inicio: "2024-10-14",
            fecha_fin: "2024-10-24"
        },
        fechaInscripcion: null
    }
    // Otros registros de inscripción
];

async function cargarInscripciones() {

    let usuario = JSON.parse(localStorage.getItem('Data'));

    let idUsuario = usuario.id_usuarios;

    const response = await fetch(`${urlBackendConferencia}/inscripciones/usuario/${idUsuario}`);
    const inscripciones = await response.json();
    listaInscripciones.innerHTML = ""; // Limpiar el contenido antes de agregar nuevas filas

    inscripciones.forEach(inscripcion => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${inscripcion.conferencia.nombre}</td>
            <td>${inscripcion.conferencia.fecha_inicio}</td>
            <td>${inscripcion.conferencia.fecha_fin}</td>
            <td>${usuario.nombre} ${usuario.apellido}</td>
            <td>${inscripcion.estado}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="realizarPago(${inscripcion.id})">
                    <i class="fas fa-credit-card"></i> Pagar
                </button>
                <button class="btn btn-info btn-sm" onclick="verPago(${inscripcion.id})">
                    <i class="fas fa-eye"></i> Ver Pago
                </button>
            </td>
        `;

        listaInscripciones.appendChild(row);
    });
}

// Llama a esta función al cargar la página para mostrar las inscripciones
cargarInscripciones();



