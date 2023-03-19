
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| - Testeos - + -  Apis - |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//! TESTEO DAO CONTENEDOR MEMORIA
// import PersonasDaoMem from "./personasDaoMem.js";

// //instancia prueba
// const personaDao = new PersonasDaoMem()

// // 1 crear un elemento
// const persona1 = {
//     nombre: "Lautaro",
//     dni: '359456623',
//     id: 1
// }
// personaDao.save(persona1)

// const mostrar = () => console.log('\n') + console.log(personaDao.getAll())
// mostrar()

// const persona2 = {
//     nombre: "Harijan",
//     dni: '379456623',
//     id: 2
// }
// personaDao.save(persona2)
// mostrar()


// personaDao.updateById(1, { nombre: 'Tomas' })
// mostrar()

// personaDao.getById(2)
// mostrar()

// personaDao.deleteById(2)
// mostrar()

// personaDao.deleteAll()
// mostrar()


// //! TESTEO DTO CONTENEDOR FILESYSTEM Y MEMORIA

// import PersonasDaoFile from "./PersonasDaoFile.js.js"
// import PersonasDaoMem from "./PersonasDaoMem.js.js"

// //instancia prueba
// const personaDaoMem = new PersonasDaoMem()

// // 1 crear un elemento
// console.log('------( TEST DAO MEM. )--------')

// const persona1 = {
//     nombre: "Lautaro",
//     dni: '359456623',
//     id: 1
// }
// personaDaoMem.save(persona1)

// const mostrar = () => console.log('\n') + console.log(personaDaoMem.getAll())
// mostrar()

// const persona2 = {
//     nombre: "Harijan",
//     dni: '379456623',
//     id: 2
// }
// personaDaoMem.save(persona2)
// mostrar()


// personaDaoMem.updateById(1, { nombre: 'Tomas', apellido: 'Sanz' })
// mostrar()


// personaDaoMem.deleteById(2)
// mostrar()

// personaDaoMem.deleteAll()
// mostrar()


// console.log('------( TEST DAO FILE )--------')
// const personaDaoFile = new PersonasDaoFile('./personas.txt')

// await personaDaoFile.save(persona1)

// const mostrar_FILE = async () => {
//     const msj = await personaDaoFile.getAll()
//     console.log('\n')
//     console.log(msj)
// }
// await mostrar_FILE()

// await personaDaoFile.save(persona2)
// await mostrar_FILE()


// await personaDaoFile.updateById(1, { nombre: 'Tomas', apellido: 'Sanz' })
// await mostrar_FILE()


// await personaDaoFile.deleteById(2)
// await mostrar_FILE()

// await personaDaoFile.deleteAll()
// await mostrar_FILE()


//! TESTEO FACTORY CONTENEDORES

// import PersonasDaoFactory from './daos/PersonasDaoFactory.js'

// const generadorDeIds = {
//     id: 1,
//     next() { return this.id++ }
// }

// const personasDao = PersonasDaoFactory.obtenerDAO()
// await personasDao.iniciar()

// console.log('-----------------------------')
// console.log('1) Obtener todas las personas')
// console.log(await personasDao.getAll())

// console.log('-----------------------------')
// console.log('2) Incorporar una persona')
// const persona1 = { nombre: 'Juan', apellido: 'Perez', dni: '30555777', id: generadorDeIds.next() }
// console.log(await personasDao.save(persona1))

// console.log('-----------------------------')
// console.log('3) Obtener todas las personas')
// console.log(await personasDao.getAll())

// console.log('-----------------------------')
// console.log('4) Incorporar otra persona')
// const persona2 = { nombre: 'Pedro', apellido: 'Suarez', dni: '35678907', id: generadorDeIds.next() }
// console.log(await personasDao.save(persona2))

// console.log('-----------------------------')
// console.log('5) Obtener todas las personas')
// console.log(await personasDao.getAll())

// console.log('--------------------------------')
// console.log('6) Obtener una persona por su id')
// console.log(await personasDao.getById(persona2.id))

// console.log('--------------------------------')
// console.log('7) Actualizar una persona por su id')
// console.log(await personasDao.updateById(persona2.id, { nombre: 'Ana', apellido: 'Mei', dni: '37123543' }))

// console.log('-----------------------------')
// console.log('8) Obtener todas las personas')
// console.log(await personasDao.getAll())

// console.log('--------------------------------')
// console.log('9) Borrar una persona por su id')
// console.log(await personasDao.deleteById(persona1.id))

// console.log('-----------------------------')
// console.log('10) Obtener todas las personas')
// console.log(await personasDao.getAll())

// console.log('-----------------------------')
// console.log('Borrar todas las personas (limpieza final) y desconectarme')
// await personasDao.deleteAll()
// await personasDao.disconnect()




//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



// import { RepositorioUser } from '../Repositorios/repositorioUser.js';


// const repoUsuarios = new RepositorioUser()

// mostrar(await personasRepo.obtenertodos())

//! TESTEO REPOSITORY CONTENEDORES

// import PersonasRepo from './repos/PersonasRepo.js'
// import Persona from './modelos/Persona.js'
// import PersonaMostrable from './adaptadores/PersonaMostrable.js'

// const generadorDeIds = {
//     id: 1,
//     next() { return this.id++ }
// }

// const personasRepo = new PersonasRepo()

// console.log('-----------------------------')
// console.log('1) Obtener todas las personas')
// mostrar(await personasRepo.getAll())

// console.log('-----------------------------')
// console.log('2) Incorporar una persona')
// const persona1 = new Persona({ nombre: 'Juan', apellido: 'Perez', dni: '30555777', id: generadorDeIds.next() })
// await personasRepo.add(persona1)

// console.log('-----------------------------')
// console.log('3) Obtener todas las personas')
// mostrar(await personasRepo.getAll())

// console.log('-----------------------------')
// console.log('4) Incorporar otra persona')
// const persona2 = new Persona({ nombre: 'Pedro', apellido: 'Suarez', dni: '35678907', id: generadorDeIds.next() })
// await personasRepo.add(persona2)

// console.log('-----------------------------')
// console.log('5) Obtener todas las personas')
// mostrar(await personasRepo.getAll())

// console.log('--------------------------------')
// console.log('6) Obtener una persona por su id')
// mostrar(await personasRepo.getById(persona2.id))

// console.log('-----------------------------')
// console.log('7) Eliminar una persona por su id')
// mostrar(await personasRepo.removeById(persona2.id))

// console.log('-----------------------------')
// console.log('8) Obtener todas las personas')
// mostrar(await personasRepo.getAll())

// console.log('--------------------------------')
// console.log('9) Borrar todas las personas')
// await personasRepo.removeAll()

// console.log('-----------------------------')
// console.log('10) Obtener todas las personas')
// mostrar(await personasRepo.getAll())

// //---------------

// function mostrar(data) {
//     if (Array.isArray(data)) {
//         if (data.length > 0) {

//             for (const persona of data) {
//                 console.log(new PersonaMostrable(persona).comoTextoPlano())
//             }
//         } else {
//             console.log('no hay datos para mostrar')
//         }
//     } else {
//         console.log(new PersonaMostrable(data).comoTextoPlano())
//     }
// }