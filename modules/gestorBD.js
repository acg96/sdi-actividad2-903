module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    }, insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuariosW');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, insertarConversacion: function (conversacion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversacionesW');
                collection.insert(conversacion, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, insertarMensaje: function (mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajesW');
                collection.insert(mensaje, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, obtenerUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuariosW');
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    }, obtenerUsuarioOferta: function (oferta, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuariosW');
                collection.find({_id: this.mongo.ObjectID(oferta.propietario)}).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null, null);
                    } else {
                        funcionCallback(usuarios, oferta);
                    }
                    db.close();
                });
            }
        }.bind(this));
    }, obtenerOfertas: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertasW');
                collection.find(criterio).toArray(function (err, ofertas) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(ofertas);
                    }
                    db.close();
                });
            }
        });
    }, obtenerConversaciones: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversacionesW');
                collection.find(criterio).toArray(function (err, conversaciones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(conversaciones);
                    }
                    db.close();
                });
            }
        });
    }, obtenerOfertasPaginadas: function (criterio, pagActual, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null, 1);
            } else {
                var collection = db.collection('ofertasW');
                collection.find(criterio).toArray(function (err1, offersCantidad){
                    var maxPag = parseInt(offersCantidad.length / 5);
                    if (offersCantidad.length % 5 > 0) {
                        ++maxPag;
                    }
                    if (pagActual > maxPag) {
                        pagActual = maxPag;
                    }
                    collection.find(criterio).sort({titulo: 1}).skip((pagActual-1)*5).limit(5).toArray(function (err, ofertas) {
                        if (err) {
                            funcionCallback(null, 1);
                        } else {
                            funcionCallback(ofertas, offersCantidad.length);
                        }
                        db.close();
                    });
                });
            }
        });
    }, borrarUsuario: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuariosW');
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        for (var i = 0; i < criterio.$or.length; ++i) {
                            if (criterio.$or[i]._id) {
                                this.borrarOfertas({propietario: criterio.$or[i]._id.toString()}, function (res){
                                });
                            }
                        }
                        funcionCallback(result.result.n);
                    }
                    db.close();
                }.bind(this));
            }
        }.bind(this));
    }, borrarOfertas: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertasW');
                this.obtenerOfertas(criterio, function (ofertas) {
                    collection.remove(criterio, function (err, result) {
                        if (err) {
                            funcionCallback(null);
                        } else {
                            funcionCallback(result.result.n);
                        }
                        db.close();
                    });
                    if (ofertas != null) {
                        for (var i = 0; i < ofertas.length; ++i) {
                           // console.log(ofertas[i].titulo);
                          // ofertas[i]._id.toString()
                        }
                    }
                }.bind(this));
            }
        }.bind(this));
    }, insertarOferta: function (oferta, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertasW');
                collection.insert(oferta, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    }, actualizarOfertaDestacada: function (oferta, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertasW');
                var oferta2 = {
                    destacada: 'on'
                };
                collection.update({_id: this.mongo.ObjectID(oferta._id)}, {$set: oferta2}, function (err, obj) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(obj.result.n);
                    }
                    db.close();
                });
            }
        }.bind(this));
    }, actualizarOfertaComprada: function (oferta, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('ofertasW');
                var oferta2 = {
                    compra: oferta.compra
                };
                collection.update({_id: this.mongo.ObjectID(oferta._id)}, {$set: oferta2}, function (err, obj) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(obj.result.n);
                    }
                    db.close();
                });
            }
        }.bind(this));
    }, actualizarCarteraUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('usuariosW');
                var user = {
                    cartera: usuario.cartera
                };
                collection.update({_id: this.mongo.ObjectID(usuario._id)}, {$set: user}, function (err, obj) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(obj.result.n);
                    }
                    db.close();
                });
            }
        }.bind(this));
    }, resetMongo: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collectionUsers = db.collection('usuariosW');
                collectionUsers.drop().then(res => {
                }, err => {});
                var collectionOffers = db.collection('ofertasW');
                collectionOffers.drop().then(res => {
                }, err => {});
                var collectionConvers = db.collection('conversacionesW');
                collectionConvers.drop().then(res => {
                }, err => {});
                var collectionMessages = db.collection('mensajesW');
                collectionMessages.drop().then(res => {
                }, err => {});
                funcionCallback(1);
            }
            db.close();
        });
    }
};
