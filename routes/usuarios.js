var express = require('express');
var router = express.Router();
const usuarios = require('../usuarios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('usuarios');
});

router.get('/dadosusuarios', function(req, res, next) {
  
  res.status(200);
  res.json(usuarios.consultaUsuarios());   
  
});

module.exports = router;
