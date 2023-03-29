
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| DTO - Pedidos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export class Pedidos {
    constructor({ id, nombre, numero, email, estado, precioTotalCompra }) {
        this.id = id
        this.numero = numero
        this.nombre = nombre
        this.email = email
        this.estado = estado
        this.precioTotalCompra = precioTotalCompra
    }
}

export function PedidosDTO(elemento) {
    if (Array.isArray(elemento))
        return elemento.map(item => new Pedidos(item))
    else
        return new Pedidos(elemento)
}

