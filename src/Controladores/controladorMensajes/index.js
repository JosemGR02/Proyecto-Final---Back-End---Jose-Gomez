
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Mensajes |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import swal from 'sweetalert';
import chalk from 'chalk';
import { ApiMensajes } from "../../Api/index.js";
import { FECHA_UTILS, ERRORES_UTILS, LOGGER_UTILS } from "../../Utilidades/index.js";
import { logger } from '../../Configuracion/logger.js';



class ControladorMensajes {

    constructor() {
        this.apiMsjs = new ApiMensajes()
    }

    ObtenerTodosMsjs = async (solicitud, respuesta) => {
        try {
            const mensajes = await this.apiMsjs.obtenerTodosMensajes();

            if (!mensajes) {
                return respuesta.send({ error: ERRORES_UTILS.MESSAGES.ERROR_MENSAJES });
            }
            // respuesta.send(mensajes);
            respuesta.render("view/messaging", { todosMsjs: mensajes });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'MENSAJES' });
            logger.error(chalk.bord.red(`${error}, Error al obtener los mensajes solicitados`));
        }
    };

    CrearMensaje = async (solicitud, respuesta) => {
        try {
            const { autor, id, nombre, apellido, edad, alias, avatar, texto } = solicitud.body;

            const nuevoMensaje = await this.apiMsjs.guardarMensajesBD({
                autor, id, nombre, apellido, edad, alias, avatar, texto,
                timestamp: FECHA_UTILS.getTimestamp(),
            });

            const mensajeCreado = await this.apiMsjs.guardarMensajesBD(nuevoMensaje);

            respuesta.send({ success: true, mensaje: mensajeCreado });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'MENSAJES' });
            logger.error(chalk.bord.red(`${error}, Error al crear el mensaje solicitado`));
            await LOGGER_UTILS.addLog(error);
        }
    };

    ObtenerMsjsXemail = async (solicitud, respuesta) => {
        try {
            const { email } = solicitud.params;

            const mensajes = await this.apiMsjs.obtenerMensajesXemail(email);

            if (!mensajes) {
                return respuesta.send({ error: ERRORES_UTILS.MESSAGES.ERROR_MENSAJES });
            }
            // respuesta.send(mensajes);
            respuesta.render("view/myMessages", { misMensajes: mensajes });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'MENSAJES' });
            logger.error(chalk.bord.red(`${error}, Error al obtener los mensajes solicitados`));
        }
    };

    vaciarChat = async (solicitud, respuesta) => {
        try {
            //* Se obtiene el chat
            const chatMensajes = await this.apiMsjs.obtenerTodosMensajes();

            if (!chatMensajes)
                return logger.error(chalk.bord.red('El chat de mensajeria no fue encontrado'));

            logger.info(chalk.bord.blue({ Chat: chatMensajes }));

            const chatEliminado = await this.apiMsjs.eliminarTodosMensajes();

            logger.info(chalk.bord.magenta({ Chat: chatMensajes }));

            //* Alerta a usuario
            if (chatEliminado) {
                swal({
                    title: 'El chat de la mensajeria fue vaciado con exito',
                    icon: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            respuesta.send({ success: true, mensaje: "El chat de mensajes fue vaciado" });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(chalk.bord.red(`${error}, Error al vaciar el carrito de productos`))
        }
    }
}

export { ControladorMensajes };

