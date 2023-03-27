
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Contenedor con esquemas Mongoose - Carritos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { ContenedorMongoBD } from "../../Contenedores/index.js";
import { modeloCarrito } from "../../Modelos/modelosMongoose/index.js";


class ContenedorMongodbCarrito extends ContenedorMongoBD {
    constructor() {
        super({
            nombre: modeloCarrito.ColeccionCarritos,
            schema: modeloCarrito.CarritoEsquema,
        });
    }

    async obtenerListadoProds() {
        const respuesta = await this.model.find().populate("productos");

        return respuesta;
    }

    async obtenerProdXid(id) {
        const respuesta = await this.model.findById(id).populate("productos");

        return respuesta;
    }

    async añadirProducto(id, producto) {
        try {
            const respuesta = await this.model.findByIdAndUpdate(id, { $push: { productos: producto } }, { new: true })
            return respuesta;

        } catch (error) {
            logger.error(error);
        }
    }

    async actualizarCantidad(id, cantidad) {
        try {
            const respuesta = await this.model.findByIdAndUpdate(id, { $push: { cantidad: cantidad } }, { new: true })
            return respuesta;

        } catch (error) {
            logger.error(error);
        }
    }

    async eliminarProdXid(id, producto) {
        try {
            const respuesta = await this.model.findByIdAndUpdate(id, { $pull: { productos: producto } })
            return respuesta;

        } catch (error) {
            logger.error(error);
        }
    }
}

export { ContenedorMongodbCarrito };
