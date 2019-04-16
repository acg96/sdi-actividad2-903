module.exports = function (app, swig, gestorBD, logger) {
    app.get("/oferta/add", function (req, res) {
        var moment = app.get('moment');
        var fechaActual = moment().format("DD-MM-YYYY");
        var respuesta = swig.renderFile('views/offer/add.html', {usuario: req.session.usuario, fechaActual: fechaActual});
        res.send(respuesta);
    });

    app.get("/oferta/remove/:id", function (req, res) {
        var id = req.params.id;
        if (id != null) {
            gestorBD.borrarOfertas({$and: [{_id: gestorBD.mongo.ObjectID(id)}, {propietario: req.session.usuario._id.toString()}]}, function (result) {
                logger.info("El usuario " + req.session.usuario.email + " ha optado por borrar la oferta " + id);
                res.redirect('/oferta/list');
            });
        } else {
            res.redirect('/oferta/list');
        }
    });

    app.get("/oferta/star/:id", function (req, res) {
        var id = req.params.id;
        if (id != null) {
            gestorBD.obtenerOfertas({$and: [{_id: gestorBD.mongo.ObjectID(id)}, {propietario: req.session.usuario._id.toString()}, {destacada: null}]}, function (ofertas) {
                if (ofertas != null && ofertas.length > 0) {
                    if (req.session.usuario.cartera < 20) {
                        logger.info("El usuario " + req.session.usuario.email + " no teniendo suficiente saldo ha solicitado destacar la oferta " + id);
                        req.session.saldoIns= 0;
                        res.redirect('/oferta/list');
                    } else {
                        logger.info("El usuario " + req.session.usuario.email + " ha destacado la oferta " + id);
                        req.session.saldoIns= 1;
                        req.session.usuario.cartera = Math.round(req.session.usuario.cartera - 20.0);
                        gestorBD.actualizarCarteraUsuario(req.session.usuario, function (result) {
                            gestorBD.actualizarOfertaDestacada(ofertas[0], function (result2){
                                res.redirect("/oferta/list");
                            });
                        });
                    }
                } else {
                    res.redirect('/oferta/list');
                }
            });
        } else {
            res.redirect('/oferta/list');
        }
    });

    app.get("/oferta/search", function (req, res) {
        var search = '';
        if (req.query.searchText) {
            search = req.query.searchText.trim().toLowerCase();
            req.session.search = search;
        } else if (req.session.search == null) {
            req.session.search = '';
        } else if (req.query.pg == null) {
            req.session.search = '';
        } else {
            search = req.session.search;
        }
        var pg = 1;
        if (req.query.pg) {
            var aux = parseInt(req.query.pg);
            if (!isNaN(aux) && aux > 0) {
                pg = aux;
            }
        }
        gestorBD.obtenerOfertasPaginadas({$and:[{propietario: {$not: {$eq: req.session.usuario._id.toString()}}}, {titulo: {$regex: search, $options: 'i'}}]}, pg, function (ofertas, cantidad) {
            var offerList = [];
            if (ofertas != null) {
                offerList = ofertas;
            }
            page = {
                total: parseInt(cantidad / 5),
                actual: pg
            };
            if (cantidad % 5 > 0) {
                page.total = page.total + 1;
            }
            if (page.actual > page.total) {
                page.actual = page.total;
            }
            var respuesta = swig.renderFile('views/offer/search.html', {usuario: req.session.usuario, offerList: offerList, page: page, search: req.session.search});
            res.send(respuesta);
        });
    });

    app.get("/oferta/list", function (req, res) {
        gestorBD.obtenerOfertas({propietario: req.session.usuario._id.toString()}, function (ofertas) {
            var offerList = [];
            if (ofertas != null) {
                offerList = ofertas;
            }
            var errorStar = -1;
            if (req.session.saldoIns != null && req.session.saldoIns === 0) {
                req.session.saldoIns = null;
                errorStar = 1;
            } else if (req.session.saldoIns != null && req.session.saldoIns === 1) {
                req.session.saldoIns = null;
                errorStar = 0;
            }
            var respuesta = swig.renderFile('views/offer/list.html', {usuario: req.session.usuario, offerList: offerList, errorStar: errorStar});
            res.send(respuesta);
        });
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
                logger.info("Se han producido errores durante el alta del producto.");
                var moment = app.get('moment');
                var fechaActual = moment().format("DD-MM-YYYY");
                var respuesta = swig.renderFile('views/offer/add.html', {usuario: req.session.usuario, fechaActual: fechaActual, errors: errors});
                res.send(respuesta);
            }
        });
    });
};
