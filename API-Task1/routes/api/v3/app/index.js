import express from 'express';
import events from './events/index.js';

//Initialize express router
const router = express.Router();

//handle routes
router.use('/events', events);

export default router;