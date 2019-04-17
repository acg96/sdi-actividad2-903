module.exports = function (app, gestorBD, logger) {
    app.post('/api/autenticar', function (req, res) {
        if (req.body.password && req.body.user) {
            var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            var datos = {
                email: req.body.user,
                password: seguro
            };
            gestorBD.obtenerUsuarios(datos, function (usuarios) {
                if (usuarios != null && usuarios.length > 0) {
                    var token = app.get('jwt').sign({
                        usuario: datos.email,
                        tiempo: Date.now() / 1000
                    }, app.get('clave'));
                    res.status(200);
                    res.json({
                        autenticado: true,
                        token: token
                    });
                } else {
                    res.status(401);
                    res.json({autenticado: false});
                }
            });
        } else {
            res.status(401);
            res.json({autenticado: false});
        }
    });
};
