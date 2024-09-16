//pacienteController.js

const createConnection = require('../js/config');

// Función para obtener todos los pacientes y renderizar la vista
const obtenerPacientes = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const [pacientes] = await conexion.query(`
            SELECT p.*, pl.descripcion as plan_descripcion 
            FROM paciente p
            JOIN plan pl ON p.id_plan = pl.id_plan
            WHERE p.estado = 1
        `);
        const [planes] = await conexion.query('SELECT * FROM plan');
        res.render('Pacientes', { pacientes, planes, mensajeExito: req.query.mensajeExito });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los pacientes');
    } finally {
        if (conexion) await conexion.end();
    }
};

// Función para agregar un nuevo paciente y redirigir a la lista de pacientes
const agregarPaciente = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { documento, nombre, apellido, fecha_nacimiento, sexo, id_plan } = req.body;
        const pacienteQuery = 'INSERT INTO paciente (documento, nombre, apellido, fecha_nacimiento, sexo, id_plan, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const pacienteValues = [documento, nombre, apellido, fecha_nacimiento, sexo, id_plan, 1];
        await conexion.query(pacienteQuery, pacienteValues);

        res.redirect('/Pacientes?mensajeExito=Paciente agregado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al agregar el paciente' });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Función para actualizar un paciente y redirigir a la lista de pacientes
const actualizarPaciente = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const { documento, nombre, apellido, fecha_nacimiento, sexo, id_plan, estado } = req.body;
        const pacienteQuery = 'UPDATE paciente SET documento = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, sexo = ?, id_plan = ?, estado = ? WHERE id_paciente = ?';
        const pacienteValues = [documento, nombre, apellido, fecha_nacimiento, sexo, id_plan, estado, id];
        await conexion.query(pacienteQuery, pacienteValues);

        res.redirect('/Pacientes?mensajeExito=Paciente actualizado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el paciente' });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Función para editar un paciente
const editarPaciente = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const [paciente] = await conexion.query('SELECT * FROM paciente WHERE id_paciente = ? AND estado = 1', [id]);
        const [planes] = await conexion.query('SELECT * FROM plan');
        if (paciente.length === 0) {
            return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        }
        res.render('editarPaciente', { paciente: paciente[0], planes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al editar el paciente' });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Función para guardar la edición de un paciente
const guardarEdicionPaciente = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const { nombre, apellido, documento, fecha_nacimiento, sexo, id_plan, estado } = req.body;
        const query = 'UPDATE paciente SET nombre = ?, apellido = ?, documento = ?, fecha_nacimiento = ?, sexo = ?, id_plan = ?, estado = ? WHERE id_paciente = ?';
        const valores = [nombre, apellido, documento, fecha_nacimiento, sexo, id_plan, estado, id];
        await conexion.query(query, valores);
        res.redirect('/Pacientes?mensajeExito=Paciente editado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al guardar la edición del paciente' });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Función para eliminar un paciente y redirigir a la lista de pacientes
const eliminarPaciente = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const deleteQuery = 'UPDATE paciente SET estado = 0 WHERE id_paciente = ?';
        await conexion.query(deleteQuery, [id]);

        res.redirect('/Pacientes?mensajeExito=Paciente eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar el paciente' });
    } finally {
        if (conexion) await conexion.end();
    }
};

// Función para buscar pacientes
const buscarPacientes = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { filtro } = req.query;

        if (!filtro) {
            return res.render('buscarPaciente', { pacientes: [], filtro: '', mensaje: ' ' });
        }

        let consultaSQL = `
            SELECT p.*, pl.descripcion as plan_descripcion 
            FROM paciente p
            JOIN plan pl ON p.id_plan = pl.id_plan
            WHERE p.estado = 1 AND (p.documento LIKE ? OR p.apellido LIKE ? OR pl.descripcion LIKE ?)
        `;
        const valores = [`%${filtro}%`,`%${filtro}%`, `%${filtro}%`];
        const [pacientes] = await conexion.query(consultaSQL, valores);

        if (pacientes.length === 0) {
            return res.render('buscarPaciente', { pacientes: [], filtro, mensaje: 'No se encontraron pacientes con el filtro proporcionado' });
        }

        res.render('buscarPaciente', { pacientes, filtro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar pacientes' });
    } finally {
        if (conexion) await conexion.end();
    }
};

module.exports = {
    obtenerPacientes,
    agregarPaciente,
    actualizarPaciente,
    editarPaciente,
    guardarEdicionPaciente,
    eliminarPaciente,
    buscarPacientes,
};