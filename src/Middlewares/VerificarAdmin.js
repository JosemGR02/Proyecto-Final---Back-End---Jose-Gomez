
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Middleware verificacion Admin |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const ES_ADMIN = true;

const isAdmin = (solicitud, respuesta, next) => {
    if (!ES_ADMIN) return respuesta.send({ error: "¡Su usuario no esta autorizado!" });

    next();
};

export { isAdmin };



