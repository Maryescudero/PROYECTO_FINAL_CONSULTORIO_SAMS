//config.js - carpeta js


const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'centro_sams'
            
        });
        console.log('Conexión exitosa a la base de datos!! FELICITACIONES');
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw err;
    }
}

module.exports = createConnection;


