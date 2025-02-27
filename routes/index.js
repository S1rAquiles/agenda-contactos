var express = require('express');
var router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
//middleware para verificar cliente
const { verifyToken2 } = require('../bloqueo/JWT.js');
const { usuario, contrasena, secretKey2 } = process.env;
let login = false;

const baseDatosModels = require('../models/baseDeDatos.js');

const cookieParser = require('cookie-parser');
router.use(cookieParser());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  const { user, clave } = req.body;

  const dato = {
    usuario,
    contrasena
  };

  if (user === usuario && clave === contrasena) {
    const token = jwt.sign(dato, secretKey2, { expiresIn: 60 * 60 * 24 });
    // Guardar token en cookies
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.redirect('/agenda');
  } else {
    res.redirect('/error');
  }
});

router.get('/agenda', verifyToken2, (req, res) => {
  baseDatosModels.mostrar(req, res);
});

router.post('/addPost', (req, res) => {
  baseDatosModels.aggDato(req, res);
});

router.get('/add', verifyToken2, (req, res) => {
  res.render('add.ejs');
});

router.get('/prueba', (req, res) => {
  res.render('prueba.ejs');
});

//-------------------------------------------------------
// GET /editar/:id
router.get('/update/:id', verifyToken2, (req, res) => {
  baseDatosModels.mostrarUpdate(req, res);
});

//-------------------------------------------------------
// POST /editar/:id
router.post('/update/:id', (req, res) => {
  baseDatosModels.update(req, res);
});

//-------------------------------------------------------
// GET /eliminar/:id
router.get('/delete/:id', verifyToken2, (req, res) => {
  baseDatosModels.mostrarborrar(req, res);
});

//-------------------------------------------------------
// POST /eliminar/:id
router.post('/delete/:id', (req, res) => {
  baseDatosModels.borrar(req, res);
});

module.exports = router;
