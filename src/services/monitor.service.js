import fetch from 'node-fetch';
import https from 'https';
import db from '../models/database.js';

const agent = new https.Agent({
    rejectUnauthorized: false, // <-- ignora certificados inválidos/autofirmados
});

export async function checkServers() {
    db.all('SELECT * FROM servidores', [], async (err, rows) => {
      if (err) return console.error('Error al consultar servidores:', err.message);
  
      for (const server of rows) {
        try {
          const res = await fetch(server.url, { agent, cache: 'no-store' });
          const data = await res.json();
  
          db.run(`
            UPDATE servidores
            SET status = ?, last_checked = ?, response = ?
            WHERE id = ?
          `, ['active', new Date().toISOString(), JSON.stringify(data), server.id]);
        } catch (error) {
          db.run(`
            UPDATE servidores
            SET status = ?, last_checked = ?, response = ?
            WHERE id = ?
          `, ['inactive', new Date().toISOString(), JSON.stringify({ error: error.message }), server.id]);
        }
      }
    });
  }