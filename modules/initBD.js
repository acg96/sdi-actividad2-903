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
    },
    generateData: function () {
        this.gestorBD.obtenerUsuarios({email: "admin@email.com"}, function(usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                this.generateAdmin();
            }
        }.bind(this));
        var user1 = {
            email: "prueba@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Daniel",
            apellidos: "González",
            cartera: 100
        };
        var user2 = {
            email: "prueba2@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Sara",
            apellidos: "García",
            cartera: 100
        };
        var user3 = {
            email: "prueba3@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Sofía",
            apellidos: "Zamora",
            cartera: 100
        };
        var user4 = {
            email: "prueba4@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Raul",
            apellidos: "Rodríguez",
            cartera: 100
        };
        var user5 = {
            email: "prueba5@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Lucía",
            apellidos: "Méndez",
            cartera: 100
        };
        var user6 = {
            email: "prueba6@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Josefa",
            apellidos: "Méndez",
            cartera: 20
        };
        this.logger.info("El usuario " + user1.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user1, function (id) {});
        this.logger.info("El usuario " + user2.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user2, function (id) {});
        this.logger.info("El usuario " + user3.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user3, function (id) {});
        this.logger.info("El usuario " + user4.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user4, function (id) {});
        this.logger.info("El usuario " + user5.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user5, function (id) {});
        this.logger.info("El usuario " + user6.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user6, function (id) {});
    }
}
