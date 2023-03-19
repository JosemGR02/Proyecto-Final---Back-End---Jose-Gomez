
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Modelos - Productos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import Joi from 'joi'

class ValidacionJoiProducto {

    constructor(titulo, descripcion, codigo, imagen, precio, stock) {
        this.titulo = titulo
        this.descripcion = descripcion
        this.codigo = codigo
        this.imagen = imagen
        this.precio = precio
        this.stock = stock
    }

    equals(prodValidar) {
        if (!(prodValidar instanceof ValidacionJoiProducto)) {
            return false
        }
        if (this.titulo != prodValidar.titulo) {
            return false
        }
        if (this.descripcion != prodValidar.descripcion) {
            return false
        }
        if (this.codigo != prodValidar.apellido) {
            return false
        }
        if (this.imagen != prodValidar.imagen) {
            return false
        }
        if (this.precio != prodValidar.precio) {
            return false
        }
        if (this.stock != prodValidar.stock) {
            return false
        }
        return true
    }

    static validar(producto, requerido) {
        const MensajeSchema = Joi.object({
            titulo: requerido ? Joi.string().required().length(20) : Joi.string(),
            descripcion: requerido ? Joi.string().required().length(30) : Joi.string(),
            codigo: requerido ? Joi.string().required().max(20) : Joi.string(),
            imagen: requerido ? Joi.string().required() : Joi.string(),
            precio: requerido ? Joi.number().required().max(20) : Joi.number(),
            stock: requerido ? Joi.number().required().max(20) : Joi.number(),
        })

        const { error } = MensajeSchema.validate(producto)
        if (error) {
            throw error
        }
    }
}

export { ValidacionJoiProducto };