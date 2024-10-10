// Función para obtener artículos desde la API
async function obtenerSalas() {
    const response = await fetch(`${urlRailway}/salas`);
    const salas = await response.json();
    return salas;
}

// Función para cargar los artículos en el dropdown
async function cargarSalas() {
    const salas = await obtenerSalas();
    const salasSelect = document.getElementById('selectSala');
    salasSelect.innerHTML = ''; // Limpiar opciones existentes
    salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id;
        option.textContent = `Nombre : ${sala.nombre}`;
        salasSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarSalas();
});


async function obtenerConferencias() {
    const response = await fetch(`${urlRailway}/conferencias`);
    const conferencias = await response.json();
    return conferencias;
}

// Función para cargar los artículos en el dropdown
async function cargarConferencias() {
    const conferencias = await obtenerConferencias();
    const conferenciasSelect = document.getElementById('selectConferencia');
    conferenciasSelect.innerHTML = ''; // Limpiar opciones existentes
    conferencias.forEach(conferencia => {
        const option = document.createElement('option');
        option.value = conferencia.id_conferencia;
        option.textContent = ` ${conferencia.nombre}`;
        conferenciasSelect.appendChild(option);
    });
}

// Llamar a la función para cargar los artículos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarConferencias();
});