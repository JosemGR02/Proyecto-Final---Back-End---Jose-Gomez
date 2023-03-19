
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Modelos Mongoose - Mensajes |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Schema } from "mongoose";

const ColeccionMensajes = "mensajes";

const EsquemaMensajes = new Schema(
    {
        autor: {
            id: Schema.Types.ObjectId,
            nombre: { type: String, required: true, max: 40 },
            apellido: { type: String, required: true, max: 40 },
            edad: { type: Number, required: true, max: 3 },
            alias: { type: String, required: true, max: 30 },
            avatar: { type: String, required: true, max: 150 },
            tipo: { type: String, required: true }
        },
        texto: [{ type: Schema.Types.ObjectId, ref: 'mensajes' }]
    }
);

EsquemaMensajes.set("toJSON", {
    transform: (_, respuesta) => {
        respuesta.id = respuesta._id;
        delete respuesta.__v;
        delete respuesta._id;
        return respuesta;
    },
});


export const modeloMensajes = { EsquemaMensajes, ColeccionMensajes };

