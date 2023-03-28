
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Servicio Passport |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import passport from "passport";
import __dirname from '../../dirname.js';
import nodemailer from 'nodemailer';
import { Strategy as LocalStrategy } from "passport-local";
import { BCRYPT_VALIDADOR, ERRORES_UTILS } from '../../Utilidades/index.js';
import { ApiCarritos, ApiUsuarios } from "../../Api/index.js";
import { transporter } from '../../Servicios/index.js';
import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';


const iniciar = () => {

    //? Serializar 
    passport.serializeUser((usuario, done) => {
        done(null, usuario._id);
    });

    //? Deserializar
    passport.deserializeUser(async (id, done) => {
        const usuario = await ApiUsuarios.obtenerXid(id);
        done(null, usuario);
    });

    //? Estrategia Inicio sesion
    passport.use("login", new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'contrasena',
        passReqToCallback: true,
    }, async (solicitud, username, password, done) => {
        try {
            //* Verificacion de usuario
            const usuario = await ApiUsuarios.obtenerUnUsuario({ 'usuario': username });

            if (!usuario) {
                logger.warn("No se encontro el usuario con el usuario " + usuario);
                return done(null, false);
            }

            //* Verificacion de contraseña
            if (!BCRYPT_VALIDADOR.validarContraseña(usuario, password)) {
                logger.warn({ error: ERRORES_UTILS.MESSAGES.ERROR_USUARIO_O_CONTRA });
                return done(null, false)
            }

            return done(null, usuario);
        } catch (error) {
            logger.error(`${error}, Error en Passport - inicio Sesion`);
        }
    }));

    //? Estrategia Registrarse
    passport.use("signup", new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'contrasena',
        passReqToCallback: true,
    }, async (solicitud, username, password, done) => {
        try {
            const { nombre, apellido, usuario, alias, contrasena,
                verifcontra, edad, telefono, direccion } = solicitud.body

            if (!nombre, !apellido, !usuario, !alias, !contrasena,
                !verifcontra, !edad, !telefono, !direccion) return done(null, false);

            //* Subida de imagen (avatar usuario)
            const file = solicitud.file;

            logger.info({ status: 'imagen subida correctamente!', link: __dirname + '/public/Uploads/' + file.filename });

            //* Verificacion de contraseñas ( === )
            if (verifcontra !== contrasena) {
                logger.warn('Error: Las contraseñas no son iguales');
                return done(null, false);
            }

            //* Verificacion de usuario
            const usuarioYaExiste = await ApiUsuarios.obtenerUnUsuario({ 'usuario': username }); // DaoUsuario.obtenerUno

            if (usuarioYaExiste) {
                logger.warn('El usuario ya existe con el email de: ' + usuario);
                return done(null, false);
            } else {

                //* Creacion del carrito
                const carritoID = await ApiCarritos.crearCarrito();
                logger.info(carritoID)

                const nuevoUsuario = {
                    nombre: nombre,
                    apellido: apellido,
                    usuario: usuario,
                    alias: alias,
                    edad: edad,
                    avatar: solicitud.file.path,
                    telefono: telefono,
                    direccion: direccion,
                    contrasena: BCRYPT_VALIDADOR.crearContraHash(contrasena),
                    idCarrito: carritoID
                }
                //* Creacion del usuario
                const usuarioCreado = await ApiUsuarios.guardarUsuariosBD(nuevoUsuario)
                logger.info(`Usuario ${usuarioCreado} registrado correctamente`);

                //* Envio del email al admin
                const envioEmail = {
                    from: "Remitente",
                    to: config.EMAIL.USUARIO,
                    subject: `Nuevo registro de usuario, nombre: ${usuarioCreado.nombre}, email: ${usuarioCreado.usuario}`,
                    text: `Hay un nuevo usuario registrado con el alias: ${usuarioCreado.alias}`
                };

                let info = transporter.sendMail(envioEmail, (error, info) => {
                    if (error) {
                        logger.error(d("Error al enviar email: " + error));
                    } else {
                        logger.info(`El email: "Nuevo registro de usuario", fue enviado con exito: ${info.messageId}`);
                        logger.info(`Vista previa a URL: ${nodemailer.getTestMessageUrl(info)}`);
                    }
                });

                return done(null, usuarioCreado);
            }
        } catch (error) {
            logger.error(`${error}, Error en Passport - Registro`);
        }
    }));
}

export const PassportAutenticacion = {
    iniciar,
}
