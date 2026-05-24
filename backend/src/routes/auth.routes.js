const express = require('express');
const controller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/cadastro', controller.cadastrar);

router.post('/login', controller.login);

router.get('/perfil', authMiddleware, controller.perfil);

module.exports = router;