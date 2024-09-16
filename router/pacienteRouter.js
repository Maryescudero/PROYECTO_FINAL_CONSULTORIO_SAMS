// pacienteRouter.js

const express = require('express');
const router = express.Router();
const pacienteController = require('../controller/pacienteController');


// Ruta GET para obtener la lista de pacientes y renderizar la vista Pug
router.get('/', pacienteController.obtenerPacientes);

// Ruta para agregar un nuevo paciente (redirecciona después de agregar)
router.post('/pacientes', pacienteController.agregarPaciente);

// Rutas para operaciones adicionales (en formato JSON para API)
router.put('/editar/:id', pacienteController.actualizarPaciente); // Actualización
router.post('/eliminar/:id', pacienteController.eliminarPaciente);


// Ruta para buscar pacientes
router.get('/buscar', pacienteController.buscarPacientes);

// Nueva ruta para editar un paciente
router.get('/editar/:id', pacienteController.editarPaciente);
router.post('/editar/:id', pacienteController.guardarEdicionPaciente);

module.exports = router;
