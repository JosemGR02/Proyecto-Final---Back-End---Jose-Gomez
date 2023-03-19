

//* USANDO CLIENTE AXIOS PARA LAS CONSULTAS Y RESPUESTAS DE PRODUCTOS


import { ClienteAxios } from './axios.js';
import { logger } from '../Configuracion/logger.js';



logger.info('Obtener todos los Productos')

const obtenerTodosProductos = async () => {
    try {
        const todosProductos = await ClienteAxios.obtenerTodosAxios()

        if (todosProductos.data) {
            logger.log(todosProductos.data);
        }
    } catch (error) {
        logger.log(error);
    }
}
obtenerTodosProductos()


logger.info('-----------------------------')


logger.info('Obtener Productos x id')

const obtenerXidProductos = async () => {
    try {
        const productoBuscado = await ClienteAxios.obtenerXidAxios(1)

        if (productoBuscado.data) {
            logger.log(productoBuscado.data);
        }
    } catch {
        logger.log(error);
    }
}
obtenerXidProductos()


logger.info('-----------------------------')


logger.info('Guardar un Producto')

const guardarProductos = async () => {
    try {
        const producto = await ClienteAxios.guardarAxios()

        logger.log(producto.data);
    } catch {
        logger.log(error);
    }
}
guardarProductos()

// guardarProductos() //guardar otro


logger.info('-----------------------------')


logger.info('actualizar un Producto')

const actualizarProductos = async () => {
    try {
        const actualizado = await ClienteAxios.actualizarAxios()

        logger.log(actualizado.data);
    } catch {
        logger.log(error);
    }
}
actualizarProductos()


logger.info('--------------------------------')


logger.info('eliminar un Producto')

const eliminarXidProductos = async () => {
    try {
        logger.info('Eliminar un Producto por su id')

        const respuesta = await ClienteAxios.eliminarXidAxios()

        logger.info(respuesta.data)
    } catch {
        logger.log(error);
    }
}
eliminarXidProductos()


logger.info('--------------------------------')


logger.info('eliminar todos los Productos')

const eliminarTodosProductos = async () => {
    try {
        logger.info('Borrar todos las Productos')

        await ClienteAxios.eliminarTodosAxios()
    } catch {
        logger.log(error);
    }
}
eliminarTodosProductos()


