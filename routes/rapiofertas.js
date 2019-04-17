module.exports = function (app, gestorBD, logger) {
    app.get('/api/oferta', function (req, res) {
        gestorBD.obtenerOfertas({propietario: {$not: {$eq: res.idUsuario}}}, function (ofertas) {
            if (ofertas != null){
                res.status(200);
                res.send(JSON.stringify(ofertas));
            } else {
                res.status(500);
                res.json({ error : "Se ha producido un error" });
            }
        });
    });
};
