//atencionRouter.js 



const express = require('express');
const router = express.Router();
const atencionController = require('../controller/atencionController');

// Ruta para mostrar la vista de atención
router.get('/', atencionController.mostrarAtencion);

// Ruta para buscar un paciente usando GET
router.get('/buscar-paciente', atencionController.buscarPaciente);

// Ruta para buscar un paciente usando POST
router.post('/buscar-paciente', atencionController.buscarPaciente);

module.exports = router;
