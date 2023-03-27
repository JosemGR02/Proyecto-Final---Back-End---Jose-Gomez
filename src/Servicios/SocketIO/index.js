
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Servicio Socket io |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import chalk from 'chalk';
import { logger } from '../../Configuracion/logger.js';
import { ApiProductos, ApiMensajes, ApiCarritos } from '../../Api/index.js';
import { isAdmin } from '../../Middlewares/index.js';
import { datosUsuario } from '../../Middlewares/index.js';


export const eventosSocketIO = (io) => {

    io.on('connection', socket => {

        logger.info(chalk.inverse.cyan(`Usuario: ${socket.id} conectado`));
        enviarTodosProds();
        enviarTodosMsjs();
        enviarPorcentajeCompresion();
        enviarDatosCarrito();

        socket.on('Nuevo producto', nuevoProd => {
            nuevoProducto(socket, io, nuevoProd)
        })

        socket.on('Nuevo mensaje', nuevoMsg => {
            nuevoMensaje(socket, io, nuevoMsg)
        })
    })

    io.on('disconnection', socket => {
        logger.info(chalk.inverse.yellow(`Usuario: ${socket.id} desconectado`));
    })

    //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

    //? Envio de todos los mensajes y/o productos

    const enviarTodosProds = async (socket) => {
        const todosProds = await ApiProductos.obtenerTodosProductos()
        io.sockets.emit('Todos los productos', todosProds)
    }

    const enviarTodosMsjs = async (socket) => {
        const todosMsjs = await ApiMensajes.obtenerTodosMensajes().limit(20)
        io.sockets.emit('Todos los mensajes', todosMsjs)
    }

    const enviarDatosCarrito = async (socket) => {
        const listProds = await ApiCarritos.obtenerListadoProds()
        io.sockets.emit('Datos del carrito', listProds)
    }

    //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

    //? Nuevo producto
    const nuevoProducto = async (socket, io, nuevoProd) => {
        //* Guardado de productos en db
        await ApiProductos.guardarProductosBD(nuevoProd)

        //* Envio de todos los productos
        const todosProds = await ApiProductos.obtenerTodosProductos()
        io.sockets.emit('Todos los productos', todosProds)
    }

    //? Nuevo mensaje
    const nuevoMensaje = async (socket, io, nuevoMsj) => {
        const fecha = new Date()
        const fechaFormateada = dayjs(fecha).format('DD/MM/YYYY hh:mm:ss')
        logger.info("Fecha formateada", fechaFormateada)

        //* Verificacion de autenticidad + extraccion de datos del usuario
        if (solicitud.isAuthenticated()) {

            const usuarioMsj = datosUsuario;//  ||   solicitud.user; 

            const autor = {};
            autor.email = usuarioMsj.usuario;
            autor.alias = usuarioMsj.alias;
            autor.avatar = usuarioMsj.avatar;
            autor.id = socket.id;

            //* Tipo de autor
            if (!isAdmin) {
                autor.tipo = usuario;
            } else {
                autor.tipo = sistema;
            }
            logger.info(chalk.bold.blue({ tipoDeAutor: autor.tipo }));

            //* Funcionalidad: mensaje de respuesta
            const msjRespuesta = nuevoMsj.trim();

            if (msjRespuesta.substr(0, 5) === 'Res@ ') {
                msjRespuesta = msjRespuesta.substr(5);
                const espacio = msjRespuesta.indexOf(' ');
                if (espacio !== -1) {
                    const nombre = msjRespuesta.substring(0, espacio);
                    const mensaje = msjRespuesta.substring(espacio + 1);

                    //* Busqueda usuario
                    const autorEncontrado = await ApiMensajes.obtenerUnMensaje({ 'alias': nombre }); //email

                    //* Envio mensaje respuesta
                    if (autorEncontrado) {
                        const nuevaRespuesta = { respuesta: mensaje, autor: autor.alias }

                        //* Guardado de mensaje en db   
                        //! mepa que no lo puedo hacer x modelos
                        const mensajeCreado = await ApiMensajes.guardarMensajesBD(nuevaRespuesta)
                        logger.info(chalk.bold.green(`Mensaje ${mensajeCreado} creado con exito`));

                        //* Envio mensaje respuesta
                        autorEncontrado.emit('Whisper', nuevaRespuesta)
                    } else {
                        logger.error(chalk.inverse.red('El usuario seleccionado no fue encontrado'));
                    }
                } else {
                    logger.error(chalk.inverse.red('Error: Ingrese el usuario y el mensaje'));
                }
            } else {
                //* Nuevo mensaje
                const nuevoMensaje = {
                    autor: {
                        email: autor.email,
                        alias: autor.alias,
                        avatar: autor.avatar,
                    },
                    tipo: autor.tipo,
                    texto: nuevoMsj,
                    timestamp: `${fechaFormateada} hs`,
                }
                //* Guardado de mensaje en db
                const mensajeCreado = await ApiMensajes.guardarMensajesBD(nuevoMensaje)
                logger.info(chalk.bold.green(`Mensaje ${mensajeCreado} creado con exito`));

                //* Envio de todos los mensajes
                const todosMsjs = await ApiMensajes.obtenerTodosMensajes()
                io.sockets.emit('Todos los mensajes', todosMsjs)
            }
        } else {
            logger.error(chalk.inverse.red('Error: Tenes que iniciar sesion para enviar mensajes'));
        }
    }
}

