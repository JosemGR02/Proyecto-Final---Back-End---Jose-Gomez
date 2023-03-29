
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Servicio Socket io |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { logger } from '../../Configuracion/logger.js';
import { ApiProductos, ApiMensajes, ApiCarritos } from '../../Api/index.js';
import { isAdmin } from '../../Middlewares/index.js';
import { datosUsuario } from '../../Middlewares/index.js';

const IdCarritoUsuario = 0;

export const eventosSocketIO = (io) => {

    //? CONEXION
    io.on('connection', socket => {

        logger.info(`Usuario: ${socket.id} conectado`);

        enviarTodosProds();
        enviarTodosMsjs();
        enviarPorcentajeCompresion();
        enviarDatosCarrito();
        enviarIDCarrito();

        //? producto:
        socket.on('Nuevo producto', nuevoProd => {
            nuevoProducto(socket, io, nuevoProd)
        })

        //? mensaje:
        socket.on('Nuevo mensaje', nuevoMsg => {
            nuevoMensaje(socket, io, nuevoMsg)
        })

        //? carrito:
        socket.on('añadir producto', prodAguardar => {
            añadirProducto(socket, io, prodAguardar)
        })

        socket.on('+ 1 cantidad', nuevaCantidad => {
            cantidadMenos(socket, io, nuevaCantidad)
        })

        socket.on('- 1 cantidad', nuevaCantidad => {
            cantidadMas(socket, io, nuevaCantidad)
        })

        socket.on('eliminar producto', prodAeliminar => {
            eliminarProducto(socket, io, prodAeliminar)
        })

        socket.on('vaciar carrito', prodAeliminar => {
            vaciarCarrito(socket, io, prodAeliminar)
        })

        socket.on('compra del carrito', ordenCompra => {
            ordenDeCompra(socket, io, ordenCompra)
        })
    })

    //? DESCONEXION
    io.on('disconnection', socket => {
        logger.info(`Usuario: ${socket.id} desconectado`);
    })

    //¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

    //? Envio de todos los mensajes y/o productos

    //? PRODUCTOS:

    const enviarTodosProds = async (socket) => {
        const todosProds = await ApiProductos.obtenerTodosProductos()
        io.sockets.emit('Todos los productos', todosProds)
    }

    //? MENSAJES:

    const enviarTodosMsjs = async (socket) => {
        const todosMsjs = await ApiMensajes.obtenerTodosMensajes().limit(20)
        io.sockets.emit('Todos los mensajes', todosMsjs)
    }

    //? CARRITO:

    //? Envio todos datos del carrito
    const enviarDatosCarrito = async (socket) => {
        const datosCarrito = {};
        const cantidadProdsCarrito = 0;

        IdCarritoUsuario = datosUsuario.idCarrito;

        //* productos en el carrito
        const listadoProds = await ApiCarritos.obtenerListadoProds()

        //* cantidad total productos
        const carrito = await ApiCarritos.obtenerCartXid(IdCarritoUsuario)

        for (const producto of carrito.productos) {
            cantidadProdsCarrito += producto.cantidad;
            return cantidadProdsCarrito;
        }
        //* valor total del carrito
        const valorTotalCarrito = listadoProds.forEach(producto => {
            producto.precio * producto.cantidad
        });

        datosCarrito.productos = listadoProds;
        datosCarrito.cantidaTotal = cantidadProdsCarrito;
        datosCarrito.precioTotal = valorTotalCarrito;

        io.sockets.emit('Datos del carrito', datosCarrito)
    }

    //? Envio del id del carrito
    const enviarIDCarrito = async (socket) => {
        const carritoID = IdCarritoUsuario;
        io.sockets.emit('Id del carrito', carritoID)
    }

    //? Incorporacion de un producto al carrito
    const añadirProducto = async (socket) => {
        const productoEncontrado = await this.ApiCarritos.obtenerProdXid(producto);

        if (!productoEncontrado) {
            logger.error('Producto no encontrado')
        }
        //* Guardado del producto en carrito
        const productoGuardado = await this.ApiCarritos.añadirProducto(_id, productoEncontrado._id);

        if (productoGuardado) {
            logger.info('Se guardo el producto en el carrito con exito');
            enviarDatosCarrito();
        } else {
            logger.error('Error al guardar un producto');
        }
        //* Envio del producto guardado
        io.sockets.emit('Producto guardado ', productoGuardado)
    }

    //? Actualizacion de la cantidad del producto

    //? disminucion producto.cantidad
    const cantidadMas = async (socket, io, producto) => {
        const productoEncontrado = await this.ApiCarritos.obtenerProdXid(producto);

        if (!productoEncontrado) logger.error('Producto no encontrado');

        productoEncontrado.cantidad++

        //* Guardado del producto en carrito
        const productoActualizado = await this.ApiCarritos.añadirProducto(_id, productoEncontrado._id);

        if (productoActualizado) {
            logger.info('Se actualizado los cambios con exito');
            enviarDatosCarrito();
        } else {
            logger.error('Error al actualizar el producto');
        }
        //* Envio del producto actualizado
        io.sockets.emit('Producto actualizado', productoActualizado)
    }

    //? disminucion producto.cantidad
    const cantidadMenos = async (socket, io, producto) => {
        const productoEncontrado = await this.ApiCarritos.obtenerProdXid(producto);

        if (!productoEncontrado) logger.error('Producto no encontrado');

        productoEncontrado.cantidad--

        //* Guardado del producto en carrito
        const productoActualizado = await this.ApiCarritos.añadirProducto(_id, productoEncontrado._id);

        if (productoActualizado) {
            logger.info('Se actualizado los cambios con exito');
            enviarDatosCarrito();
        } else {
            logger.error('Error al actualizar el producto');
        }
        //* Envio del producto actualizado
        io.sockets.emit('Producto actualizado', productoActualizado)
    }

    //? Eliminacion del producto
    const eliminarProducto = async (socket, producto) => {
        const productoEncontrado = await this.ApiCarritos.obtenerProdXid(producto);

        const prodEliminado = await this.ApiCarritos.eliminarProdXid(productoEncontrado)

        if (prodEliminado) {
            logger.info('Se Elimino el producto con exito');
            enviarDatosCarrito();
        } else {
            logger.error('Error al eliminar el producto');
        }
    }

    //? vaciar carrito
    const vaciarCarrito = async (socket, carritoID) => {
        const carrito = await this.ApiCarritos.obtenerProdXid(carritoID);

        carrito.productos = {};

        if (carrito.productos.length) {
            logger.info('Se vacio el carrito con exito');

            let carritoVaciado = " ";

            //* Envio del carrito actualizado
            io.sockets.emit('Carrito vaciado', carritoVaciado)
        } else {
            logger.error('Error al vaciar el carrito');
        }
    }

    //? Proceso de compra del carrito
    const ordenDeCompra = async (socket) => {

        const opciones = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { _id: _id }
        };

        fetch("localhost:8080/api/carrito/compra", opciones)
            .then(respuesta => respuesta.json())
            .then(data => logger.info('Se realizo el proceso de compra con exito', data))
            .catch(error => logger.error('Error al realizar el proceso de compra', error.message))
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
            logger.info({ tipoDeAutor: autor.tipo });

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
                        logger.info(`Mensaje ${mensajeCreado} creado con exito`);

                        //* Envio mensaje respuesta
                        autorEncontrado.emit('Whisper', nuevaRespuesta)
                    } else {
                        logger.error('El usuario seleccionado no fue encontrado');
                    }
                } else {
                    logger.error('Error: Ingrese el usuario y el mensaje');
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
                logger.info(`Mensaje ${mensajeCreado} creado con exito`);

                //* Envio de todos los mensajes
                const todosMsjs = await ApiMensajes.obtenerTodosMensajes()
                io.sockets.emit('Todos los mensajes', todosMsjs)
            }
        } else {
            logger.error('Error: Tenes que iniciar sesion para enviar mensajes');
        }
    }
}

