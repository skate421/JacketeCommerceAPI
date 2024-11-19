import express from 'express';

const router = express.Router();

router.get('/products/all', async (req, res) => {
    res.send("All route");
});

router.get('/products/:id', async (req, res) => {
    res.send("id route");
});

router.get('/purchase', async (req, res) => {
    res.send("purchase route");
});

export default router;
