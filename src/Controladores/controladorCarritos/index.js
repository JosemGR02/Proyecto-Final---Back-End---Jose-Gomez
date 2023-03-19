
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import nodemailer from 'nodemailer';
import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';
import { transporter, client } from '../../Servicios/index.js';
import { FECHA_UTILS, ERRORES_UTILS } from "../../Utilidades/index.js";
import { ApiCarritos, ApiProductos } from '../../Api/index.js';

class ControladorCarritos {
    constructor() {
        this.apiCarts = new ApiCarritos()
        this.apiProds = new ApiProductos()
    }

    obtenerCarritoXid = async (solicitud, respuesta) => {
        try {
            const { id } = solicitud.params;

            const carrito = await this.apiCarts.obtenerXid(id);

            if (!carrito)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

            respuesta.send({ success: true, carrito });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.info(`${error}, Error al obtener el carrito solicitado`);
        }
    };

    crearCarrito = async (solicitud, respuesta) => {
        try {
            const carritoBase = { timestamp: FECHA_UTILS.getTimestamp(), usuario: [], productos: [] };

            const nuevoCarrito = await this.apiCarts.guardar(carritoBase);

            respuesta.send({ success: true, carritoId: nuevoCarrito._id });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.info(`${error}, Error al crear el carrito`);
        }
    };


    guardarProdsCarrito = async (solicitud, respuesta) => {
        try {
            const { carritoId } = solicitud.params;
            const { productoId } = solicitud.body;

            const carrito = await this.apiCarts.obtenerXid(carritoId);

            if (!carrito)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

            const producto = await this.apiProds.obtenerXid(productoId);

            if (!producto)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

            carrito.productos.push(producto);

            const carritoActualizado = await this.apiCarts.actualizar(carritoId, carrito);

            respuesta.send({ success: true, carrito: carritoActualizado, id: carritoActualizado._id });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.info(`${error}, Error al guardar un producto al carrito`);
        }
    };

    obtenerTodosProdsCarrito = async (solicitud, respuesta) => {
        try {
            const { carritoId } = solicitud.params;

            const carrito = await this.apiCarts.obtenerXid(carritoId);
            if (!carrito) { respuesta.send({ error: "Error, no se encontro el carrito" }) }

            else {
                const listadoProductos = carrito.productos;

                if (!listadoProductos) return respuesta.send({ error: true, mensaje: "No se encontraron los productos solicitados" });

                respuesta.send({ success: true, productos: listadoProductos });
            }
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.info(`${error}, Error al obtener la lista los productos del carrito`);
        }
    };

    eliminarProdCarrito = async (solicitud, respuesta) => {
        try {
            const { carritoId, productoId } = solicitud.params;

            const carrito = await this.apiCarts.obtenerXid(carritoId);
            if (!carrito) { respuesta.send({ error: "Error, no se encontro el carrito" }) }

            else {
                const producto = await this.apiProds.obtenerXid(productoId);
                if (!producto) return respuesta.send({ error: "Error, no se encontro el producto" })

                const elementoEncontradoIndex = carrito.productos.findIndex(elemento => elemento.id === Number(productoId))
                if (elementoEncontradoIndex === -1) return respuesta.send({ error: "Error, no se encontro el producto" })
                carrito.productos.splice(elementoEncontradoIndex, 1)
            }
            const carritoActualizado = await this.apiCarts.actualizar(Number(carritoId), carrito)
            respuesta.send({ success: true, mensaje: "Se elimino correctamente el producto del carrito", carrito: carritoActualizado })

        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.info(`${error}, Error al eliminar un producto del carrito`)
        }
    };

    eliminarCarritoXid = async (solicitud, respuesta) => {
        try {
            const { carritoId } = solicitud.params;

            const carrito = await this.apiCarts.eliminarXid(carritoId);
            if (!carrito) return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

            respuesta.send({ success: true, mensaje: `Se elimino correctamente el carrito ${carritoId}` })
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.info(`${error}, Error al eliminar el carrito seleccionado`);
        }
    };

    procesarPedidoCarrito = async (solicitud, respuesta) => {
        try {
            const { carritoId } = solicitud.params;

            const carrito = await this.apiCarts.obtenerXid(carritoId);

            if (!carrito) return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });
            if (carrito.length === 0) logger.warn({ mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO })

            logger.info(carrito.productos)

            if (solicitud.isAuthenticated()) {

                const usuarioCarrito = solicitud.user;

                carrito.usuario = usuarioCarrito;

                // envio Email
                let envioEmail = {
                    from: "Remitente",
                    to: config.EMAIL.USUARIO,
                    subject: `Nueva orden de compra de: ${carrito.usuario.nombre}, email: ${carrito.usuario.email}, direccion: ${carrito.usuario.direccion}`,
                    text: `Productos solicitados por el usuario: ${carrito.productos}`
                };

                let info = transporter.sendMail(envioEmail, (error, info) => {
                    if (error) {
                        logger.error("Error al enviar mail: " + error);
                    } else {
                        logger.info(`El email: nuevo pedido, fue enviado correctamente: ${info.messageId}`);
                        logger.info(`Vista previa a URL: ${nodemailer.getTestMessageUrl(info)}`);
                    }
                });

                // envio SMS
                const envioSMS = await client.messages.create({
                    body: "Su pedido ya ha sido recibido y esta en proceso",
                    messagingServiceSid: 'MG811b5e7425f1a790279a5f4bcf832d3e',
                    to: `whatsapp:+${carrito.usuario.telefono}`
                }).then(mensaje => logger.info(mensaje.sid));

                logger.info(`Mensaje SMS enviado correctamente ${envioSMS}`);

                // envio Whatsapp
                const envioWhatsapp = await client.messages.create({
                    body: `Nuevo pedido: ${carrito.productos}, de: ${carrito.usuario.nombre}, email: ${carrito.usuario.email}`,
                    from: config.WHATSAPP.NRO_TWILIO,
                    to: `whatsapp:+${carrito.usuario.telefono}`
                }).then(mensaje => logger.info(mensaje.sid));

                logger.info(`Mensaje SMS enviado correctamente ${envioWhatsapp}`);

                logger.info('Pedido procesado con exito')
                logger.info(carrito)

                respuesta.render('view/home', { carrito: carrito.productos });
            } else {
                throw new Error("Debes estar autenticado para enviar pedidos");
            }
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.info(`${error}, Error al procesar el pedido de compra`);
        }
    }
}

export { ControladorCarritos };




