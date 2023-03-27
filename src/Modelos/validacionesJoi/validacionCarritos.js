
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Validaciones - Carritos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import Joi from 'joi'

class ValidacionJoiCarrito {

    constructor(productos, usuario, orden) {
        this.productos = productos
        this.usuario = usuario
        this.orden = orden
    }

    equals(cartValidar) {
        if (!(cartValidar instanceof ValidacionJoiCarrito)) {
            return false
        }
        if (this.productos != cartValidar.productos) {
            return false
        }
        if (this.usuario != cartValidar.usuario) {
            return false
        }
        if (this.orden != cartValidar.orden) {
            return false
        }
        return true
    }

    static validar(carrito, requerido) {
        const CarritoSchema = Joi.object({
            productos: requerido ? Joi.object().required() : Joi.object(),
            usuario: requerido ? Joi.object().required() : Joi.object(),
            orden: requerido ? Joi.object().required() : Joi.object(),
        })

        const { error } = CarritoSchema.validate(carrito)
        if (error) {
            throw error
        }
    }
}

export { ValidacionJoiCarrito };