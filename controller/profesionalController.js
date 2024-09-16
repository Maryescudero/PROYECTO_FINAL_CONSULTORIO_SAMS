// profesionalController.js

const createConnection = require('../js/config');

const obtenerProfesionales = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const [profesionales] = await conexion.query(`
            SELECT p.*, pr.descripcion AS profesion, e.descripcion AS especialidad
            FROM profesional p
            LEFT JOIN profesion pr ON p.id_profesional_profesion = pr.id_profesion
            LEFT JOIN especialidad e ON p.id_profesional_especialidad = e.id_especialidad
            WHERE p.estado = 1
        `);
        const [profesiones] = await conexion.query('SELECT * FROM profesion');
        const [especialidades] = await conexion.query('SELECT * FROM especialidad');

        res.render('profesional', { profesionales, profesiones, especialidades, mensajeExito: req.query.mensajeExito });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los profesionales');
    } finally {
        if (conexion) await conexion.end();
    }
};

const agregarProfesional = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { apellido, nombre, documento, matricula, domicilio, id_profesion, id_especialidad, id_refeps, estado } = req.body;
        const profesionalQuery = 'INSERT INTO profesional (apellido, nombre, documento, matricula, domicilio, id_profesional_profesion, id_profesional_especialidad, id_refeps, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const profesionalValues = [apellido, nombre, documento, matricula, domicilio, id_profesion, id_especialidad, id_refeps, estado];
        await conexion.query(profesionalQuery, profesionalValues);

        res.redirect('/profesionales?mensajeExito=Profesional agregado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al agregar el profesional' });
    } finally {
        if (conexion) await conexion.end();
    }
};

const actualizarProfesional = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const { apellido, nombre, documento, matricula, domicilio, id_profesion, id_especialidad, id_refeps, estado } = req.body;

        const updateQuery = `
            UPDATE profesional
            SET apellido = ?, nombre = ?, documento = ?, matricula = ?, domicilio = ?, id_profesional_profesion = ?, id_profesional_especialidad = ?, id_refeps = ?, estado = ?
            WHERE id_profesional = ?
        `;
        const updateValues = [apellido, nombre, documento, matricula, domicilio, id_profesion, id_especialidad, id_refeps, estado, id];

        await conexion.query(updateQuery, updateValues);

        res.redirect('/profesionales?mensajeExito=Profesional actualizado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al guardar los cambios del profesional' });
    } finally {
        if (conexion) await conexion.end();
    }
};

const eliminarProfesional = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const deleteQuery = 'UPDATE profesional SET estado = 0 WHERE id_profesional = ?';
        await conexion.query(deleteQuery, [id]);

        res.redirect('/profesionales?mensajeExito=Profesional eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al eliminar el profesional' });
    } finally {
        if (conexion) await conexion.end();
    }
};

const buscarProfesionalesPorEspecialidad = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { filtro } = req.query;

        if (!filtro) {
            return res.render('buscarProfesional', { profesionales: [], filtro: '' });
        }

        const consultaSQL = `
            SELECT p.*, pr.descripcion AS profesion, e.descripcion AS especialidad
            FROM profesional p
            LEFT JOIN profesion pr ON p.id_profesional_profesion = pr.id_profesion
            LEFT JOIN especialidad e ON p.id_profesional_especialidad = e.id_especialidad
            WHERE p.estado = 1 AND e.descripcion LIKE ?
        `;
        const valores = [`%${filtro}%`];
        const [profesionales] = await conexion.query(consultaSQL, valores);

        if (profesionales.length === 0) {
            return res.render('buscarProfesional', { profesionales: [], filtro, mensaje: 'No se encontraron profesionales con el filtro proporcionado' });
        }

        res.render('buscarProfesional', { profesionales, filtro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar profesionales por especialidad' });
    } finally {
        if (conexion) await conexion.end();
    }
};

const editarProfesional = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const [profesional] = await conexion.query('SELECT * FROM profesional WHERE id_profesional = ?', [id]);
        if (profesional.length === 0) {
            return res.status(404).json({ mensaje: 'Profesional no encontrado' });
        }

        const [listaProfesiones] = await conexion.query('SELECT * FROM profesion');
        const [listaEspecialidades] = await conexion.query('SELECT * FROM especialidad');

        res.render('editarProfesional', {
            profesional: profesional[0],
            listaProfesiones,
            listaEspecialidades
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener el profesional'});
    }finally{
        if(conexion) await conexion.end();
    }
};

const guardarEdicionProfesional = async (req, res) => {
    let conexion;
    try {
        conexion = await createConnection();
        const { id } = req.params;
        const { apellido, nombre, documento, matricula, domicilio, id_profesion, id_especialidad, id_refeps, estado } = req.body;

        const updateQuery = `
            UPDATE profesional
            SET apellido = ?, nombre = ?, documento = ?, matricula = ?, domicilio = ?, id_profesional_profesion = ?, id_profesional_especialidad = ?, id_refeps = ?, estado = ?
            WHERE id_profesional = ?
        `;
        const updateValues = [apellido, nombre, documento, matricula, domicilio, id_profesion, id_especialidad, id_refeps, estado, id];

        await conexion.query(updateQuery, updateValues);

        res.redirect('/profesionales?mensajeExito=Profesional actualizado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al guardar los cambios del profesional' });
    } finally {
        if (conexion) await conexion.end();
    }
};



module.exports = {
    obtenerProfesionales,
    agregarProfesional,
    actualizarProfesional,
    eliminarProfesional,
    buscarProfesionalesPorEspecialidad,
    editarProfesional,
    guardarEdicionProfesional
};