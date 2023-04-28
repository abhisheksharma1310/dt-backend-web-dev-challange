import express from 'express';
import app from './app/index.js';

//Initialize express router
const router = express.Router();

//handle routes
router.use('/app', app);

export default router;