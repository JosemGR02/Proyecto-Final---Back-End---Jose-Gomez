
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Middleware Autenticacion |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { logger } from "../Configuracion/logger.js";


const datosUsuario = {};

const estaAutenticado = (solicitud, respuesta, next) => {

    datosUsuario.haberSifunca = 0;
    datosUsuario.usuario = solicitud.user;

    logger.info({ datosUsuario: datosUsuario });
    logger.info({ xSolicitud: solicitud.user });

    if (solicitud.isAuthenticated())

        return respuesta.render("view/home", {
            nombre: solicitud.user.nombre,
            apellido: solicitud.user.apellido,
            usuario: solicitud.user.usuario,
            alias: solicitud.user.alias,
            edad: solicitud.user.edad,
            avatar: solicitud.user.avatar,
            telefono: solicitud.user.telefono,
            direccion: solicitud.user.direccion,
            contraseña: solicitud.user.contrasena,
            carritoID: solicitud.user.idCarrito
        });
    next()
}

export { estaAutenticado, datosUsuario };


