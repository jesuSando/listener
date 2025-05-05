import * as ServerService from '../services/servers.service.js';


//listar servers
export const getServers = (req, res) => {
    ServerService.getAllServers((err, rows) => {
        if (err) {
            console.error('Error al obtener servidores:', err);
            return res.status(500).json({ error: err.message });
        }
        
        try {
            const formattedServers = rows.map(server => ({
                id: server.id,
                name: server.name,
                url: server.url,
                status: server.status || 'unknown',
                last_checked: server.last_checked,
                response: server.response ? JSON.parse(server.response) : null
            }));
            return res.json(formattedServers);
        } catch (parseError) {
            console.error('Error al parsear respuestas:', parseError);
            return res.status(500).json({ error: 'Error al procesar los datos' });
        }
    });
};


//crear nuevo server
export const createServer = (req, res) => {
    const { name, url } = req.body;
    if (!name || !url) {
        return res.status(400).json({ error: 'Nombre y URL requeridos' });
    }

    ServerService.addServer(name, url, (err, id) => {
        if (err) {
            console.error('Error al crear servidor:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ id, name, url });
    });
};


//actualizar server
export const updateServer = (req, res) => {
    const { id } = req.params;
    const { name, url } = req.body;
    
    if (!name || !url) {
        return res.status(400).json({ error: 'Nombre y URL requeridos' });
    }

    ServerService.updateServer(id, name, url, (err) => {
        if (err) {
            console.error('Error al actualizar servidor:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ success: true });
    });
};


//borrar server
export const deleteServer = (req, res) => {
    const { id } = req.params;
    
    ServerService.deleteServer(id, (err) => {
        if (err) {
            console.error('Error al eliminar servidor:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ success: true });
    });
};


//estado server
export const updateServerStatus = (req, res) => {
    const { id } = req.params;
    const { status, last_checked, response } = req.body;
    
    if (!status || !last_checked) {
        return res.status(400).json({ error: 'Estado y fecha requeridos' });
    }

    ServerService.updateServerStatus(id, status, last_checked, response, (err) => {
        if (err) {
            console.error('Error al actualizar estado:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json({ success: true });
    });
};