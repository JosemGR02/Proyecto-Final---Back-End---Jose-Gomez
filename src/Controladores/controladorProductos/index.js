
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Productos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { ApiProductos } from '../../Api/index.js';
import { FECHA_UTILS, ERRORES_UTILS, JOI_VALIDADOR, LOGGER_UTILS } from "../../Utilidades/index.js";
import { logger } from '../../Configuracion/logger.js';



class ControladorProductos {

    constructor() {
        this.apiProds = new ApiProductos()
    }

    obtenerTodosProds = async (solicitud, respuesta) => {
        try {
            const producto = await this.apiProds.obtenerTodosProductos();

            if (!producto) return logger.error({ error: ERRORES_UTILS.MESSAGES.ERROR_PRODUCTO });

            respuesta.status(200).send(producto);
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.info(`${error}, Error al obtener los productos solicitados`)
        }
    };

    obtenerProdXid = async (solicitud, respuesta) => {
        try {
            const { id } = solicitud.params;

            const producto = await this.apiProds.obtenerProductosXid(id);

            respuesta.status(200).send(producto);
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' })
            logger.info(`${error}, Error al obtener el producto solicitado`)
        }
    };

    actualizarProducto = async (solicitud, respuesta) => {
        try {
            const { id } = solicitud.params;

            const { titulo, descripcion, codigo, stock,
                precio, imagen, timestamp } = solicitud.body;

            const productoValidado = await JOI_VALIDADOR.productoJoi.validateAsync({
                titulo, descripcion, codigo, imagen, precio, stock, timestamp
            });

            const productoActualizado = this.apiProds.actualizarProductosXid({ productoValidado }, id)

            respuesta.status(200).send(`${productoActualizado}, Producto actualizado con exito`)
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.info(`${error}, Error al actualizar el producto solicitado`)
        }
    }

    crearProducto = async (solicitud, respuesta) => {
        try {
            const { titulo, descripcion, codigo, imagen, precio, stock } = solicitud.body;

            //* Subida imagen del producto
            const file = solicitud.file;

            logger.info({ status: 'imagen subida correctamente!', link: __dirname + '/public/Uploads/productos' + file.filename });

            const nuevoProducto = await JOI_VALIDADOR.producto.validateAsync({
                titulo, descripcion, codigo, imagen, precio, stock,
                timestamp: FECHA_UTILS.getTimestamp(),
            });

            const productoCreado = await this.apiProds.guardarProductosBD(nuevoProducto);

            respuesta.status(200).send(`${productoCreado}, Producto/s creado/s con exito`);
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.info(`${error}, Error al craer el producto solicitado`)
            await LOGGER_UTILS.guardarLOG(error);
        }
    }; n

    eliminarProdXid = async (solicitud, respuesta) => {
        try {
            const { id } = solicitud.params;

            await this.apiProds.eliminarProductosXid(id);

            respuesta.status(200).send('Producto eliminado con exito');
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.info(`${error}, Error al eliminar el producto solicitado`)
        }
    };

    eliminarTodosProds = async (solicitud, respuesta) => {
        try {
            await this.apiProds.eliminarTodosProductos();

            respuesta.status(200).send('Productos eliminados con exito');
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PRODUCTOS' });
            logger.info(`${error}, Error al eliminar los productos solicitados`)
        }
    };
}

export { ControladorProductos };



