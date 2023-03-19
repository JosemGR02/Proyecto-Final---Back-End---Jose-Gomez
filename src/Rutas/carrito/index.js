
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Carrito Compra |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from "express";
import { ControladorCarritos } from '../../Controladores/index.js';

const ruta = Router();


class RutaCarrito {

    constructor() {
        this.controladorCarts = new ControladorCarritos();
    }

    start() {
        ruta.get("/compra", (solicitud, respuesta) => { respuesta.render("view/cart"); });

        ruta.get('/:id', this.controladorCarts.obtenerCarritoXid);
        ruta.get('/:id/productos', this.controladorCarts.obtenerTodosProdsCarrito);

        ruta.post('/', this.controladorCarts.crearCarrito);
        // ruta.put('/:id/productos/:id', this.controladorCarts.actualizarProdsCarrito);
        ruta.post('/compra', this.controladorCarts.procesarPedidoCarrito);

        ruta.delete('/:id/productos/:id', this.controladorCarts.eliminarProdCarrito);
        ruta.delete('/', this.controladorCarts.eliminarCarritoXid);

        return ruta
    }
}

export { RutaCarrito };



