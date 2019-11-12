const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../seguridad/usuario.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({
        secret,
        isRevoked
    }).unless({
        path: [
            // Lista de rutas que no requieren Autenticación
            '/seguridad/usuario/authenticate',
            '/seguridad/usuario/'/*Temporal*/,
            /^\/seguridad\/usuario\/.*/,
            /^\/seguridad\/usuario\/getUser.*/,
            /^\/seguridad\/usuario\/setUserPass\/.*/,
            /^\/seguridad\/usuario\/getId\/.*//*Temporal*/,
            // '/seguridad/usuario/setUserPass',
            '/sendMail',
            '/sendMail/file',
            '/seguridad/usuario/logout',
            '/seguridad/usuario/isLoggedIn',
            '/seguridad/usuario/register',
            '/seguridad/usuario/token',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById({_id:payload.sub});
    // Rovacar Toen si el usuario no existe
    if (!user) {
        console.log('User Not Found');
        return done(null, true);
    }

    done();
};