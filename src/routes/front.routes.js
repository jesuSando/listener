import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../../public');

//ruta principal
router.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'html/index.html'));
});

router.get('/localstorage', (req, res) => {
    res.sendFile(path.join(publicPath, 'html/index-localstorage.html'));
})


export default router;
