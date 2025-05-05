import express from 'express';
import * as ServerController from '../controllers/server.controller.js';

const router = express.Router();

router.get('/', ServerController.getServers);
router.post('/', ServerController.createServer);
router.put('/:id', ServerController.updateServer);
router.delete('/:id', ServerController.deleteServer);
router.put('/status/:id', ServerController.updateServerStatus);

export default router;
