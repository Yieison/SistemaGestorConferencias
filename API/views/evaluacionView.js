const urlBackendaprobados = "http://localhost:8080/evaluacion";

async function findEvaluaciones() {
    const result = await fetch(urlBackendaprobados, {
        method: 'GET'
    });
    return result;
}


export function mostrarEvaluaciones() {
    findEvaluaciones()
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let body = "";
            // Dado que el JSON ya devuelve los artículos aprobados
            const articulosAprobados = Array.isArray(data) ? data : [data];

            for (const articulo of articulosAprobados) {
                body += `<tr>
                    <td>
                        <h6 class="mb-0 text-sm">${articulo.id}</h6>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${new Date(articulo.fechaHora).toLocaleString()}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.evaluador.nombre} ${articulo.evaluador.apellido}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.estado}</p>
                    </td>
                    <td>
                        <p class="text-xs text-secondary mb-0">${articulo.articulo.nombre}</p>
                    </td>
                    <td>
                        <a href="${articulo.articulo.url}" target="_blank">Ver Artículo</a>
                    </td>
                    <span class="my-2 mb-0 text-secondary text-xs" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="realizarEvaluacion(${articulo.id})">
                    </span>
                </tr>`;
            }
            document.getElementById("tablaArticulosAprobados").innerHTML = body;

            // Mostrar la sección de artículos aprobados
            document.getElementById("section-articulos-aprobado").style.display = 'block';
        })
        .catch(e => {
            console.log(e);
        });
}

// Llama a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarArticulosAprobados();
});
