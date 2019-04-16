module.exports = function (app, swig, gestorBD, logger) {
    app.get("/registrarse", function (req, res) {
        var respuesta = swig.renderFile('views/signup.html', {usuario: req.session.usuario});
        res.send(respuesta);
    });

    app.post("/registrarse", function (req, res) {
        var usuarioAValidar = {
            email: req.body.email,
            password: req.body.password,
            passwordRepeated: req.body.passwordConfirm,
            nombre: req.body.name,
            apellidos: req.body.lastName
        }
        var rValidator = require("../validators/rUsuariosValidator");
        rValidator.validarRegistro(usuarioAValidar, gestorBD, function (errors){
            if (errors.anyError === 0) {
                var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                    .update(req.body.password.trim()).digest('hex');
                var usuario = {
                    email: req.body.email.trim(),
                    password: seguro,
                    rol: "estandar",
                    nombre: req.body.name.trim(),
                    apellidos: req.body.lastName.trim(),
                    cartera: 100.0
                }
                gestorBD.insertarUsuario(usuario, function (id) {
                    if (id == null) {
                        logger.info("Se ha producido un error desconocido en la bbdd al intentar registrar al usuario " + usuario.email + ".");
                        var respuesta = swig.renderFile('views/signup.html', {mensaje: "Error al insertar el usuario", usuario: req.session.usuario});
                        res.send(respuesta);
                    } else {
                        logger.info("El usuario " + usuario.email + " se ha registrado correctamente.");
                        usuario.id = id.toString();
                        req.session.usuario = usuario;
                        res.redirect("/home");
                    }
                });
            } else {
                logger.info("Se han producido errores durante el registro. Email: " + usuarioAValidar.email);
                var respuesta = swig.renderFile('views/signup.html', {errors: errors, usuario: req.session.usuario});
                res.send(respuesta);
            }
        });
    });

    app.get("/identificarse", function (req, res) {
        var respuesta = swig.renderFile('views/login.html', {usuario: req.session.usuario, error: 0});
        res.send(respuesta);
    });

    app.post("/identificarse", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password.trim()).digest('hex');
        var usuario = {
            email: req.body.username,
            password: seguro
        };
        gestorBD.obtenerUsuarios(usuario, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                logger.info("Inicio de sesión incorrecto. Email: " + usuario.email);
                req.session.usuario = null;
                var respuesta = swig.renderFile('views/login.html', {usuario: req.session.usuario, error: 1});
                res.send(respuesta);
            } else {
                logger.info("El usuario " + usuario.email + " ha iniciado sesión.");
                req.session.usuario = usuarios[0];
                res.redirect("/home");
            }
        });
    });

    app.get("/desconectarse", function (req, res) {
        logger.info("El usuario " + req.session.usuario.email + " se ha desconectado.");
        req.session.usuario = null;
        res.redirect("/identificarse");
    });

    app.get("/usuario/list", function (req, res) {
        gestorBD.obtenerUsuarios({}, function(usuarios){
            var users = [];
            if (usuarios != null) {
                users = usuarios;
            }
            var respuesta = swig.renderFile('views/user/list.html', {usuario: req.session.usuario, usersList: users});
            res.send(respuesta);
        });
    });

    app.post("/usuario/remove", function (req, res) {
        var deleted = null;
        var criterio = {$or: []};
        var cantidad = 0;
        for (key in req.body) {
            if (req.session.usuario._id.toString() !== key.toString()) {
                cantidad++;
                criterio.$or.push({_id: gestorBD.mongo.ObjectID(key)});
                criterio.$or.push({propietario: key});
                logger.info("Se procede a borrar el usuario con id " + key);
            }
        }
        gestorBD.borrarUsuario(criterio, function (result){
            if (result == null){
                deleted = "Debe seleccionar alguna de las opciones";
            } else if (result !== cantidad) {
                deleted = "No se han podido eliminar todos los usuarios seleccionados";
            } else {
                deleted = "Se han borrado correctamente los usuarios seleccionados";
            }
            gestorBD.obtenerUsuarios({}, function(usuarios){
                var users = [];
                if (usuarios != null) {
                    users = usuarios;
                }
                var respuesta = swig.renderFile('views/user/list.html', {usuario: req.session.usuario, usersList: users, deleted: deleted});
                res.send(respuesta);
            });
        });
    });
};
