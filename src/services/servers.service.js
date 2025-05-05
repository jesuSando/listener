import db from '../models/database.js';

export function getAllServers(callback) {
  db.all('SELECT * FROM servidores', [], callback);
}

export function addServer(name, url, callback) {
  const query = `INSERT INTO servidores (name, url) VALUES (?, ?)`;
  db.run(query, [name, url], function (err) {
    callback(err, this?.lastID);
  });
}

export function updateServer(id, name, url, callback) {
  const query = `UPDATE servidores SET name = ?, url = ? WHERE id = ?`;
  db.run(query, [name, url, id], callback);
}

export function deleteServer(id, callback) {
  const query = `DELETE FROM servidores WHERE id = ?`;
  db.run(query, [id], callback);
}

export function updateServerStatus(id, status, last_checked, response, callback) {
  const query = `
    UPDATE servidores
    SET status = ?, last_checked = ?, response = ?
    WHERE id = ?
  `;
  db.run(query, [status, last_checked, response, id], callback);
}
