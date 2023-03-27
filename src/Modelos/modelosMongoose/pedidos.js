
import { Schema } from "mongoose";

const ColeccionPedidos = "pedidos";

const EsquemaPedido = new Schema(
    {
        // id: Schema.Types.ObjectId,
        timestamp: { type: Date, default: Date.now },
        numero: { type: Number, required: true, },
        email: { type: String, required: true, unique: true },
        estado: { type: String, required: true, default: 'generada' },
        precioTotal: { type: Number, required: true }
    }
);

EsquemaPedido.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta._id;
        return respuesta;
    },
});

export const modeloPedido = { EsquemaPedido, ColeccionPedidos };