        // Configuración inicial
        let servers = [];
        let refreshInterval = 10000; // 10 segundos
        let refreshIntervalId = null;
        let currentlyEditingIndex = -1;
        
        // Elementos del DOM
        const serversList = document.getElementById('serversList');
        const manualRefreshBtn = document.getElementById('manualRefresh');
        const serverUrlInput = document.getElementById('serverUrlInput');
        const addServerBtn = document.getElementById('addServerBtn');
        const serverListConfig = document.getElementById('serverListConfig');
        const jsonModal = document.getElementById('jsonModal');
        const jsonContent = document.getElementById('jsonContent');
        const closeModal = document.getElementsByClassName('close')[0];
        const editModal = document.getElementById('editModal');
        const editServerUrlInput = document.getElementById('editServerUrlInput');
        const saveEditBtn = document.getElementById('saveEditBtn');
        
        // Cargar configuración guardada al iniciar
        function loadConfig() {
            const savedServers = localStorage.getItem('monitoredServers');
            if (savedServers) {
                servers = JSON.parse(savedServers);
                updateConfigUI();
                checkAllServers();
            }
        }
        
        // Agregar nuevo servidor
        function addServer() {
            const url = serverUrlInput.value.trim();
            if (!url) return;
            
            // Verificar si ya existe
            if (servers.some(server => server.url === url)) {
                alert('Este servidor ya está en la lista');
                return;
            }
            
            servers.push({
                name: extractServerName(url),
                url: url,
                status: 'unknown',
                lastChecked: null,
                response: null
            });
            
            saveConfig();
            serverUrlInput.value = '';
            checkAllServers();
        }
        
        // Eliminar servidor
        function deleteServer(index) {
            servers.splice(index, 1);
            saveConfig();
            checkAllServers();
        }
        
        // Editar servidor
        function editServer(index) {
            currentlyEditingIndex = index;
            editServerUrlInput.value = servers[index].url;
            editModal.style.display = 'block';
        }
        
        // Guardar cambios de edición
        function saveEdit() {
            if (currentlyEditingIndex === -1) return;
            
            const newUrl = editServerUrlInput.value.trim();
            if (!newUrl) return;
            
            servers[currentlyEditingIndex].url = newUrl;
            servers[currentlyEditingIndex].name = extractServerName(newUrl);
            servers[currentlyEditingIndex].status = 'unknown';
            servers[currentlyEditingIndex].lastChecked = null;
            servers[currentlyEditingIndex].response = null;
            
            saveConfig();
            editModal.style.display = 'none';
            currentlyEditingIndex = -1;
            checkAllServers();
        }
        
        // Extraer nombre del servidor de la URL
        function extractServerName(url) {
            try {
                const domain = new URL(url).hostname;
                return domain.replace('www.', '').split('.')[0];
            } catch {
                return url.length > 30 ? url.substring(0, 30) + '...' : url;
            }
        }
        
        // Guardar configuración
        function saveConfig() {
            localStorage.setItem('monitoredServers', JSON.stringify(servers));
            updateConfigUI();
        }
        
        // Actualizar la UI de configuración
        function updateConfigUI() {
            serverListConfig.innerHTML = '';
            
            if (servers.length === 0) {
                serverListConfig.innerHTML = '<p>No hay servidores configurados</p>';
                return;
            }
            
            servers.forEach((server, index) => {
                const serverItem = document.createElement('div');
                serverItem.className = 'server-item';
                
                const serverInfo = document.createElement('div');
                serverInfo.textContent = `${server.name} (${server.url})`;
                
                const serverActions = document.createElement('div');
                serverActions.className = 'server-item-actions';
                
                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.textContent = 'Editar';
                editBtn.addEventListener('click', () => editServer(index));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Borrar';
                deleteBtn.addEventListener('click', () => deleteServer(index));
                
                serverActions.appendChild(editBtn);
                serverActions.appendChild(deleteBtn);
                serverItem.appendChild(serverInfo);
                serverItem.appendChild(serverActions);
                serverListConfig.appendChild(serverItem);
            });
        }
        
        // Verificar estado de todos los servidores
        function checkAllServers() {
            servers.forEach(server => {
                checkServerStatus(server);
            });
            updateTable();
        }
        
        // Verificar estado de un servidor individual
        function checkServerStatus(server) {
            const startTime = Date.now();
            
            fetch(server.url, { method: 'GET', cache: 'no-store' })
                .then(response => {
                    if (!response.ok) throw new Error('Error en la respuesta');
                    return response.json();
                })
                .then(data => {
                    server.status = 'active';
                    server.response = data;
                    server.lastChecked = new Date();
                })
                .catch(error => {
                    server.status = 'inactive';
                    server.response = { error: error.message };
                    server.lastChecked = new Date();
                })
                .finally(() => {
                    updateTable();
                });
        }
        
        // Actualizar la tabla con los datos actuales
        function updateTable() {
            serversList.innerHTML = '';
            
            if (servers.length === 0) {
                serversList.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay servidores configurados</td></tr>';
                return;
            }
            
            servers.forEach((server, index) => {
                const row = document.createElement('tr');
                
                // Nombre
                const nameCell = document.createElement('td');
                nameCell.textContent = server.name;
                row.appendChild(nameCell);
                
                // Estado
                const statusCell = document.createElement('td');
                const statusSpan = document.createElement('span');
                statusSpan.className = `status status-${server.status}`;
                statusSpan.textContent = server.status === 'active' ? 'Activo 🟢' : 'Inactivo 🔴';
                statusCell.appendChild(statusSpan);
                row.appendChild(statusCell);
                
                // Acciones
                const actionsCell = document.createElement('td');
                
                const viewBtn = document.createElement('button');
                viewBtn.className = 'view-btn';
                viewBtn.textContent = 'Ver respuesta';
                viewBtn.addEventListener('click', () => showServerResponse(server));
                
                actionsCell.appendChild(viewBtn);
                row.appendChild(actionsCell);
                
                // Última verificación
                const lastCheckedCell = document.createElement('td');
                if (server.lastChecked) {
                    const dateStr = server.lastChecked.toLocaleTimeString();
                    lastCheckedCell.innerHTML = `${dateStr}<br><span class="last-checked">${timeSince(server.lastChecked)}</span>`;
                } else {
                    lastCheckedCell.textContent = 'Nunca';
                }
                row.appendChild(lastCheckedCell);
                
                serversList.appendChild(row);
            });
        }
        
        // Mostrar tiempo transcurrido en formato legible
        function timeSince(date) {
            const seconds = Math.floor((new Date() - date) / 1000);
            
            if (seconds < 60) return `hace ${seconds} segundos`;
            
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `hace ${minutes} minutos`;
            
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `hace ${hours} horas`;
            
            const days = Math.floor(hours / 24);
            return `hace ${days} días`;
        }
        
        // Mostrar la respuesta JSON en un modal
        function showServerResponse(server) {
            jsonContent.textContent = JSON.stringify(server.response, null, 2);
            jsonModal.style.display = 'block';
        }
        
        // Iniciar intervalo de actualización automática
        function startAutoRefresh() {
            if (refreshIntervalId) {
                clearInterval(refreshIntervalId);
            }
            refreshIntervalId = setInterval(checkAllServers, refreshInterval);
        }
        
        // Event listeners
        manualRefreshBtn.addEventListener('click', checkAllServers);
        addServerBtn.addEventListener('click', addServer);
        serverUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addServer();
        });
        saveEditBtn.addEventListener('click', saveEdit);
        
        // Cerrar modales
        const closeButtons = document.getElementsByClassName('close');
        Array.from(closeButtons).forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });
        
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // Inicializar
        loadConfig();
        startAutoRefresh();