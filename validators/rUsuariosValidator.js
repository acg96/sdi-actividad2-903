module.exports = {
    validarRegistro: function(usuario, gestorBD, callback) {
        var errors = {
            errName: '',
            errLastName: '',
            errPassword: '',
            errPasswordRepeated: '',
            errEmail: '',
            anyError: 0
        };
        var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (usuario.nombre.trim() === '') {
            errors.errName = 'Este campo no puede estar vacío';
            errors.anyError = 1;
        } else if (usuario.nombre.trim().length < 5 || usuario.nombre.trim().length > 24) {
            errors.errName = 'El nombre debe tener entre 5 y 24 caracteres.';
            errors.anyError = 1;
        }

        if (usuario.apellidos.trim() === '') {
            errors.errLastName = 'Este campo no puede estar vacío';
            errors.anyError = 1;
        } else if (usuario.apellidos.trim().length < 5 || usuario.apellidos.trim().length > 24) {
            errors.errLastName = 'El apellido debe tener entre 5 y 24 caracteres.';
            errors.anyError = 1;
        }

        if (usuario.password.trim() === '') {
            errors.errPassword = 'Este campo no puede estar vacío';
            errors.anyError = 1;
        } else if (usuario.password.trim().length < 5 || usuario.password.trim().length > 24) {
            errors.errPassword = 'La contraseña debe tener entre 5 y 24 caracteres.';
            errors.anyError = 1;
        }

        if (usuario.password.trim() !== usuario.passwordRepeated.trim()) {
            errors.errPasswordRepeated = 'Las contraseñas no coinciden.';
            errors.anyError = 1;
        }

        if (usuario.email.trim() === '') {
            errors.errEmail = 'Este campo no puede estar vacío';
            errors.anyError = 1;
            callback(errors);
        } else if (usuario.email.trim().length < 5) {
            errors.errEmail = 'El email debe tener un mínimo de 5 caracteres.';
            errors.anyError = 1;
            callback(errors);
        } else if (!emailPattern.test(usuario.email.trim())) {
            errors.errEmail = 'El email no es válido.';
            errors.anyError = 1;
            callback(errors);
        } else {
            gestorBD.obtenerUsuarios({email: usuario.email.trim()}, function (usuarios) {
                if (usuarios != null && usuarios.length > 0) {
                    errors.errEmail = 'El email ya existe.';
                    errors.anyError = 1;
                }
                callback(errors);
            });
        }
    }
}
