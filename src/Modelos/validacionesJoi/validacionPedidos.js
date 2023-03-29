
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Validaciones - Carritos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import Joi from 'joi'

class ValidacionJoiPedido {

    constructor(id, numero, usuario, email, estado, precioTotalCompra, telefono, direccion) {
        this.id = id
        this.numero = numero
        this.usuario = usuario
        this.email = email
        this.estado = estado
        this.precioTotalCompra = precioTotalCompra
        this.telefono = telefono
        this.direccion = direccion
    }

    equals(orderValidar) {
        if (!(orderValidar instanceof ValidacionJoiPedido)) {
            return false
        }
        if (this.id != orderValidar.id) {
            return false
        }
        if (this.numero != orderValidar.numero) {
            return false
        }
        if (this.usuario != orderValidar.usuario) {
            return false
        }
        if (this.email != orderValidar.email) {
            return false
        }
        if (this.estado != orderValidar.estado) {
            return false
        }
        if (this.precioTotalCompra != orderValidar.precioTotalCompra) {
            return false
        }
        if (this.telefono != orderValidar.telefono) {
            return false
        }
        if (this.direccion != orderValidar.direccion) {
            return false
        }
        return true
    }

    static validar(pedido, requerido) {
        const PedidoSchema = Joi.object({
            id: requerido ? Joi.string().required() : Joi.string(),
            nombre: requerido ? Joi.string().required().length(15) : Joi.string(),
            email: requerido ? Joi.string().required().length(15) : Joi.string(),
            numero: requerido ? Joi.number().required().max(3) : Joi.number(),
            estado: requerido ? Joi.string().required().length(15) : Joi.string(),
            precioTotalCompra: requerido ? Joi.number().required() : Joi.number(),
            telefono: requerido ? Joi.number().required() : Joi.number(),
            direccion: requerido ? Joi.string().required() : Joi.string()
        })

        const { error } = PedidoSchema.validate(pedido)
        if (error) {
            throw error
        }
    }
}

export { ValidacionJoiPedido };