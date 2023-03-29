
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Controlador Mensajes |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { logger } from '../../Configuracion/logger.js';
import { ApiPedidos } from '../../Api/index.js';
import { nuevaOrden } from '../../Controladores/controladorCarritos/index.js';



class ControladorPedidos {

    constructor() {
        this.apiOrders = new ApiPedidos()
    }

    ObtenerTodasOrdenes = async (solicitud, respuesta) => {
        try {
            const pedidos = await this.apiOrders.obtenerTodosPedidos();

            if (!pedidos) {
                return logger.error('No hay pedidos todavia');
            }
            respuesta.render("view/orders", { pedidos: pedidos });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PEDIDOS' });
            logger.error(`${error}, Error al obtener los pedidos solicitados`);
        }
    };

    guardarPedido = async (solicitud, respuesta) => {
        try {
            const nuevoPedido = nuevaOrden;

            if (!nuevoPedido) return logger.error('Todavia no hay datos de la orden')

            const pedidoGuardado = await this.apiOrders.guardarMensajesBD(nuevoPedido);

            respuesta.send({ success: true, mensaje: pedidoGuardado });
        } catch (error) {
            respuesta.render("view/error-forAll", { infoError: error, lugarError: 'PEDIDOS' });
            logger.error(`${error}, Error al guardar el pedido solicitado`);
        }
    };
}

export { ControladorPedidos };