
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| JS - Productos y Mensajes |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


import { logger } from '../../src/Configuracion/logger.js';
// import { datosDesnormalizados, comprencionTotal } from "../Desnormalizacion/index.js";


const socket = io.connect();


//? Extracción de elementos del DOM:

//? Formularios Prods y Msjs
const productosForm = document.getElementById('formularioProductos')
const mensajesForm = document.getElementById('formularioMensajes')


//? Contenedores Prods y Msjs
const contenedorProds = document.getElementById('contenedorProductos')
const contenedorChat = document.getElementById('contenedorMensajes')
const contenedorXcentaje = document.getElementById('contenedorCompresion')

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

//? LISTENERS :


//? Listeners Productos
productosForm.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const datosFormulario = new FormData(productosForm)
    const valoresFormulario = Object.fromEntries(datosFormulario)
    logger.info(valoresFormulario);
    productosForm.reset();
    socket.emit('nuevo producto', valoresFormulario);
})

//? Listeners Mensajeria
mensajesForm.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const datosFormulario = new FormData(mensajesForm)
    const valoresFormulario = Object.fromEntries(datosFormulario)
    logger.info(valoresFormulario);
    mensajesForm.reset();
    socket.emit('nuevo mensaje', valoresFormulario);
})

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

//? EVENTOS :


//? Eventos Productos
socket.on('Todos los productos', todosProds => {
    productos = todosProds
    limpiarProds()
    ProductosRenderizados(todosProds)
})

//? Eventos mensajeria
socket.on('Todos los mensajes', todosMsgs => {
    mensajes = todosMsgs
    limpiarChat()
    mensajesRenderizados(todosMsgs)
    // renderMsjsDesnormalizados(todosMsgs)
})

socket.on('Whisper', nuevaRespuesta => {
    mensajes = nuevaRespuesta
    mensajesRenderizados(nuevaRespuesta)
})

//? Eventos porcentajecompresion
socket.on('porcentaje compresion', xcentaje => {
    comprencionTotal = xcentaje
    limpiarChat()
    renderXcentajeComprension(xcentaje)
})

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

//? RENDERS :


//? Render productos
const limpiarProds = () => {
    contenedorProds.innerHTML = ""
}
const ProductosRenderizados = async (productos) => {
    let respuesta = await fetch('/public/Assets/Vistas/Templates/productoTemplate.hbs');
    const template = await respuesta.text()
    const templateCompilado = Handlebars.compile(template)
    const html = templateCompilado({ productos })
    contenedorProds.innerHTML = html
}

//? Render mensajeria
const limpiarChat = () => {
    contenedorChat.innerHTML = ""
}

const mensajesRenderizados = async (mensajes) => {
    let respuesta = await fetch('/public/Assets/Vistas/Templates/mensajeriaTemplate.hbs');
    const template = await respuesta.text()
    const templateCompilado = Handlebars.compile(template)
    const html = templateCompilado({ mensajes })
    contenedorChat.innerHTML = html
    contenedorChat.scrollTop = contenedorChat.scrollHeight;   //hay que ver si funca
}

const renderXcentajeComprension = async (comprencionTotal) => {
    let respuesta = await fetch('/public/Assets/Vistas/Templates/mensajeriaTemplate.hbs');
    const template = await respuesta.text()
    const templateCompilado = Handlebars.compile(template)
    const html = templateCompilado({ comprencionTotal })
    contenedorXcentaje.innerHTML = html
}

// const renderMsjsDesnormalizados = async (datosDesnormalizados) => {
//     let respuesta = await fetch('/public/Assets/Vistas/Templates/mensajeriaTemplate.hbs');
//     const template = await respuesta.text()
//     const templateCompilado = Handlebars.compile(template)
//     const html = templateCompilado({ datosDesnormalizados })
//     contenedorChat.innerHTML = html
// }

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//
