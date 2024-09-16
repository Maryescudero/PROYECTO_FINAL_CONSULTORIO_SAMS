
//index.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'vistas'));

//  archivos estáticos
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));



// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para soportar otros metodos HTTP como PUT y DELETE
app.use(methodOverride('_method'));

// Configurar sesiones
app.use(session({
  secret: 'secreto', // Cambia esto por una cadena secreta segura
  resave: false,
  saveUninitialized: true
}));

// Middleware para proteger rutas
const requireLogin = (req, res, next) => {
  if (!req.session.loggedin) {
    return res.redirect('/Usuarios/login');
  }
  next();
};

// Importar las rutas
const pacienteRouter = require('./router/pacienteRouter');
const usuarioRouter = require('./router/usuarioRouter');
const profesionalRouter = require('./router/profesionalRouter');
const atencionRouter=require('./router/atencionRouter');
const medicamentoRouter = require('./router/medicamentoRouter');

// Ruta para la pagina de dashboard (protegida)
app.get('/dashboard', requireLogin, (req, res) => {
  res.render('usuario/dashboard', { usuario: req.session.usuario });
});

// Usar las rutas
app.use('/Pacientes', pacienteRouter);
app.use('/Usuarios', usuarioRouter);
app.use('/Profesionales', profesionalRouter);
app.use('/Atencion', atencionRouter);
app.use('/Medicamentos', medicamentoRouter);


// Ruta para la pagina principal
app.get('/', (req, res) => {
  res.render('index', { usuario: req.session.usuario });
});

// Ruta para la pagina de pacientes
app.get('/pacientes', requireLogin, (req, res) => {
  if (req.session.usuario.funcion === 'administrador') {
    res.render('pacientes');
  } else {
    // Aquí decides que hacer cuando no es administrador
    // Por ejemplo, puedes renderizar la página de pacientes de manera diferente o redirigir a otra pagina
    res.render('pacientes_publico'); // Renderiza una version publica de la pagina de pacientes
  }
});

// Ruta para la pagina de salaController (protegida)
app.get('/sala', requireLogin, (req, res) => {
  res.render('sala', { usuario: req.session.usuario });
});

// Ruta para la pagina de atencion (protegida y solo para profesionales)
app.get('/Atencion', requireLogin, (req, res) => {
  if (req.session.usuario.funcion === 'profesional') {
    res.render('atencion');
  } else {
    res.send('Acceso denegado. Solo los profesionales pueden acceder a esta página.');
  }
});

//  cerrar sesion
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/Usuarios/login');
  });
});

//  carga de medicamentos
app.get('/CargaMedicamentos', (req, res) => {
  //  enviar cualquier dato adicional que necesites renderizar en la vista
  res.render('cargaMedicamento', { categorias: categorias, familias: familias });
});


// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});


