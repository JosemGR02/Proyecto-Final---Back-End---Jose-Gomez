
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| .Env Desarrollo - Utils |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { config } from '../Configuracion/config.js';


const puertoDev = 8080
const clusterDev = false
const baseDatos = config.DATABASES.mongodb.dbName
const urlbaseDatos = config.DATABASES.mongodb.url
const loggerWinston = process.env.LOGGER_MODO

const msjGmailNombre = 'Rubie Conroy'
const msjGmailEmail = 'rubie.conroy@ethereal.email'
const msjGmailContra = '8MrZq22VsPzTzfdxaJ'
const msjGmailPuerto = config.EMAIL.PUERTO
const msjGmailHost = 'smtp.ethereal.email'

const msjWhatsNServicio = config.WHATS_SMS.NRO_TWILIO
const msjWhatsNroAdmin = config.WHATS_SMS.NRO_ADMIN
const msjWhatsIdCuenta = config.WHATS_SMS.ID_CUENTA
const msjWhatsTokenAuth = config.WHATS_SMS.TOKEN_AUTHN


export const ENV_DEV_UTILS = {
    // modoNodeENV,
    puertoDev,
    clusterDev,
    baseDatos,
    urlbaseDatos,
    loggerWinston,
    msjGmailNombre,
    msjGmailEmail,
    msjGmailContra,
    msjGmailPuerto,
    msjGmailHost,
    msjWhatsNServicio,
    msjWhatsNroAdmin,
    msjWhatsIdCuenta,
    msjWhatsTokenAuth
}


// modoNodeENV = process.env.NODE_ENV
// const puerto = 8080
// const cluster = false


// process.env.PORT
// process.env.MODO_CLUSTER
// process.env.TTL_SESION
// process.env.LOGGER_MODO
// process.env.BASEDATOS_SELECCIONADA
// process.env.BASEDATOS_MONGO_URL
// process.env.MSJ_GMAIL_NOMBRE
// process.env.MSJ_GMAIL_EMAIL
// process.env.MSJ_GMAIL_CONTRA
// process.env.MSJ_GMAIL_PUERTO
// process.env.MSJ_GMAIL_HOST
// process.env.MSJ_WHATS_SMS_NRO_SERVICIO
// process.env.MSJ_WHATS_SMS_NRO_ADMIN
// process.env.MSJ_WHATS_SMS_ID_CUENTA
// process.env.MSJ_WHATS_SMS_TOKEN_AUTENTICACION