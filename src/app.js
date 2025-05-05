import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { checkServers } from './services/monitor.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

//public
app.use(express.static(path.join(__dirname, '../public')));

//rutas
app.use(routes);

//server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

//actualizacion 
setInterval(checkServers, 10000);
checkServers();