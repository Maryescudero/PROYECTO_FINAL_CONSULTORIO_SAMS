// profesionalRouter.js

const express = require('express');
const router = express.Router();
const profesionalController = require('../controller/profesionalController');

// Ruta GET para obtener la lista de profesionales y renderizar la vista Pug
router.get('/', profesionalController.obtenerProfesionales);

// Ruta para agregar un nuevo profesional (redirecciona después de agregar)
router.post('/agregar', profesionalController.agregarProfesional);

// Rutas para operaciones adicionales (en formato JSON para API)
router.put('/editar/:id', profesionalController.actualizarProfesional);
router.delete('/eliminar/:id', profesionalController.eliminarProfesional);

// Ruta para buscar profesionales por especialidad
router.get('/buscar', profesionalController.buscarProfesionalesPorEspecialidad);

// Nueva ruta para editar un profesional
router.get('/editar/:id', profesionalController.editarProfesional);
router.post('/editar/:id', profesionalController.guardarEdicionProfesional);

module.exports = router;

