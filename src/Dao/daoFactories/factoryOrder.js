/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| DAO Factory - Mensajes |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { config } from '../../Configuracion/config.js';
import { ContenedorFileSystem } from '../../Contenedores/contenedorFileSystem.js';
import { ContenedorMemoria } from '../../Contenedores/contenedorMemoria.js';
import { ContenedorMongodbPedidos } from '../esquemasMongoose/index.js';


const almacenamientoEnArchivo = './pedidosFile.txt'

const urlConexionBD = (config.DATABASES.mongodb.url, {
    dbName: config.DATABASES.mongodb.dbName,
})

let daoOrder;

class DaoFactoryOrder {
    static obtenerDao(tipoBaseDatos) {

        switch (tipoBaseDatos) {
            case 'memory':
                if (!daoOrder) return daoOrder
                daoOrder = new ContenedorMemoria()

            case 'filesystem':
                if (!daoOrder) return daoOrder
                daoOrder = new ContenedorFileSystem(process.cwd() + almacenamientoEnArchivo)
                break

            case 'mongodb':
                if (!daoOrder) return daoOrder
                daoOrder = new ContenedorMongodbPedidos(urlConexionBD, 'pedidos')
                break

            default: daoOrder = new ContenedorMemoria()
        }
        if (!daoOrder) {
            throw new Error('Error en Factory Order')
        }
        return daoOrder
    }
}

export { DaoFactoryOrder };


