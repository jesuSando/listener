const API_URL = '/api/servers';

let servers = [];
let currentlyEditingIndex = null;

// DOM Elements
const serversList = document.getElementById('serversList');
const manualRefreshBtn = document.getElementById('manualRefresh');
const serverUrlInput = document.getElementById('serverUrlInput');
const serverNameInput = document.getElementById('serverNameInput');
const addServerBtn = document.getElementById('addServerBtn');
const jsonModal = document.getElementById('jsonModal');
const jsonContent = document.getElementById('jsonContent');
const editModal = document.getElementById('editModal');
const editServerUrlInput = document.getElementById('editServerUrlInput');
const editServerNameInput = document.getElementById('editServerNameInput');
const saveEditBtn = document.getElementById('saveEditBtn');

// Cargar y mostrar los servidores
async function fetchServers() {
    const res = await fetch(API_URL);
    servers = await res.json();
    updateTable();
}

// Agregar servidor
async function addServer() {
    const name = serverNameInput.value.trim();
    const url = serverUrlInput.value.trim();
    if (!name || !url) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url })
    });

    serverNameInput.value = '';
    serverUrlInput.value = '';
    await fetchServers();
}

// Eliminar servidor
async function deleteServer(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await fetchServers();
}

// Editar servidor
function editServer(server) {
    currentlyEditingIndex = server.id;
    editServerNameInput.value = server.name;
    editServerUrlInput.value = server.url;
    editModal.style.display = 'block';
}

// Guardar edición
async function saveEdit() {
    const newName = editServerNameInput.value.trim();
    const newUrl = editServerUrlInput.value.trim();
    if (!newName || !newUrl) return;

    await fetch(`${API_URL}/${currentlyEditingIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, url: newUrl })
    });

    editModal.style.display = 'none';
    currentlyEditingIndex = null;
    await fetchServers();
}

// Mostrar respuesta JSON
function showServerResponse(response) {
    jsonContent.textContent = typeof response === 'object' ? JSON.stringify(response, null, 2) : response;
    jsonModal.style.display = 'block';
}

// Renderizar tabla
function updateTable() {
    serversList.innerHTML = '';
    if (servers.length === 0) {
        serversList.innerHTML = '<tr><td colspan="4">No hay servidores</td></tr>';
        return;
    }

    servers.forEach(server => {
        const row = document.createElement('tr');
        
        // Celdas de nombre y estado
        row.innerHTML = `
            <td>${server.name}</td>
            <td><span class="status status-${server.status}">${server.status === 'active' ? 'Activo 🟢' : 'Inactivo 🔴'}</span></td>
            <td class="actions-cell"></td>
            <td>${server.last_checked ? new Date(server.last_checked).toLocaleString() : 'Nunca'}</td>
        `;
        
        // Celda de acciones (la creamos manualmente para asignar clases)
        const actionsCell = row.querySelector('.actions-cell');
        
        // Botón Ver Respuesta
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-btn';
        viewBtn.textContent = 'Ver respuesta';
        viewBtn.addEventListener('click', () => showServerResponse(server.response));
        
        // Botón Editar
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => editServer(server));
        
        // Botón Borrar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Borrar';
        deleteBtn.addEventListener('click', () => deleteServer(server.id));
        
        // Agregamos los botones a la celda
        actionsCell.appendChild(viewBtn);
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        
        serversList.appendChild(row);
    });
}

// Listeners
addServerBtn.addEventListener('click', addServer);
manualRefreshBtn.addEventListener('click', fetchServers);
saveEditBtn.addEventListener('click', saveEdit);

document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

fetchServers();
