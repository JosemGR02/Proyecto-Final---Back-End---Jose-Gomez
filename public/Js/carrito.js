
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| JS funcionalidades Carrito |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { logger } from '../../src/Configuracion/logger.js';


const idCarrito = 0;
let valor = 0;

const socket = io.connect();


//? Extracción de elementos del DOM:


//? Contenedor carrito
const contenedorCart = document.getElementById('contenedorCarrito')


//? Vaciar - comprar carrito
const vaciarCarrito = document.getElementById('vaciar-carrito')
const comprarCarrito = document.getElementById('comprar-carrito')


//? Añadir - eliminar producto del carrito
const botonAñadir = document.getElementById('añadir-prodAlCart')
const botonEliminar = document.getElementById('eliminar-prodEnCart')


//? Contador Carrito
const botonesCantidad = document.getElementsByClassName('botonCantidad')
const NumContador = document.getElementById('contador')

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

//? LISTENERS :


//? Sumas de cantidad y precio totales del carrito
const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
// console.log(nPrecio)

template.querySelectorAll('td')[0].textContent = nCantidad
template.querySelector('span').textContent = nPrecio


//? Actualizacion producto.cantidad
botonesCantidad.forEach(boton => {
    boton.addEventListener('click', (evento) => {
        const elementos = evento.currentTarget.classList;

        //? Aumentar cantidad
        if (elementos.contains('aumentar')) {

            const productoID = boton.dataset.id;

            console.log(productoID)
            valor++

            //* Envio id del producto
            socket.emit('+ 1 cantidad', productoID);
        }
        //? Disminuir cantidad 
        if (elementos.contains('disminuir')) {

            const productoID = boton.dataset.id;

            console.log(productoID)
            valor--

            //* Envio id del producto
            socket.emit('- 1 cantidad', productoID);
        }
        NumContador.textContent = valor;

        if (NumContador.value < 0) {
            NumContador.value = 1;
        }
    })
})

//? Añadir producto al carrito 
botonAñadir.addEventListener('click', () => {
    const productoID = botonAñadir.dataset.id;
    console.log(productoID)

    //* Envio id del carrito
    socket.emit('añadir producto', productoID);
})

//? Eliminar producto del carrito 
botonEliminar.addEventListener('click', () => {
    const productoID = botonEliminar.dataset.id;
    console.log(productoID)

    //* Envio id del producto
    socket.emit('eliminar producto', productoID);
})

//? Proceso de compra del carrito
comprarCarrito.addEventListener('click', () => {
    const _id = idCarrito;

    //* Envio id del producto
    socket.emit('Nueva orden compra', _id);
})

//? Vaciar productos del carrito 
vaciarCarrito.addEventListener('click', () => {
    const _id = idCarrito;

    console.log(_id)
    //* Envio id del carrito
    socket.emit('vaciar carrito', _id);
})

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

//? EVENTOS :


//? Evento datos carrito
socket.on('Datos del carrito', listProds => {
    prodsEnCarrito = listProds
    limpiarCart()
    CarritosRenderizado(listProds)
})

//? Evento obtener id del carrito
socket.on('Id del carrito', carritoID => {
    idCarrito = carritoID
})

//? Evento producto guardado
socket.on('Producto guardado', producto => {
    guardado = producto
    // limpiarCart()
    CarritosRenderizado(producto)
})

//? Evento producto actualizado
socket.on('Producto actualizado', producto => {
    actualizado = producto
    // limpiarCart()
    CarritosRenderizado(producto)
})

//? Evento carrito vacio
socket.on('Carrito vaciado', vacio => {
    // prodsEnCarrito = vacio
    logger.info(vacio)
    limpiarCart()
})

//¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬//

//? RENDER CARRITO :


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

