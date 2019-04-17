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
            _id: this.gestorBD.mongo.ObjectID("5cb744a19ff21b3100f8315c"),
            email: "prueba@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Daniel",
            apellidos: "González",
            cartera: 100
        };

        var conver2 = {
            oferta: "5cb7558373269510e4010001",
            comprador: "5cb744a19ff21b3100f8315f",
            vendedor: "5cb744a19ff21b3100f8315c",
            vendedorEmail: "prueba@gmail.com"
        };
        this.gestorBD.insertarConversacion(conver2, function (id) {
            var mens5 = {
                contenido: "Hola 52",
                autorId: "5cb744a19ff21b3100f8315f",
                autorEmail: "prueba5@gmail.com",
                fecha: new Date().getTime(),
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315c"
            };
            this.gestorBD.insertarMensaje(mens5, function (idMess){});
            var mens6 = {
                contenido: "Buenas! 12",
                autorId: "5cb744a19ff21b3100f8315c",
                autorEmail: "prueba@gmail.com",
                fecha: new Date().getTime() + 1000,
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315f"
            };
            this.gestorBD.insertarMensaje(mens6, function (idMess){});
            var mens7 = {
                contenido: "¿Qué tal? 52",
                autorId: "5cb744a19ff21b3100f8315f",
                autorEmail: "prueba5@gmail.com",
                fecha: new Date().getTime()+2000,
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315c"
            };
            this.gestorBD.insertarMensaje(mens7, function (idMess){});
        }.bind(this));

        var conver4 = {
            oferta: "5cb7558373269510e400fffe",
            comprador: "5cb744a19ff21b3100f8315e",
            vendedor: "5cb744a19ff21b3100f8315a",
            vendedorEmail: "prueba2@gmail.com"
        };

        this.gestorBD.insertarConversacion(conver4, function (id) {
            var mens13 = {
                contenido: "Hola 34",
                autorId: "5cb744a19ff21b3100f8315e",
                autorEmail: "prueba3@gmail.com",
                fecha: new Date().getTime(),
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315a"
            };
            this.gestorBD.insertarMensaje(mens13, function (idMess){});
            var mens14 = {
                contenido: "Buenas! 24",
                autorId: "5cb744a19ff21b3100f8315a",
                autorEmail: "prueba2@gmail.com",
                fecha: new Date().getTime() + 1000,
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315e"
            };
            this.gestorBD.insertarMensaje(mens14, function (idMess){});
        }.bind(this));

        var conver8 = {
            oferta: "5cb7558373269510e4010000",
            comprador: "5cb744a19ff21b3100f8315c",
            vendedor: "5cb744a19ff21b3100f8315e",
            vendedorEmail: "prueba3@gmail.com"
        };

        this.gestorBD.insertarConversacion(conver8, function (id) {
            var mens29 = {
                contenido: "Hola 18",
                autorId: "5cb744a19ff21b3100f8315c",
                autorEmail: "prueba@gmail.com",
                fecha: new Date().getTime(),
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315e"
            };
            this.gestorBD.insertarMensaje(mens29, function (idMess){});
        }.bind(this));

        var conver10 = {
            oferta: "5cb7558373269510e4010006",
            comprador: "5cb744a19ff21b3100f8315a",
            vendedor: "5cb744a19ff21b3100f8315b",
            vendedorEmail: "prueba4@gmail.com"
        };

        this.gestorBD.insertarConversacion(conver10, function (id) {
            var mens37 = {
                contenido: "Hola 210",
                autorId: "5cb744a19ff21b3100f8315a",
                autorEmail: "prueba2@gmail.com",
                fecha: new Date().getTime(),
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315b"
            };
            this.gestorBD.insertarMensaje(mens37, function (idMess){});
        }.bind(this));

        var conver13 = {
            oferta: "5cb7558373269510e4010002",
            comprador: "5cb744a19ff21b3100f8315b",
            vendedor: "5cb744a19ff21b3100f8315f",
            vendedorEmail: "prueba5@gmail.com"
        };

        this.gestorBD.insertarConversacion(conver13, function (id) {
            var mens49 = {
                contenido: "Hola 413",
                autorId: "5cb744a19ff21b3100f8315b",
                autorEmail: "prueba4@gmail.com",
                fecha: new Date().getTime(),
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315f"
            };
            this.gestorBD.insertarMensaje(mens49, function (idMess){});
            var mens50 = {
                contenido: "Buenas! 513",
                autorId: "5cb744a19ff21b3100f8315f",
                autorEmail: "prueba5@gmail.com",
                fecha: new Date().getTime() + 1000,
                conversacionId: id.toString(),
                leido: false,
                receptorId: "5cb744a19ff21b3100f8315b"
            };
            this.gestorBD.insertarMensaje(mens50, function (idMess){});
        }.bind(this));

        var user2 = {
            _id: this.gestorBD.mongo.ObjectID("5cb744a19ff21b3100f8315a"),
            email: "prueba2@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Sara",
            apellidos: "García",
            cartera: 100
        };
        var user3 = {
            _id: this.gestorBD.mongo.ObjectID("5cb744a19ff21b3100f8315e"),
            email: "prueba3@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Sofía",
            apellidos: "Zamora",
            cartera: 100
        };
        var user4 = {
            _id: this.gestorBD.mongo.ObjectID("5cb744a19ff21b3100f8315b"),
            email: "prueba4@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Raul",
            apellidos: "Rodríguez",
            cartera: 100
        };
        var user5 = {
            _id: this.gestorBD.mongo.ObjectID("5cb744a19ff21b3100f8315f"),
            email: "prueba5@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Lucía",
            apellidos: "Méndez",
            cartera: 100
        };
        var user6 = {
            _id: this.gestorBD.mongo.ObjectID("5cb744a19ff21b3100f8315d"),
            email: "prueba6@gmail.com",
            password: this.app.get("crypto").createHmac('sha256', this.app.get('clave'))
                .update("123456").digest('hex'),
            rol: "estandar",
            nombre: "Josefa",
            apellidos: "Méndez",
            cartera: 20
        };
        this.logger.info("El usuario " + user1.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user1, function (id) {
            var offer1 = {
                titulo: "Producto 1",
                detalles: "Hecho de madera",
                fecha: "26-02-2019",
                precio: 2.4,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba2@gmail.com"
            };
            this.gestorBD.insertarOferta(offer1, function (id) {});
            var offer2 = {
                _id: this.gestorBD.mongo.ObjectID("5cb7558373269510e4010001"),
                titulo: "Producto 2",
                detalles: "Hecho de metal",
                fecha: "15-01-2018",
                precio: 0.90,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba2@gmail.com"
            };
            this.gestorBD.insertarOferta(offer2, function (id) {});
            var offer3 = {
                titulo: "Producto 3",
                detalles: "Hecho de hierro",
                fecha: "31-12-2017",
                precio: 58.40,
                destacada: null,
                propietario: id.toString(),
                destacada: "on"
            };
            this.gestorBD.insertarOferta(offer3, function (id) {});
        }.bind(this));
        this.logger.info("El usuario " + user2.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user2, function (id) {
            var offer1 = {
                _id: this.gestorBD.mongo.ObjectID("5cb7558373269510e400fffe"),
                titulo: "Producto 4",
                detalles: "Hecho de plástico",
                fecha: "15-01-2019",
                precio: 14.59,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer1, function (id) {});
            var offer2 = {
                titulo: "Producto 5",
                detalles: "Hecho de papel",
                fecha: "18-01-2019",
                precio: 37.10,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba5@gmail.com"
            };
            this.gestorBD.insertarOferta(offer2, function (id) {});
            var offer3 = {
                titulo: "Producto 6",
                detalles: "Hecho de cartón",
                fecha: "24-02-2019",
                precio: 4.50,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba5@gmail.com",
                destacada: "on"
            };
            this.gestorBD.insertarOferta(offer3, function (id) {});
        }.bind(this));
        this.logger.info("El usuario " + user3.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user3, function (id) {
            var offer1 = {
                titulo: "Producto 7",
                detalles: "Hecho de barro",
                fecha: "02-05-2018",
                precio: 60.0,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer1, function (id) {});
            var offer2 = {
                _id: this.gestorBD.mongo.ObjectID("5cb7558373269510e4010000"),
                titulo: "Producto 8",
                detalles: "Hecho de cerámica",
                fecha: "26-02-2019",
                precio: 13.90,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba4@gmail.com"
            };
            this.gestorBD.insertarOferta(offer2, function (id) {});
            var offer3 = {
                titulo: "Producto 16",
                detalles: "Hecho de mensajes",
                fecha: "10-01-2021",
                precio: 10.72,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer3, function (id) {});
            var offer4 = {
                titulo: "Producto 9",
                detalles: "Hecho de barro",
                fecha: "21-02-2019",
                precio: 12.43,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba4@gmail.com"
            };
            this.gestorBD.insertarOferta(offer4, function (id) {});
        }.bind(this));
        this.logger.info("El usuario " + user4.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user4, function (id) {
            var offer1 = {
                _id: this.gestorBD.mongo.ObjectID("5cb7558373269510e4010006"),
                titulo: "Producto 10",
                detalles: "Hecho de aglomerado",
                fecha: "13-05-2019",
                precio: 12.60,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba@gmail.com"
            };
            this.gestorBD.insertarOferta(offer1, function (id) {});
            var offer2 = {
                titulo: "Producto 11",
                detalles: "Hecho de espuma",
                fecha: "10-10-2019",
                precio: 4.50,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba@gmail.com"
            };
            this.gestorBD.insertarOferta(offer2, function (id) {});
            var offer3 = {
                titulo: "Producto 12",
                detalles: "Hecho de poliuretano",
                fecha: "05-10-2017",
                precio: 60.50,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer3, function (id) {});
        }.bind(this));
        this.logger.info("El usuario " + user5.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user5, function (id) {
            var offer1 = {
                _id: this.gestorBD.mongo.ObjectID("5cb7558373269510e4010002"),
                titulo: "Producto 13",
                detalles: "Hecho de serrín",
                fecha: "02-12-2019",
                precio: 10.86,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer1, function (id) {});
            var offer2 = {
                titulo: "Producto 14",
                detalles: "Hecho de vinilo",
                fecha: "19-12-2014",
                precio: 4.53,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba3@gmail.com"
            };
            this.gestorBD.insertarOferta(offer2, function (id) {});
            var offer3 = {
                titulo: "Producto 15",
                detalles: "Hecho de corcho",
                fecha: "10-04-2020",
                precio: 10.72,
                destacada: null,
                propietario: id.toString(),
                compra: "prueba3@gmail.com",
                destacada: "on"
            };
            this.gestorBD.insertarOferta(offer3, function (id) {});
        }.bind(this));
        this.logger.info("El usuario " + user6.email + " ha sido generado.");
        this.gestorBD.insertarUsuario(user6, function (id) {
            var offer2 = {
                titulo: "Producto 17",
                detalles: "Prueba de destacar con 20€",
                fecha: "10-01-2021",
                precio: 10.72,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer2, function (id) {});
            var offer3 = {
                titulo: "Producto 18",
                detalles: "Prueba de destacar con menos de 20€",
                fecha: "10-01-2021",
                precio: 10.72,
                destacada: null,
                propietario: id.toString()
            };
            this.gestorBD.insertarOferta(offer3, function (id) {});
        }.bind(this));
    }
}
