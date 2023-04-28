import express from 'express';

//Initialize express router
const router = express.Router();

//handle routes
router.get('/', (req, res) => {
    res.send('Api service move to v3.');
});

export default router;