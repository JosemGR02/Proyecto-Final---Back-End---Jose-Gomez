
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Modelos Mongoose - Productos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Schema } from "mongoose";

const ColeccionProductos = "productos";

const EsquemaProducto = new Schema(
    {
        id: { type: String },  // id: Schema.Types.ObjectId,
        titulo: { type: String, required: true, max: 100 },
        descripcion: { type: String, required: true, max: 150 },
        categoria: { type: String, required: true },
        imagen: { type: String, required: true, max: 150 },
        precio: { type: Number, required: true },
        codigo: { type: String, required: true, max: 10 },
        stock: { type: Number, required: true, default: 1 },
        cantidad: { type: Number, default: 1 },
        enCarrito: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
    },
    {
        virtuals: true,
    }
);

EsquemaProducto.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta.__v;
        delete respuesta._id;
        return respuesta;
    },
});

export const modeloProducto = { EsquemaProducto, ColeccionProductos };


// timestamp: { type: String, required: true, max: 100 },
