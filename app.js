// Modulos y variables globales
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
app.set('jwt', jwt);
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
var gestorSwig = require("./modules/gestorSWIG.js");
gestorBD.init(app, mongo);
initBD.init(app, gestorBD, logger);
gestorSwig.init(swig);
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
routerAccionesRealizadas.use(function (req, res, next) {
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

// router cabeceras APIREST
var routerCabecerasAPI = express.Router();
routerCabecerasAPI.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    next();
});
app.use("/api/*", routerCabecerasAPI);

// router autenticar token APIREST
var routerTokenAPI = express.Router();
routerTokenAPI.use(function (req, res, next) {
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        jwt.verify(token, app.get('clave'), function (err, info) {
            if (err || (Date.now() / 1000 - info.tiempo) > 600 || !info.usuario || !info.idUsuario) {
                logger.info("Se ha proporcionado un token inválido o caducado");
                res.status(403);
                res.json({acceso: false, error: 'Token invalido o caducado'});
            } else {
                logger.info("Se ha validado el token correctamente, usuario " + info.usuario);
                res.usuario = info.usuario;
                res.idUsuario = info.idUsuario;
                next();
            }
        });
    } else {
        logger.info("Se ha tratado de acceder a un recurso restringido sin proporcionar un token");
        res.status(403);
        res.json({acceso: false, error: 'No hay Token'});
    }
});
app.use("/api/oferta*", routerTokenAPI);
app.use("/api/mensaje*", routerTokenAPI);
app.use("/api/conversacion*", routerTokenAPI);

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
            req.session.checkError = 9999;
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
            req.session.checkError = 9999;
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
require("./routes/rusuarios.js")(app, gestorSwig, gestorBD, logger);
require("./routes/rapp")(app, gestorSwig, logger, gestorBD, initBD);
require("./routes/rofertas.js")(app, gestorSwig, gestorBD, logger);
require("./routes/rcompras.js")(app, gestorSwig, gestorBD, logger);
require("./routes/rapiusuarios.js")(app, gestorBD, logger);
require("./routes/rapiofertas.js")(app, gestorBD, logger);
require("./routes/rapimensajes.js")(app, gestorBD, logger);


// Redireccion de páginas no encontradas
app.use(function (req, res) {
    req.session.checkError = 9999;
    res.redirect('/error?status=404');
});


// Gestión de errores
app.use(function (err, req, res, next) {
    logger.info("Error producido " + err);
    req.session.checkError = 9999;
    res.redirect("/error?status=500");
});

// lanzar el servidor
app.listen(app.get('port'), function () {
    initBD.generateAdmin();
    logger.info("Servidor activo");
});
