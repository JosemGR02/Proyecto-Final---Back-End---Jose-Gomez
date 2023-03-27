
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Contenedor con esquemas Mongoose - Carritos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { ContenedorMongoBD } from "../../Contenedores/index.js";
import { modeloPedido } from "../../Modelos/modelosMongoose/index.js";


class ContenedorMongodbPedidos extends ContenedorMongoBD {
    constructor() {
        super({
            nombre: modeloPedido.ColeccionPedidos,
            schema: modeloPedido.EsquemaPedido,
        });
    }
}

export { ContenedorMongodbPedidos };
