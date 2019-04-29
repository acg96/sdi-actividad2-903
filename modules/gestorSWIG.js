module.exports = {
    swig: null,
    init: function (swig) {
        this.swig= swig;
    },
    renderTemplate: function (req, res, url, datos) {
        var auxUser = req.session.usuario;
        var usuario = null;
        if (auxUser != null) {
            usuario = {
                email: req.session.usuario.email,
                rol: req.session.usuario.rol,
                cartera: req.session.usuario.cartera
            };
        }
        datos.usuario = usuario;
        var respuesta = this.swig.renderFile(url, datos);
        res.send(respuesta);
    }
}
