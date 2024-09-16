// usuarioRouter.js



const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');

// Middleware para proteger rutas
const requireLogin = (req, res, next) => {
    if (!req.session.loggedin) {
        return res.redirect('/Usuarios/login');
    }
    next();
};

// Ruta para el formulario de registro
router.get('/registro', usuarioController.mostrarRegistro);

// Ruta para procesar el registro
router.post('/registro', usuarioController.registrarUsuario);

// Ruta para el formulario de inicio de sesion
router.get('/login', usuarioController.mostrarLogin);

// Ruta para procesar el inicio de sesion
router.post('/login', usuarioController.procesarLogin);

// Ruta para el dashboard (protegida)
router.get('/dashboard', requireLogin, usuarioController.mostrarDashboard);

// Ruta para cerrar sesion
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar sesión.');
        }
        res.redirect('/Usuarios/login');
    });
});

module.exports = router;

