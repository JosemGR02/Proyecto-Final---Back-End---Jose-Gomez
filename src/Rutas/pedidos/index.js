
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Ordenes de Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from "express";
import { ControladorPedidos } from '../../Controladores/index.js';

const ruta = Router();


class RutaPedidos {

    constructor() {
        this.controladorOrders = new ControladorPedidos();
    }

    start() {
        ruta.get('/', this.controladorOrders.ObtenerTodasOrdenes);

        ruta.post('/', this.controladorOrders.guardarPedido);

        return ruta
    }
}

export { RutaPedidos };

