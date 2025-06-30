const express = require('express')
const router = express.Router()
const controller = require('../controllers/vitima.controller')

router.post('/login/vitima', controller.LoginVitma)
router.get('/vitimas', controller.getVitimas)

module.exports = router;