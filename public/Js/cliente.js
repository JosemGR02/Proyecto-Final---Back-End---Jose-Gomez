
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Cliente JS - Frond |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


// import { datosDesnormalizados, comprencionTotal } from "../Desnormalizacion/index.js";
import { logger } from '../../src/Configuracion/logger.js';


let contador = 0;

const socket = io.connect();


//? Extracción de elementos del DOM:

//? Formularios Prods y Msjs
const productosForm = document.getElementById('formularioProductos')
const mensajesForm = document.getElementById('formularioMensajes')


//? Contenedores Prods y Msjs
const contenedorProds = document.getElementById('contenedorProductos')
const contenedorChat = document.getElementById('contenedorMensajes')
const contenedorXcentaje = document.getElementById('contenedorCompresion')
const contenedorCart = document.getElementById('contenedorCarrito')


//? Contador Carrito
const botones = document.querySelector('.boton')
const Valor = document.querySelector('#contador')


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

//? Listeners Carritos
botones.forEach(boton => {
    boton.addEventListener('click', (evento) => {
        const elementos = evento.currentTarget.classList;

        if (elementos.contains('disminuir')) {
            contador--;
        }

        if (elementos.contains('aumentar')) {
            contador++;
        }
        Valor.textContent = contador;

        if (Valor.value < 0) {
            Valor.value = 1;
        }
    })
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

//? Eventos carrito
socket.on('Datos del carrito', listProds => {
    prodsEnCarrito = listProds
    CarritosRenderizado(listProds)
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

//? Render carrito
const limpiarCart = () => {
    contenedorCart.innerHTML = ""
}

const CarritosRenderizado = async (prodsEnCarrito) => {
    let respuesta = await fetch('/public/Assets/Vistas/Template/carritoTemplate.hbs');
    const template = await respuesta.text()
    const templateCompilado = Handlebars.compile(template)
    const html = templateCompilado({ prodsEnCarrito })
    contenedorCart.innerHTML = html
}

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//
