
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import nodemailer from 'nodemailer';
import swal from 'sweetalert';
import chalk from 'chalk';
import { config } from '../../Configuracion/config.js';
import { logger } from '../../Configuracion/logger.js';
import { transporter, client } from '../../Servicios/index.js';
import { FECHA_UTILS, ERRORES_UTILS } from "../../Utilidades/index.js";
import { ApiCarritos } from '../../Api/index.js';
import { datosUsuario } from '../../Middlewares/index.js';


// const valorTotalCompra(productos) {
//     return productos.reduce((productos, precioTotal) => (precioTotal += productos.precio * productos.cantidad), 0);
// }

let cantidadOrdenesAlmacenadas = 0;
let datoCantidadTotal = 0;

class ControladorCarritos {
    constructor() {
        this.apiCarts = new ApiCarritos()
        this.apiProds = new ApiProductos()
    }

    obtenerCarritoXid = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;

            //* Se obtiene el carrito
            const carrito = await this.apiCarts.obtenerXid(_id);

            if (!carrito)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

            // respuesta.send({ success: true, carrito });
            respuesta.render("view/cart", { datosCarrito: carrito, carritoID: carrito._id });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al obtener el carrito solicitado`);
        }
    };


    crearCarrito = async (solicitud, respuesta) => {
        try {
            const carritoBase = { timestamp: FECHA_UTILS.getTimestamp(), usuario: [], productos: [] };

            //* Creacion del carrito
            const nuevoCarrito = await this.apiCarts.guardar(carritoBase);

            // respuesta.send({ success: true, carritoId: nuevoCarrito.id });
            respuesta.render("view/home", { carritoID: nuevoCarrito.id });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al crear el carrito`);
        }
    };


    guardarProdsCarrito = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;
            const { prodId } = solicitud.body;

            //* Se obtiene el producto
            const producto = await this.apiCarts.obtenerProdXid(prodId);

            if (!producto)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

            //* Guardado del producto en carrito
            const carrito = await this.apiCarts.añadirProducto(_id, producto._id);

            logger.info({ carrito })

            if (!carrito) {
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });
            } else {
                producto.enCarrito = true;
                logger.info(producto.enCarrito)

                //* Alerta a usuario
                swal({
                    title: 'El producto seleccionado fue guardado en el carrito con exito',
                    icon: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            respuesta.send({ success: true, carrito: carritoActualizado, id: carritoActualizado._id });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al guardar un producto al carrito`);
        }
    };


    actualizarCarrito = async (solicitud, respuesta) => {
        try {
            const { _id, prodId } = solicitud.params;
            const { cantidadPedida } = solicitud.body;

            //* Se obtiene el producto del carrito
            const productoEncontrado = await this.apiCarts.obtenerProdXid(prodId);

            if (!productoEncontrado)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

            //* Actualizacion de la cantidad del producto
            productoEncontrado.cantidad = cantidadPedida;

            //* Guardado del producto en carrito
            await this.apiCarts.añadirProducto(_id, productoEncontrado._id);

            logger.info({ cantidad: productoEncontrado.cantidad })

            respuesta.render("view/cart", { productoActualizado: productoEncontrado });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al crear el carrito`);
        }
    };


    obtenerTodosProdsCarrito = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;

            //* Se obtiene el carrito
            const carrito = await this.apiCarts.obtenerXid(_id);
            logger.info({ carrito })

            if (!carrito) {
                return logger.info({ error: "Error, no se encontro el carrito" })

            } else {
                //* Se obtienen los productos del carrito
                const listadoProductos = await this.apiCarts.obtenerListadoProds();
                // const listadoProductos = { productos: carrito.productos };

                if (!listadoProductos) return respuesta.send({ error: true, mensaje: "No se encontraron los productos solicitados" });

                logger.info({ listadoProductos })

                // respuesta.send({ success: true, productos: listadoProductos });
                respuesta.render("view/cart", { todosProductos: listadoProductos });
            }
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al obtener la lista los productos del carrito`);
        }
    };

    vaciarCarrito = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;

            //* Se obtiene el carrito
            const carrito = await this.apiCarts.obtenerXid(_id);

            if (!carrito)
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

            logger.info({ prodsA_Eliminar: carrito.productos })

            carrito.productos = {};

            logger.info({ carritoVacio: carrito.productos })

            if (carrito.productos) return logger.error('Siguen habiendo productos')

            respuesta.render("view/cart", { carritoVaciado: carrito });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al vaciar el carrito de productos`)
        }
    }

    eliminarProdCarrito = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;
            const { prodId } = solicitud.body;

            logger.info({ idCart: solicitud.params })
            logger.info({ idProd: solicitud.body })

            //* Se obtiene el producto
            const producto = await this.apiCarts.obtenerProdXid(prodId);

            if (!producto) {
                logger.info({ error: "Error, no se encontro el producto" })
            }
            logger.info({ producto })

            //* Se elimina el producto del carrito
            const productoEliminado = await this.apiCarts.eliminarProdXid(_id, prodId)

            if (productoEliminado) {

                producto.enCarrito = false;
                logger.info(producto.enCarrito)

                //* Alerta a usuario
                swal({
                    title: 'El producto seleccionado fue eliminado del carrito con exito',
                    icon: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            respuesta.send({ success: true, mensaje: "Se elimino correctamente el producto del carrito", carrito: productoEliminado })
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al eliminar un producto del carrito`)
        }
    };


    eliminarCarritoXid = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;

            //* Se elimina el carrito
            const carrito = await this.apiCarts.eliminarXid(_id);

            if (!carrito) {
                return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });
            }
            //* Alerta a usuario
            else {
                swal({
                    title: 'El carrito seleccionado fue eliminado con exito',
                    icon: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            respuesta.send({ success: true, mensaje: `Se elimino correctamente el carrito ${_id}` })
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.error(`${error}, Error al eliminar el carrito seleccionado`);
        }
    };


    //? ruta con carrito id en params usuario boton => sacado de usuario

    procesarPedidoCarrito = async (solicitud, respuesta) => {
        try {
            const { _id } = solicitud.params;

            //* Se obtiene el carrito
            const carrito = await this.apiCarts.obtenerXid(_id);

            if (!carrito) return respuesta.send({ error: true, mensaje: ERRORES_UTILS.MESSAGES.ERROR_CARRITO });

            logger.info({ ProductoPedido: carrito.productos })

            //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

            //* Verificacion de autenticación + extraccion datos del cliente y su pedido
            if (solicitud.isAuthenticated()) {

                //* Usuario
                const usuarioCarrito = datosUsuario; //solicitud.user; || datosUsuario
                carrito.usuario = usuarioCarrito;
                logger.info({ Cliente: carrito.usuario });

                //* Numero pedido
                carrito.pedido.numero = cantidadOrdenesAlmacenadas++;

                //* Cantidad productos pedidos
                for (const producto of carrito.productos) {
                    datoCantidadTotal += producto.cantidad;
                    return datoCantidadTotal;
                }
                carrito.cantidadProds = datoCantidadTotal;
                // let cantidadProductos = carrito.productos.cantidad.reduce((a, b) => a + b, 0);

                //* Precio total
                const valorTotalCarrito = carrito.productos.forEach(producto => {
                    producto.precio * producto.cantidad
                });
                carrito.pedido.precioTotal = valorTotalCarrito;

                //* Estado compra
                carrito.pedido.estado = carrito.ordenCompra.estado;

                //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

                //* Envio del Email al admin
                let envioEmail = {
                    from: "Remitente",
                    to: config.EMAIL.USUARIO,
                    subject: `Nueva orden de compra de: ${carrito.usuario.nombre} ${carrito.usuario.apellido}, email: ${carrito.usuario.email}, direccion: ${carrito.usuario.direccion}, N° de compra: ${carrito.pedido.numero}`,
                    text: `Productos solicitados por el usuario: ${carrito.productos}, precio total de la compra: ${carrito.productos.precioTotal}`
                };
                logger.info({ Cliente: envioEmail.subject })

                let info = transporter.sendMail(envioEmail, (error, info) => {
                    if (error) {
                        logger.error("Error al enviar mail: " + error);
                    } else {
                        logger.info(`El email: nuevo pedido, fue enviado correctamente: ${info.messageId}`);
                        logger.info(`Vista previa a URL: ${nodemailer.getTestMessageUrl(info)}`);
                    }
                });

                //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

                //* Envio del SMS al cliente
                const envioSMS = await client.messages.create({
                    body: "Su pedido ya ha sido recibido y esta en proceso",
                    messagingServiceSid: 'MG811b5e7425f1a790279a5f4bcf832d3e',
                    from: config.WHATSAPP.NRO_TWILIO,
                    to: `whatsapp:+${carrito.usuario.telefono}`
                }).then(mensaje => logger.info(mensaje.sid));

                logger.info(`Mensaje SMS enviado correctamente ${envioSMS}`);

                //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

                //* Envio del Whatsapp al cliente
                const envioWhatsapp = await client.messages.create({
                    body: `Nuevo pedido: ${carrito.productos}, precio total de la compra: ${carrito.productos.precioTotal}, de: ${carrito.usuario.nombre} ${carrito.usuario.apellido}, email: ${carrito.usuario.email}, estado de compra: ${carrito.pedido.estado}`,
                    from: config.WHATSAPP.NRO_TWILIO,
                    to: `whatsapp:+${carrito.usuario.telefono}`
                }).then(mensaje => logger.info(mensaje.sid));

                logger.info(`Mensaje SMS enviado correctamente ${envioWhatsapp}`);

                logger.info('Pedido de compra procesado con exito');

                //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

                //* Alerta a usuario y envio de productos a vista
                if (carrito.pedido.numero) {
                    swal({
                        title: '¡El pedido de compra del carrito fue procesado con exito!',
                        icon: 'success',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    logger.info({ numeroPedido: carrito.pedido.numero, carritoCompra: carrito })
                }

                respuesta.render('view/home', { carrito: carrito.productos });
            } else {
                throw new Error("Debes estar autenticado para enviar pedidos");
            }
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'CARRITOS' });
            logger.error(`${error}, Error al procesar el pedido de compra`);
        }
    }
}

export { ControladorCarritos };



