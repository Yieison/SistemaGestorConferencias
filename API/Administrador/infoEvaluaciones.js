const urlBackendaprobados = "http://localhost:8080/evaluacion";
const urlBackendEvaluadores = "http://localhost:8080"


async function findEvaluaciones() {
    const result = await fetch(`${urlRailway}/evaluacion`, {
        method: "GET",
    });
    return result;
}

function mostrarEvaluaciones() {
    findEvaluaciones()
        .then((res) => res.json())
        .then((data) => {
            let body = "";
            // Dado que el JSON ya devuelve los artículos aprobados
            const articulosAprobados = Array.isArray(data) ? data : [data];

            for (const articulo of articulosAprobados) {
                let estadoColor = "";
                switch (articulo.estado.toLowerCase()) {
                    case "pendiente":
                        estadoColor = "badge bg-warning"; // Naranja
                        break;
                    case "aceptado":
                        estadoColor = "badge bg-success"; // Verde
                        break;
                    case "correcciones":
                        estadoColor = "badge bg-primary"; // Azul
                        break;
                    case "rechazado":
                        estadoColor = "badge bg-danger"; // Rojo
                        break;
                    default:
                        estadoColor = "badge bg-secondary"; // Color gris por defecto
                }
                body += `<tr>
                    <td>
                        <h6 class="mb-0 text-sm">${articulo.id}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${new Date(
                    articulo.fechaHora
                ).toLocaleString()}</p>
                    </td>
                    <td>
                    <p class="text-xs text-secondary mb-0">${articulo.evaluador.nombre} ${articulo.evaluador.apellido}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.articulo.nombre}</p>
                    </td>
                    <td>
                        <a href="${articulo.articulo.url
                    }" target="_blank">Ver Artículo</a>
                    </td>
                    <td>
                     <span class="${estadoColor}">${articulo.estado}</span> <!-- Aquí va el span de estado -->
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.comentario}</p>
                    </td>
                    <td>
                    <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="realizarEvaluacion(${articulo.id
                    })">
                    <i class="fa-solid fa-pen-to-square" style="color:orange; font-size:1rem;"></i>
                    </span>
                    </td>
                </tr>`;
            }
            document.getElementById("tablaEvaluaciones").innerHTML = body;

            // Mostrar la sección de artículos aprobados
            document.getElementById("section-articulos-aprobado").style.display =
                "block";
        })
        .catch((e) => {
            console.log(e);
        });
}

function realizarEvaluacion(idEvaluacion) {
    

}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    mostrarEvaluaciones();
});
