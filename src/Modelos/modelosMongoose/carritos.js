
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Modelos Mongoose - Carritos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Schema } from "mongoose";

const ColeccionCarrito = "carrito";

const CarritoEsquema = new Schema(
    {
        id: Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        usuario: { type: Schema.Types.ObjectId, ref: "usuarios" },
        productos: [{ type: Schema.Types.ObjectId, ref: "productos" }],
        orden: [{ type: Schema.Types.ObjectId, ref: "pedidos" }],
    },
    {
        virtuals: true,
    }
);

CarritoEsquema.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta._id;
        return respuesta;
    },
});

export const modeloCarrito = { ColeccionCarrito, CarritoEsquema };




// import { Schema } from "mongoose";

// const ColeccionPedidos = "pedidos";

// const pedidosEsquema = new Schema(
//     {
//         timestamp: { type: Date, default: Date.now },
//         numero: { type: String, required: true, },
//         estado: { type: String, required: true, default: generada },
//         email: { type: Email, required: true, unique: true },
//     }
// );

// pedidosEsquema.set("toJSON", {
//     transform: (_, respuesta) => {
//         respuesta.id = respuesta._id;
//         delete respuesta._id;
//         return respuesta;
//     },
// });

// export const modeloPedidos = { ColeccionPedidos, pedidosEsquema };