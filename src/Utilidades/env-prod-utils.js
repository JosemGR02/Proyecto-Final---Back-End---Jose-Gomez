
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| .Env Produccion - Utils |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const modoNodeENV = process.env.NODE_ENV
const puertoProd = process.env.PORT
const clusterProd = process.env.MODO_CLUSTER
const ttlSesion = process.env.TTL_SESION
const baseDatos = process.env.BASEDATOS_SELECCIONADA
const urlbaseDatos = process.env.BASEDATOS_MONGO_URL
const loggerWinston = process.env.LOGGER_MODO

const msjGmailNombre = process.env.MSJ_GMAIL_NOMBRE
const msjGmailEmail = process.env.MSJ_GMAIL_EMAIL
const msjGmailContra = process.env.MSJ_GMAIL_CONTRA
const msjGmailPuerto = process.env.MSJ_GMAIL_PUERTO
const msjGmailHost = process.env.MSJ_GMAIL_HOST

const msjWhatsNServicio = process.env.MSJ_WHATS_SMS_NRO_SERVICIO
const msjWhatsNroAdmin = process.env.MSJ_WHATS_SMS_NRO_ADMIN
const msjWhatsIdCuenta = process.env.MSJ_WHATS_SMS_ID_CUENTA
const msjWhatsTokenAuth = process.env.MSJ_WHATS_SMS_TOKEN_AUTENTICACION


export const ENV_DEV_UTILS = {
    modoNodeENV,
    ttlSesion,
    puertoProd,
    clusterProd,
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

