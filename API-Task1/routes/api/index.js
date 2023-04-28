import express from 'express';
import apiV1 from './v1/index.js';
import apiV2 from './v2/index.js';
import apiV3 from './v3/index.js';

//Initialize express router
const router = express.Router();

//handle routes for different api versions
router.use('/v1', apiV1);
router.use('/v2', apiV2);
router.use('/v3', apiV3);

export default router;