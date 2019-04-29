module.exports = function (app, swig, logger, gestorBD, initBD) {
    app.get('/', function (req, res) {
        if (req.session.usuario) {
            res.redirect("/home");
        } else {
            res.redirect('/principal');
        }
    });

    app.get("/error", function (req, res) {
        if (req.session.checkError === 9999) {
            req.session.checkError= null;
            var status = req.query.status;
            logger.info("Se ha producido un error " + status);
            if (status) {
                var error = "Error " + status;
                if (status === "403") {
                    error += ": Acceso denegado";
                } else if (status === "404") {
                    error += ": No existe la página o el recurso indicado";
                } else if (status === "500") {
                    error += ": Se ha producido un error inesperado";
                }
                swig.renderTemplate(req, res, 'views/error.html', {errorType: error});
            } else {
                swig.renderTemplate(req, res, 'views/error.html', {});
            }
        } else {
            res.redirect('/');
        }
    });

    app.get("/home", function (req, res) {
        var offerList = [];
        gestorBD.obtenerOfertas({$and:[{propietario: {$not: {$eq: req.session.usuario._id.toString()}}}, {destacada: 'on'}]}, function (ofertas){
            if (ofertas != null) {
                offerList = ofertas;
            }
            swig.renderTemplate(req, res, 'views/home.html', {offerList: offerList});
        });
    });

    app.get("/principal", function (req, res) {
        swig.renderTemplate(req, res, 'views/index.html', {});
    });

    app.get("/reset", function (req, res) {
        logger.info("Se ha reestablecido la BBDD");
        gestorBD.resetMongo(function (result) {
            req.session.usuario = null;
            initBD.generateData();
            res.redirect("/");
        });
    });
};
