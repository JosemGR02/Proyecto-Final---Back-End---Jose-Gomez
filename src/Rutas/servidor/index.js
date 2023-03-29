
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Ruta Servidor Datos |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { Router } from 'express';
import { PUERTO } from '../../app.js';
import { ENV_PROD_UTILS, ENV_DEV_UTILS } from '../../Utilidades/index.js';


const ruta = Router();


//? datos de la configuracion del servidor
ruta.get('/info', (solicitud, respuesta) => {
    const FECHA = new Date().toLocaleDateString()
    const TTL = process.env.TTL_SESION
    const PID = process.pid

    respuesta.render("view/server", { fecha: FECHA, pid: PID, puerto: PUERTO, ttl: TTL });
})

//? info .Env: desarrollo
ruta.get('/ultraSegurity/env-dev', (solicitud, respuesta) => {
    const datosDEV = ENV_DEV_UTILS;

    respuesta.render("view/info.env-dev", { datosDEV });
})

//? info .Env: produccion
ruta.get('/ultraSegurity/env-prod', (solicitud, respuesta) => {
    const datosPROD = ENV_PROD_UTILS;

    respuesta.render("view/info.env-prod", { datosPROD });
})

export { ruta as RutaServidor };




