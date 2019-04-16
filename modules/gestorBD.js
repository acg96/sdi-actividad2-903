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
                        this.borrarOfertas(criterio, function (res) {
                            funcionCallback(result.result.n);
                        });
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
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.result.n);
                    }
                    db.close();
                });
            }
        });
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
                funcionCallback(1);
            }
            db.close();
        });
    }
};
