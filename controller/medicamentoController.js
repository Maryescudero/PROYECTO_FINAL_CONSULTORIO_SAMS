// medicamentoController.js

const createConnection = require('../js/config');

// Función para guardar un medicamento
exports.guardarMedicamento = async (req, res) => {
    const { nombre_generico, nombre_comercial, id_categoria, id_familia, activo } = req.body;

    try {
        const connection = await createConnection();

        // agregar medicamento
        const query = `
            INSERT INTO medicamento (nombre_generico, nombre_comercial, id_categoria, id_familia, activo)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.query(query, [nombre_generico, nombre_comercial, id_categoria, id_familia, activo]);

        await connection.end();

        res.redirect('/medicamentos?mensajeExito=Medicamento agregado correctamente')
    } catch (error) {
        console.error('Error al guardar medicamento:', error);
        res.status(500).send('Error al guardar medicamento');
    }
};

// Función para obtener categorías desde la base de datos
exports.getCategorias = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM categoria');
        await connection.end();
        return rows; // Devuelve un array de categorías obtenidas
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error; // Manejo de errores o lanzamiento de excepciones
    }
};

// Función para obtener todos los medicamentos con detalles
exports.listarMedicamentos = async (req, res) => {
    try {
        const connection = await createConnection();

        // Consultar todos los medicamentos con detalles
        const query = `
            SELECT m.id_medicamento, m.nombre_generico, m.nombre_comercial,
                c.categoria, f.familia, m.activo
            FROM medicamento m
            INNER JOIN categoria c ON m.id_categoria = c.id_categoria
            INNER JOIN familia f ON m.id_familia = f.id_familia
        `;
        const [medicamentos] = await connection.query(query);

        await connection.end();


  
         res.render('listarMedicamento', { medicamentos }); // Pasamos los datos a la vista Pug
        } catch (error) {
            console.error('Error al listar medicamentos:', error);
            res.status(500).send('Error al listar medicamentos');
        }
};

// Función para actualizar un medicamento
exports.actualizarMedicamento = async (req, res) => {
    const { id_medicamento } = req.params;
    const { nombre_generico, nombre_comercial, id_categoria, id_familia, activo } = req.body;

    try {
        const connection = await createConnection();

        // Actualizar el medicamento en la base de datos
        const query = `
            UPDATE medicamento
            SET nombre_generico = ?, nombre_comercial = ?, id_categoria = ?, id_familia = ?, activo = ?
            WHERE id_medicamento = ?
        `;
        await connection.query(query, [nombre_generico, nombre_comercial, id_categoria, id_familia, activo, id_medicamento]);

        await connection.end();

        res.send('Medicamento actualizado correctamente');
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        res.status(500).send('Error al actualizar medicamento');
    }
};

// Función para eliminar un medicamento
exports.eliminarMedicamento = async (req, res) => {
    const { id_medicamento } = req.params;

    try {
        const connection = await createConnection();

        // Eliminar el medicamento de la base de datos
        const query = 'DELETE FROM medicamento WHERE id_medicamento = ?';
        await connection.query(query, [id_medicamento]);

        await connection.end();

        res.send('Medicamento eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        res.status(500).send('Error al eliminar medicamento');
    }
};
