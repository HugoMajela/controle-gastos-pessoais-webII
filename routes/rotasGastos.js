const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllerGasto')

router.get('/', controller.tela_principal)
router.get('/nova', controller.cria_get)
router.post('/nova', controller.cria_post)
router.get('/excluir/:id', controller.excluir)
router.get('/grafico', controller.dadosGrafico)
router.get('/exportar', controller.exportaCSV)

module.exports = router
