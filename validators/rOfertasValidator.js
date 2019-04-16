module.exports = {
    validarAlta: function(app, oferta, usuario, callback) {
        var moment = app.get('moment');
        var errors = {
            errTitle: '',
            errDetails: '',
            errDate: '',
            errPrice: '',
            errStar: '',
            anyError: 0
        };

        if (oferta.destacada) {
            if (usuario.cartera < 20.0) {
                errors.errStar = 'No tienes fondos suficientes para marcarla como destacada';
                errors.anyError = 1;
            }
        }

        if (oferta.titulo.trim() === '') {
            errors.errTitle = 'Este campo no puede estar vacío';
            errors.anyError = 1;
        } else if (oferta.titulo.trim().length < 3 || oferta.titulo.trim().length > 15) {
            errors.errTitle = 'El título debe tener entre 3 y 15 caracteres.';
            errors.anyError = 1;
        }

        if (oferta.detalles.trim() === '') {
            errors.errDetails = 'Este campo no puede estar vacío';
            errors.anyError = 1;
        } else if (oferta.detalles.trim().length < 3 || oferta.detalles.trim().length > 50) {
            errors.errDetails = 'La descripción debe tener entre 3 y 50 caracteres.';
            errors.anyError = 1;
        }

        if (oferta.fecha.trim() === '') {
            errors.errDate = 'Este campo no puede estar vacío';
            errors.anyError = 1;
        } else if (!moment(oferta.fecha.trim(), 'DD-MM-YYYY',true).isValid()) {
            errors.errDate = 'La fecha no tiene el formato dd-mm-aaaa o es inválida.';
            errors.anyError = 1;
        }

        if (parseFloat(oferta.precio) <= 0) {
            errors.errPrice = 'El precio debe ser mayor que 0.';
            errors.anyError = 1;
        }

        callback(errors);
    }
}
