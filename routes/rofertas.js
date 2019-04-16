module.exports = function (app, swig, gestorBD, logger, mongo) {
    app.get("/oferta/add", function (req, res) {
        var moment = app.get('moment');
        var fechaActual = moment().format("DD-MM-YYYY");
        var respuesta = swig.renderFile('views/offer/add.html', {usuario: req.session.usuario, fechaActual: fechaActual});
        res.send(respuesta);
    });

    app.post("/oferta/add", function (req, res) {
        var ofertaAValidar = {
            titulo: req.body.title,
            detalles: req.body.details,
            fecha: req.body.date,
            precio: req.body.price,
            destacada: req.body.star
        }
        var rValidator = require("../validators/rOfertasValidator");
        rValidator.validarAlta(app, ofertaAValidar, req.session.usuario, function (errors){
            if (errors.anyError === 0) {
                var oferta = {
                    titulo: req.body.title.trim(),
                    detalles: req.body.details.trim(),
                    fecha: req.body.date.trim(),
                    precio: parseFloat(req.body.price),
                    destacada: req.body.star,
                    propietario: req.session.usuario._id
                }
                gestorBD.insertarOferta(oferta, function (id) {
                    if (id == null) {
                        logger.info("Se ha producido un error desconocido en la bbdd al intentar guardar la oferta.");
                        res.redirect('/oferta/add');
                    } else {
                        logger.info("El usuario " + oferta.propietario + " ha registrado la oferta " + id.toString() + " (" + oferta.titulo + ") correctamente.");
                        if (oferta.destacada) {
                            req.session.usuario.cartera = Math.round(req.session.usuario.cartera - 20.0);
                            gestorBD.actualizarCarteraUsuario(req.session.usuario, function (result) {
                                res.redirect("/oferta/list");
                            });
                        } else {
                            res.redirect("/oferta/list");
                        }
                    }
                });
            } else {
                logger.info("Se han producido errores durante el alta de producto.");
                var moment = app.get('moment');
                var fechaActual = moment().format("DD-MM-YYYY");
                var respuesta = swig.renderFile('views/offer/add.html', {usuario: req.session.usuario, fechaActual: fechaActual, errors: errors});
                res.send(respuesta);
            }
        });
    });
};
