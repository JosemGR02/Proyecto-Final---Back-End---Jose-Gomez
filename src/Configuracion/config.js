
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Configuracion del Proyecto |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import dotenv from "dotenv";
// import path from 'path';

dotenv.config({
    // path: path.resolve(process.cwd(), '.env.' + process.env.NODE_ENV) // !!!
});

const PRODUCTOS_ARCHIVONOMBRE = "productos";
const CARRITOS_ARCHIVONOMBRE = "carritos";
const MENSAJES_ARCHIVONOMBRE = "mensajes";
const USUARIOS_ARCHIVONOMBRE = "usuarios";


const config = {
    SERVER: {
        NODE_ENV: process.env.NODE_ENV || 'Desarrollo',
        PUERTO: process.env.PORT || 8080,
        SELECCION_BASEdDATOS: process.env.BASEDATOS_SELECCIONADA ?? "memory",
    },
    DATABASES: {
        filesystem: {
            PRODUCTOS_ARCHIVONOMBRE,
            CARRITOS_ARCHIVONOMBRE,
            MENSAJES_ARCHIVONOMBRE,
            USUARIOS_ARCHIVONOMBRE,
        },
        mongodb: {
            url: process.env.BASEDATOS_MONGO_URL,
            dbName: process.env.BASEDATOS_MONGO_NOMBRE
        }
    },
    EMAIL: {
        NOMBRE: process.env.MSJ_GMAIL_NOMBRE,
        USUARIO: process.env.MSJ_GMAIL_EMAIL,
        CONTRASEÑA: process.env.MSJ_GMAIL_CONTRA,
        PUERTO: process.env.MSJ_GMAIL_PUERTO,
        HOST: process.env.MSJ_GMAIL_HOST
    },
    WHATS_SMS: {
        NRO_TWILIO: process.env.MSJ_WHATS_SMS_NRO_SERVICIO,
        NRO_ADMIN: process.env.MSJ_WHATS_SMS_NRO_ADMIN,
        ID_CUENTA: process.env.MSJ_WHATS_SMS_ID_CUENTA,
        TOKEN_AUTHN: process.env.MSJ_WHATS_SMS_TOKEN_AUTENTICACION,
    }
};

export { config };
