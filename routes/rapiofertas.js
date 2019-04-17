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

    app.put('/api/mensaje/:id', function (req, res) {
        if (req.params.id && req.params.id.length === 24) {
            gestorBD.obtenerMensaje({_id: gestorBD.mongo.ObjectID(req.params.id)}, function (mensajes) {
                if (mensajes != null && mensajes.length > 0) {
                    // Se comprueba que sea el receptor del mismo
                    if (mensajes[0].receptorId === res.idUsuario && !mensajes[0].leido) {
                        gestorBD.actualizarMensajeLeido(mensajes[0], function (cantidad) {
                            res.status(200);
                            res.json({ mensaje : "mensaje marcado como leído", _id : req.params.id });
                        });
                    } else {
                        res.status(403);
                        res.json({ error : "No es el receptor de este mensaje o ya se ha marcado como leido" });
                    }
                } else {
                    res.status(400);
                    res.json({ error : "No existe el mensaje indicado" });
                }
            });
        } else {
            res.status(400);
            res.json({ error : "No se han introducido los parámetros adecuados o el formato es incorrecto" });
        }
    });

    app.get('/api/mensaje', function (req, res) {
        if (req.query.idOferta) {
            gestorBD.obtenerConversaciones({$and: [{oferta: req.query.idOferta}, {$or: [{comprador: res.idUsuario}, {vendedor: res.idUsuario}]}]}, function (conversaciones) {
                if (conversaciones != null && conversaciones.length > 0) {
                    var listConvers = [];
                    for (var i = 0; i < conversaciones.length; ++i) {
                        gestorBD.obtenerMensajes(conversaciones[i], function(mensajes, conver) {
                            if (mensajes != null && mensajes.length > 0) {
                                conver.mensajes = mensajes;
                            }
                            listConvers.push(conver);
                            if (listConvers.length === conversaciones.length) {
                                res.status(200);
                                res.send(JSON.stringify(listConvers));
                            }
                        });
                    }
                } else {
                    res.status(200);
                    res.json({mensaje: "No se han encontrado conversaciones para la oferta indicada o puede que no sea partícipe en ellas"});
                }
            });
        } else {
            res.status(400);
            res.json({ error : "No se han introducido los parámetros adecuados" });
        }
    });

    app.post('/api/mensaje', function (req, res) {
        if (req.body.idOferta && req.body.idDestinatario && req.body.mensaje && req.body.mensaje.trim() !== '') {
            gestorBD.obtenerOfertas({_id: gestorBD.mongo.ObjectID(req.body.idOferta)}, function (ofertas) {
                if (ofertas == null || ofertas.length === 0 || ofertas[0].compra != null) {
                    res.status(400);
                    res.json({ error : "La oferta indicada no existe o ya ha sido comprada" });
                } else {
                    // Se comprueba que no trate de hablarse a el mismo
                    if (req.body.idDestinatario === res.idUsuario){
                        res.status(400);
                        res.json({ error : "No se puede enviar un mensaje a uno mismo" });
                    } else {
                        // Se comprueba que un comprador no trate de hablar a un usuario que no es dueño de la oferta
                        if (res.idUsuario !== ofertas[0].propietario && req.body.idDestinatario !== ofertas[0].propietario) {
                            res.status(400);
                            res.json({ error : "El usuario indicado no encaja con el dueño de la oferta suministrada" });
                        } else {
                            var criterio = {
                                oferta: req.body.idOferta
                            };
                            if (req.body.idDestinatario !== ofertas[0].propietario) {
                                criterio.comprador = req.body.idDestinatario;
                                criterio.vendedor = res.idUsuario;
                            } else {
                                criterio.vendedor = req.body.idDestinatario;
                                criterio.comprador = res.idUsuario;
                            }
                            gestorBD.obtenerConversaciones(criterio, function (conversaciones) {
                                if (conversaciones != null && conversaciones.length > 0) {
                                    // Se crea el mensaje y se añade a la conversacion
                                    var mensaje = {
                                        contenido: req.body.mensaje.trim(),
                                        autorId: res.idUsuario,
                                        autorEmail: res.usuario,
                                        fecha: new Date().getTime(),
                                        conversacionId: conversaciones[0]._id.toString(),
                                        leido: false,
                                        receptorId: req.body.idDestinatario
                                    };
                                    gestorBD.insertarMensaje(mensaje, function (idMess) {
                                       if (idMess != null) {
                                           res.status(201);
                                           res.json({ mensaje : "Mensaje insertado", _id : idMess });
                                       } else {
                                           res.status(500);
                                           res.json({ error : "Se ha producido un error inesperado" });
                                       }
                                    });
                                } else {
                                    if (req.body.idDestinatario === ofertas[0].propietario) {
                                        // Se crea la conversacion
                                        var conver = {
                                            oferta: criterio.oferta,
                                            comprador: criterio.comprador,
                                            vendedor: criterio.vendedor
                                        };
                                        gestorBD.obtenerUsuarios({_id: gestorBD.mongo.ObjectID(criterio.vendedor)}, function (usuarios){
                                            if (usuarios != null && usuarios.length > 0) {
                                                conver.vendedorEmail = usuarios[0].email;
                                                gestorBD.insertarConversacion(conver, function(idConv) {
                                                    if (idConv != null) {
                                                        // Se crea el mensaje
                                                        var mensaje = {
                                                            contenido: req.body.mensaje.trim(),
                                                            autorId: res.idUsuario,
                                                            autorEmail: res.usuario,
                                                            fecha: new Date().getTime(),
                                                            conversacionId: idConv.toString(),
                                                            leido: false,
                                                            receptorId: req.body.idDestinatario
                                                        };
                                                        gestorBD.insertarMensaje(mensaje, function (idMess) {
                                                            if (idMess != null) {
                                                                res.status(201);
                                                                res.json({ mensaje : "Mensaje insertado", _id : idMess });
                                                            } else {
                                                                res.status(500);
                                                                res.json({ error : "Se ha producido un error inesperado" });
                                                            }
                                                        });
                                                    } else {
                                                        res.status(500);
                                                        res.json({ error : "Se ha producido un error inesperado" });
                                                    }
                                                });
                                            } else {
                                                res.status(500);
                                                res.json({ error : "Se ha producido un error inesperado" });
                                            }
                                        });
                                    } else {
                                        res.status(400);
                                        res.json({ error : "El propietario de una oferta no puede iniciar conversaciones" });
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } else {
            res.status(400);
            res.json({ error : "No se han introducido los parámetros adecuados" });
        }
    });
};
