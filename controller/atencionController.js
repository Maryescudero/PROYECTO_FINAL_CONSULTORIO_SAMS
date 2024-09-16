// atencionController.js


const createConnection = require('../js/config');

exports.mostrarAtencion = async (req, res) => {
    try {
        const connection = await createConnection();

        // Obtener datos necesarios de la base de datos
        const [profesionales] = await connection.query('SELECT * FROM profesional WHERE estado = 1');
        const [pacientes] = await connection.query('SELECT * FROM paciente WHERE estado = 1');
        const [medicamentos] = await connection.query('SELECT * FROM medicamento');
        const [especialidades] = await connection.query('SELECT * FROM especialidad');
        const [dosis] = await connection.query('SELECT * FROM dosis');
        const [frecuencias] = await connection.query('SELECT * FROM frecuencia');
        const [duraciones] = await connection.query('SELECT * FROM duracion');
        const [cantidades] = await connection.query('SELECT * FROM cantidad');
        const [prestaciones] = await connection.query('SELECT * FROM prestacion');
        const [examenes] = await connection.query('SELECT * FROM examen');
        const [lados] = await connection.query('SELECT * FROM lado');

        await connection.end();

        // Renderizar la vista de atención con los datos obtenidos
        res.render('atencion', {
            profesionales,
            pacientes,
            medicamentos,
            especialidades,
            dosis,
            frecuencias,
            duraciones,
            cantidades,
            prestaciones,
            examenes,
            lados,
            paciente: null
        });
    } catch (error) {
        console.error('Error al obtener datos de atención:', error);
        res.status(500).send('Error al obtener datos de atención');
    }
};

exports.buscarPaciente = async (req, res) => {
    try {
        const connection = await createConnection();

        const nombre = req.method === 'POST' ? req.body.nombre : req.query.nombre;

        // Imprimir el nombre del paciente que estamos buscando
        console.log("Nombre del paciente a buscar:", nombre);

        // Buscar paciente por nombre
        const [result] = await connection.query('SELECT * FROM paciente WHERE nombre = ?', [nombre]);

        // Imprimir los resultados de la consulta SQL
        console.log("Resultados de la consulta:", result);

        if (result.length === 0) {
            // No se encontró ningún paciente, renderizar la vista con un mensaje
            res.render('atencion', {
                pacientes: [],  // Puedes enviar un arreglo vacío o null
                mensaje: 'No se encontró ningún paciente con el nombre proporcionado.',
                profesionales: []  // Asegúrate de incluir profesionales aquí
            });
        } else {
            // Se encontró un paciente, renderizar la vista con el paciente encontrado
            const paciente = result[0];

            // Aquí debes obtener los profesionales nuevamente o almacenarlos en sesión
            const [profesionales] = await connection.query('SELECT * FROM profesional WHERE estado = 1');

            res.render('atencion', {
                profesionales,
                pacientes: [],  // Cargar estos datos nuevamente o almacenarlos en la sesión
                medicamentos: [],
                especialidades: [],
                dosis: [],
                frecuencias: [],
                duraciones: [],
                cantidades: [],
                prestaciones: [],
                examenes: [],
                lados: [],
                paciente
            });
        }

        await connection.end();
    } catch (error) {
        console.error('Error al buscar paciente:', error);
        res.status(500).json({ mensaje: 'Error al buscar paciente' });
    }
};
