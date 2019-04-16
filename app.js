// Modulos y variables globales
var express = require('express');
var app = express();
var loggerLib = require('log4js');
var logger = loggerLib.getLogger("wallapop");
logger.level = 'all';
var bodyParser = require('body-parser');
var swig = require('swig');
var crypto = require('crypto');
var mongo = require('mongodb');
var moment = require('moment');
app.set('moment', moment);
var gestorBD = require("./modules/gestorBD.js");
var initBD = require("./modules/initBD.js");
gestorBD.init(app, mongo);
initBD.init(app, gestorBD, logger);
var expressSession = require('express-session');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));
app.set('db', 'mongodb://admin:sdi@tiendamusica-shard-00-00-s0nh9.mongodb.net:27017,tiendamusica-shard-00-01-s0nh9.mongodb.net:27017,tiendamusica-shard-00-02-s0nh9.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true');
app.set('port', 8081);
app.set('clave', 'abcdefg');
app.set('crypto', crypto);
app.use(express.static('public'));

// router acciones realizadas
var routerAccionesRealizadas = express.Router();
routerAccionesRealizadas.use(function(req, res, next) {
    var urlSolicitada = req.originalUrl;
    var usuario = req.session.usuario == null ? "" : req.session.usuario.email;
    var cadena = "Estando no identificado se ";
    if (usuario != "") {
        cadena = "El usuario " + usuario + " ";
    }
    cadena += "ha solicitado acceso a " + urlSolicitada;
    logger.info(cadena);
    next();
});
// aplicar router acciones realizadas
app.use("/*", routerAccionesRealizadas);

// router usuario no identificado
var routerUsuarioNoIdentificado = express.Router();
routerUsuarioNoIdentificado.use(function (req, res, next) {
    if (!req.session.usuario) {
        next();
    } else {
        logger.info("Usuario autenticado ha solicitado acceso a recurso de usuarios no autenticados");
        res.redirect("/");
    }
});
// aplicar router de usuario no identificado
app.use("/identificarse", routerUsuarioNoIdentificado);
app.use("/registrarse", routerUsuarioNoIdentificado);

// router usuario identificado
var routerUsuarioIdentificado = express.Router();
routerUsuarioIdentificado.use(function (req, res, next) {
    if (req.session.usuario) {
        next();
    } else {
        logger.info("Usuario no autenticado ha solicitado acceso a recurso que requiere autenticación");
        res.redirect("/identificarse");
    }
});
//Aplicar router Usuario identificado
app.use("/oferta/*", routerUsuarioIdentificado);
app.use("/compra/*", routerUsuarioIdentificado);
app.use("/usuario/*", routerUsuarioIdentificado);
app.use("/desconectarse", routerUsuarioIdentificado);
app.use("/home", routerUsuarioIdentificado);

// router usuario administrador
var routerUsuarioAdministrador = express.Router();
routerUsuarioAdministrador.use(function (req, res, next) {
    if (req.session.usuario) {
        if (req.session.usuario.rol === "administrador") {
            next();
        } else {
            logger.info("El usuario " + req.session.usuario.email + " ha solicitado acceso a una zona restringida a administradores");
            req.session.checkError= 9999;
            res.redirect("/error?status=403")
        }
    } else {
        res.redirect("/identificarse");
    }
});
// Aplicar router usuario administrador
app.use("/usuario/*", routerUsuarioAdministrador);

// router usuario estandar
var routerUsuarioEstandar = express.Router();
routerUsuarioEstandar.use(function (req, res, next) {
    if (req.session.usuario) {
        if (req.session.usuario.rol === "estandar") {
            next();
        } else {
            logger.info("El usuario " + req.session.usuario.email + " ha solicitado acceso a una zona restringida a usuarios estandar");
            req.session.checkError= 9999;
            res.redirect("/error?status=403")
        }
    } else {
        res.redirect("/identificarse");
    }
});
// Aplicar router usuario estandar
app.use("/oferta/*", routerUsuarioEstandar);
app.use("/compra/*", routerUsuarioEstandar);



//Rutas
require("./routes/rusuarios.js")(app, swig, gestorBD, logger);
require("./routes/rapp")(app, swig, logger, gestorBD, initBD);
require("./routes/rofertas.js")(app, swig, gestorBD, logger);
//require("./routes/rcompras.js")(app, swig, gestorBD, logger);



// Redireccion de páginas no encontradas
app.use(function(req, res) {
    req.session.checkError= 9999;
    res.redirect('/error?status=404');
});


// Gestión de errores
app.use(function (err, req, res, next) {
    logger.info("Error producido " + err);
    req.session.checkError= 9999;
    res.redirect("/error?status=500");
});

// lanzar el servidor
app.listen(app.get('port'), function () {
    initBD.generateAdmin();
    logger.info("Servidor activo");
});
