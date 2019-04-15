module.exports = {
    app: null,
    gestorBD: null,
    logger: null,
    init: function (app, gestorBD, logger) {
        this.app = app;
        this.gestorBD = gestorBD;
        this.logger = logger;
    },
    generateAdmin: function () {
        var usuarioAdmin= {
            email: "admin@email.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("admin").digest('hex'),
            rol: "administrador",
            nombre: "Administrador",
            apellidos: ""
        };
        this.gestorBD.obtenerUsuarios({email: "admin@email.com"}, function(usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                this.logger.info("El usuario admin@email.com ha sido generado.");
                this.gestorBD.insertarUsuario(usuarioAdmin, function (id) {});
            }
        }.bind(this));
    }
}
