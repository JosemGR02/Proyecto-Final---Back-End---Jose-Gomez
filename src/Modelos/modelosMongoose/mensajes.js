
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Modelos Mongoose - Mensajes |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Schema } from "mongoose";

const ColeccionMensajes = "mensajes";

const EsquemaMensaje = new Schema(
    {
        id: Schema.Types.ObjectId,
        autor: {
            usuario: { type: String, required: true }, // antes: nombre
            alias: { type: String, required: true, max: 30 },
            avatar: { type: String, required: true, max: 150 },
            tipo: { type: String, required: true }
        },
        texto: [{ type: Schema.Types.ObjectId, ref: 'mensajes' }],
        timestamp: { type: Date, default: Date.now },
    }
);

EsquemaMensaje.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta.__v;
        delete respuesta._id;
        return respuesta;
    },
});


export const modeloMensajes = { EsquemaMensaje, ColeccionMensajes };


            // apellido: { type: String, required: true, max: 40 },
            // edad: { type: Number, required: true, max: 3 },