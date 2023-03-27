
import { Router } from "express"
import { ControladorMensajes } from "../../Controladores/index.js";

const ruta = Router()


class RutaMensaje {

    constructor() {
        this.controladorMsjs = new ControladorMensajes();
    }

    start() {
        ruta.get("/", (solicitud, respuesta) => {
            respuesta.render("view/messaging")
        }, this.controladorMsjs.ObtenerTodosMsjs);

        ruta.get("/", this.controladorMsjs.ObtenerTodosMsjs);

        ruta.get("/:email", this.controladorMsjs.ObtenerMsjsXemail);

        ruta.post("/", this.controladorMsjs.CrearMensaje);

        ruta.delete('/vaciar', this.controladorMsjs.vaciarChat);

        return ruta
    }
}

export { RutaMensaje };

