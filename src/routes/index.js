import express from 'express';
import frontRoutes from './front.routes.js';
import serversRoutes from './servers.routes.js';

const router = express.Router();

router.use('/', frontRoutes);
router.use('/api/servers', serversRoutes);

export default router;
