module.exports = function (app, gestorBD, logger) {
    app.post('/api/autenticacion', function (req, res) {
        if (req.body.password && req.body.user) {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var datos = {
                email: req.body.user,
                password: seguro
            };
            gestorBD.obtenerUsuarios(datos, function (usuarios) {
                if (usuarios != null && usuarios.length > 0 && usuarios[0].rol === "estandar") {
                    var token = app.get('jwt').sign({
                        usuario: datos.email,
                        tiempo: Date.now() / 1000,
                        idUsuario: usuarios[0]._id.toString()
                    }, app.get('clave'));
                    logger.info("Usuario autenticado en API REST " + datos.email);
                    res.status(200);
                    res.json({
                        autenticado: true,
                        token: token
                    });
                } else {
                    logger.info("Intento de autenticación en API REST proporcionando datos inválidos " + datos.email);
                    res.status(401);
                    res.json({autenticado: false});
                }
            });
        } else {
            logger.info("Intento de autenticación en API REST sin proporcionar datos.");
            res.status(401);
            res.json({autenticado: false});
        }
    });
};
