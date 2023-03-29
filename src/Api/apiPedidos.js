
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Repositorio - Carritos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { config } from '../Configuracion/config.js';
import { DaoFactoryOrder } from '../Dao/daoFactories/index.js';
import { PedidosDTO } from '../Dto/pedidosDto.js';
import { ValidacionJoiPedidos } from '../Modelos/validacionesJoi/index.js';

class ApiPedidos {
    constructor() {
        this.DaoPedidos = DaoFactoryOrder.obtenerDao(config.SERVER.SELECCION_BASEdDATOS);
    }

    async obtenerTodosPedidos() {
        const elementos = await this.DaoPedidos.obtener();
        return elementos.map(elemento => new ValidacionJoiMensaje(PedidosDTO(elemento)))
    }

    async guardarPedidoBD(nuevoElemento) {
        ApiCarritos.ValidarDatosCarritos(nuevoElemento, true)
        await this.DaoPedidos.guardar(PedidosDTO(nuevoElemento))
    }

    async eliminarPedidoXid(idBuscado) {
        const eliminado = await this.DaoPedidos.eliminar(idBuscado);
        return eliminado
    }

    static ValidarDatosPedidos(pedido, requerido) {
        try {
            ValidacionJoiPedidos.validar(pedido, requerido)
        } catch (error) {
            throw new Error('El pedido posee un formato json invalido o faltan datos: ' + error.details[0].message)
        }
    }
}

export { ApiPedidos };


