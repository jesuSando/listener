import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta al archivo de la base de datos
const dbPath = path.join(__dirname, '../../db/database.sqlite');

// Conexión
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la bd');
  }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS servidores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'unknown',
    last_checked TEXT,
    response TEXT
  )
`);

export default db;
