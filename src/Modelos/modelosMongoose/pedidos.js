
import { Schema } from "mongoose";

const ColeccionPedidos = "pedidos";

const EsquemaPedido = new Schema(
    {
        id: Schema.Types.ObjectId,
        numero: { type: Number, required: true, },
        usuario: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        estado: { type: String, required: true, default: 'generada' },
        precioTotalCompra: { type: Number, required: true },
        telefono: { type: Number, required: true },
        direccion: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
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