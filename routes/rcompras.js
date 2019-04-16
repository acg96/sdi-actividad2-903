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
};
