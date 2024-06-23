
// Endpoint donde tu backend expone las URLs de las imágenes
const endpoint = 'http://localhost:8080/s3/list'; // Asegúrate de que esto coincida con la ruta de tu backend


// Función para cargar y mostrar las imágenes
async function loadImages() {
    try {
        const response = await axios.get(endpoint);
        const imageUrls = response.data; // La respuesta debe ser un array de strings con las URLs de las imágenes

        const imageContainer = document.getElementById('imageContainer');

        // Limpiar contenedor de imágenes antes de agregar nuevas
        imageContainer.innerHTML = '';

        // Mostrar cada imagen en el contenedor
        imageUrls.forEach(url => {
            const imgElement = document.createElement('img');
            imgElement.src = url;
            imgElement.classList.add('thumbnail'); // Clase opcional para aplicar estilos específicos
            imageContainer.appendChild(imgElement);
        });

    } catch (error) {
        console.error('Error al cargar imágenes:', error);
    }
}

// Llamar a la función para cargar y mostrar las imágenes al cargar la página
loadImages();
