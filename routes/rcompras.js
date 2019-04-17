module.exports = function (app, swig, gestorBD, logger) {

    app.get("/compra/add/:id", function (req, res) {
        var id = req.params.id;
        if (id != null) {
            gestorBD.obtenerOfertas({$and: [{_id: gestorBD.mongo.ObjectID(id)}, {propietario: {$not: {$eq: req.session.usuario._id.toString()}}}, {compra: null}]}, function (ofertas) {
                if (ofertas != null && ofertas.length > 0) {
                    if (req.session.usuario.cartera < ofertas[0].precio) {
                        logger.info("El usuario " + req.session.usuario.email + " no teniendo suficiente saldo ha solicitado comprar la oferta " + id);
                        req.session.saldoInsCompra= 1;
                        res.redirect('/oferta/search');
                    } else {
                        logger.info("El usuario " + req.session.usuario.email + " ha comprado la oferta " + id);
                        req.session.usuario.cartera = Math.round((req.session.usuario.cartera - parseFloat(ofertas[0].precio))*100)/100.0;
                        gestorBD.actualizarCarteraUsuario(req.session.usuario, function (result) {
                            ofertas[0].compra = req.session.usuario.email;
                            gestorBD.actualizarOfertaComprada(ofertas[0], function (result2){
                                res.redirect("/compra/list");
                            });
                        });
                    }
                } else {
                    res.redirect('/oferta/search');
                }
            });
        } else {
            res.redirect('/oferta/search');
        }
    });

    app.get("/compra/list", function (req, res) {
        gestorBD.obtenerOfertas({compra: req.session.usuario.email}, function (ofertas) {
            var offerList = [];
            if (ofertas != null) {
                var e = 0;
                for (var i= 0; i < ofertas.length; ++i) {
                    gestorBD.obtenerUsuarioOferta(ofertas[i], function (usuarios, oferta) {
                        if (usuarios != null) {
                            oferta.emailVendedor = usuarios[0].email;
                            offerList.push(oferta);
                        }
                        ++e;
                        if (e === ofertas.length) {
                            var respuesta = swig.renderFile('views/purchase/list.html', {usuario: req.session.usuario, purchaseList: offerList});
                            res.send(respuesta);
                        }
                    });
                }
                if (ofertas.length === 0) {
                    var respuesta = swig.renderFile('views/purchase/list.html', {
                        usuario: req.session.usuario,
                        purchaseList: offerList
                    });
                    res.send(respuesta);
                }
            } else {
                var respuesta = swig.renderFile('views/purchase/list.html', {
                    usuario: req.session.usuario,
                    purchaseList: offerList
                });
                res.send(respuesta);
            }
        });
    });
};
