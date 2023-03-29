
import { Router } from "express";
import { ControladorProductos } from "../../Controladores/index.js";

const ruta = Router();


class RutaProducto {
    constructor() {
        this.controladorProds = new ControladorProductos();
    }

    start() {
        ruta.get("/vista", (solicitud, respuesta) => { respuesta.render("view/prods") });

        //? los puse en uno solo, obtiene el id x body
        ruta.get("/", this.controladorProds.obtenerProductos);
        ruta.get("/categoria/", this.controladorProds.obtenerProdsXcategoria);

        ruta.post("/", this.controladorProds.crearProducto);
        ruta.put("/actualizar/", this.controladorProds.actualizarProducto);

        //? los puse en uno solo, obtiene el id x body
        ruta.delete("/", this.controladorProds.eliminarProductos);

        return ruta
    }
}

export { RutaProducto };


// ruta.get("/", this.controladorProds.obtenerTodosProds);
// ruta.get("/:id", this.controladorProds.obtenerProdXid);
// ruta.delete("/:id", this.controladorProds.eliminarProdXid);
// ruta.delete("/", this.controladorProds.eliminarTodosProds);
