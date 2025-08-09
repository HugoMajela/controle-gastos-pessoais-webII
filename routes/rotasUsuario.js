const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllerUsuario');

router.get('/cadastro', controller.cadastro_get);
router.post('/cadastro', controller.cadastro_post);

router.get('/login', controller.login_get);
router.post('/login', controller.login_post);

router.get('/logout', controller.logout);

module.exports = router;