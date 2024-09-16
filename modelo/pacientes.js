/*const express = require('express');
const router = express.Router();
const conexion = require('../js/config'); // Asumiendo que tu archivo de configuración de la base de datos está en ../config/db.js

router.get('/', async (req, res) => {
    try {
        const [pacientes] = await conexion.query('SELECT * FROM paciente');
        res.render('Pacientes', { pacientes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los pacientes');
    }
});

module.exports = router;*/