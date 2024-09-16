// usuarioController.js

const bcrypt = require('bcrypt');
const createConnection = require('../js/config');
const saltRounds = 10;

// Funcion para mostrar el formulario de registro
exports.mostrarRegistro = (req, res) => {
  res.render('usuario/registro');
};

// Funcion para registrar nuevos usuarios
exports.registrarUsuario = async (req, res) => {
  const { nombre, apellido, funcion, usuario, password } = req.body;

  // Verificar que la función sea administrador o profesional
  if (funcion !== 'administrador' && funcion !== 'profesional') {
    return res.send('La función debe ser "administrador" o "profesional".');
  }

  try {
    const conexion = await createConnection();

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO usuario (nombre, apellido, funcion, usuario, password) VALUES (?, ?, ?, ?, ?)';
    await conexion.query(query, [nombre, apellido, funcion, usuario, hashedPassword]);

    // Redireccionar al usuario al login con un mensaje de exito
    res.redirect('/Usuarios/login?registered=true');
    await conexion.end();
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.send('Error al registrar el usuario.');
  }
};

// Funcion para mostrar el formulario de inicio de sesion
exports.mostrarLogin = (req, res) => {
  res.render('usuario/login');
};

// Funcion para procesar el inicio de sesion
exports.procesarLogin = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const conexion = await createConnection();
    const [results] = await conexion.query('SELECT * FROM usuario WHERE usuario = ?', [usuario]);

    if (results.length === 0) {
      await conexion.end();
      return res.render('usuario/login', { errorMessage: 'Usuario o contraseña incorrectos.' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      await conexion.end();
      return res.render('usuario/login', { errorMessage: 'Usuario o contraseña incorrectos.' });
    }

    req.session.loggedin = true;
    req.session.usuario = user;

    await conexion.end();
    return res.redirect('/sala');
  } catch (error) {
    console.error('Error al procesar el inicio de sesión:', error);
    return res.render('usuario/login', { errorMessage: 'Error al procesar el inicio de sesión.' });
  }
};

// Funcion para mostrar el dashboard
exports.mostrarDashboard = (req, res) => {
  if (req.session.loggedin) {
    res.render('usuario/dashboard', { usuario: req.session.usuario });
  } else {
    res.send('Por favor, inicie sesión para ver esta página.');
  }
};

// Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error al cerrar sesión.');
    }
    res.redirect('/Usuarios/login');
  });
};






