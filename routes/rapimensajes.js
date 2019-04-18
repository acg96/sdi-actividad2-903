module.exports = function (app, gestorBD, logger) {
    app.delete('/api/conversacion/:id', function (req, res) {
        logger.info("El usuario " + res.usuario + " ha solicitado desde la API borrar la conversación " + req.params.id);
        if (req.params.id && req.params.id.length === 24) {
            gestorBD.obtenerConversaciones({_id: gestorBD.mongo.ObjectID(req.params.id)}, function (conversaciones) {
                if (conversaciones != null && conversaciones.length > 0) {
                    if (conversaciones[0].comprador === res.idUsuario || conversaciones[0].vendedor === res.idUsuario) {
                        gestorBD.borrarConversacion({_id: gestorBD.mongo.ObjectID(req.params.id)}, function (cantBorrada) {
                            res.status(200);
                            res.json({ mensaje : "conversación eliminada correctamente", _id : req.params.id });
                        });
                    } else {
                        res.status(403);
                        res.json({ error : "No puedes borrar la conversación porque no existe o no perteneces a ella" });
                    }
                } else {
                    res.status(400);
                    res.json({ error : "No hay ninguna conversación con ese id" });
                }
            });
        } else {
            res.status(400);
            res.json({ error : "No se han introducido los parámetros adecuados o el formato es incorrecto" });
        }
    });

    app.put('/api/mensaje/:id', function (req, res) {
        logger.info("El usuario " + res.usuario + " ha solicitado desde la API marcar como leido el mensaje " + req.params.id);
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

    app.get('/api/conversacion', function (req, res) {
        logger.info("El usuario " + res.usuario + " ha solicitado desde la API obtener las conversaciones que tiene abiertas");
        gestorBD.obtenerConversaciones({$or: [{comprador: res.idUsuario}, {vendedor: res.idUsuario}]}, function (conversaciones) {
            if (conversaciones != null && conversaciones.length > 0) {
                var listConversaciones = [];
                for (var i = 0; i < conversaciones.length; ++i) {
                    gestorBD.obtenerOfertaConversacion(conversaciones[i], function (ofertas, conversacion) {
                        if (ofertas != null && ofertas.length > 0) {
                            conversacion.ofertaObj = ofertas[0];
                        }
                        listConversaciones.push(conversacion);
                        if (listConversaciones.length === conversaciones.length) {
                            res.status(200);
                            res.send(JSON.stringify(listConversaciones));
                        }
                    });
                }
            } else {
                res.status(200);
                res.json({mensaje: "El usuario no tiene conversaciones abiertas"});
            }
        });
    });

    app.get('/api/mensaje', function (req, res) {
        logger.info("El usuario " + res.usuario + " ha solicitado desde la API obtener las conversaciones con sus mensajes de la oferta " + req.query.idOferta);
        if (req.query.idOferta && req.query.idOferta.length === 24) {
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
        logger.info("El usuario " + res.usuario + " ha solicitado desde la API enviar un mensaje a la oferta " + req.body.idOferta);
        if (req.body.idOferta && req.body.idOferta.length === 24 && req.body.idDestinatario && req.body.idDestinatario.length === 24 && req.body.mensaje && req.body.mensaje.trim() !== '') {
            gestorBD.obtenerOfertas({_id: gestorBD.mongo.ObjectID(req.body.idOferta)}, function (ofertas) {
                if (ofertas == null || ofertas.length === 0) {
                    res.status(400);
                    res.json({ error : "La oferta indicada no existe" });
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
                                    if (req.body.idDestinatario === ofertas[0].propietario && ofertas[0].compra == null) {
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
                                        res.json({ error : "El propietario de una oferta no puede iniciar conversaciones ni tampoco se pueden iniciar conversaciones de ofertas ya compradas" });
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
