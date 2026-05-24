const express = require('express');

const controller = require('../controllers/calculo.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/simular', authMiddleware, controller.simular);

router.get('/', authMiddleware, controller.listar);

module.exports = router;