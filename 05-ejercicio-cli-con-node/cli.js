import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import path from 'node:path'

if (process.permission.has("fs.read") === false) {
    console.error("Error: Esta accion requiere permisos de lectura en el sistema de archivos.")
    // en caso de que no tengamos permisos para leer, abortamos el proceso
    process.exit(1)
}

// Otra cosa que podemos hacer es mejorar esto verificando si tenemos acceso a leer el directorio especifico al que queremos acceder
const folderToRead = process.argv.slice(2).find(arg => !arg.startsWith('--')) // <- esta es la posición del directorio que elegimos
console.log({ folderToRead }) // <- te dejo este console.log() para que lo puedas ver

const folderToReadAbsolute = path.resolve(folderToRead) // <- te da la posición absoluta del directorio
console.log({ folderToReadAbsolute }) // <- te dejo este console.log() para que lo puedas ver

// Verificamos si tenemos permisos para leer el directorio, el segundo parámetro es el path absoluto de la ruta a la que queremos acceder para lectura.
// RECUERDA: Es una alternativa que te quise dar, lo que hiciste está genial :)
if(!process.permission.has("fs.read", folderToReadAbsolute)) {
    console.error(`Error: No tienes permisos para leer el directorio ${folderToReadAbsolute}`)
    console.error(`Para poder leer este directorio, ejecuta el siguiente comando:`)
    console.error(`node --permission --allow-fs-read=${folderToReadAbsolute} cli.js ${folderToRead}`)
    process.exit(1)
}


// no hace falta un else, podemos hacer un exit en la primera consulta del `if` para abortar el proceso

const args = process.argv.slice(2);
const isAsc = args.includes('--asc');
const isDesc = args.includes('--desc');
const onlyFiles = args.includes('--files');
const onlyFolders = args.includes('--folders');


const dirArg = args.find(arg => !arg.startsWith('--'));
const dir = dirArg || '.';



const formatSize = (size) => {
    if (size < 1024) {
        return `${size} B`
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }
}

// Podemos envolver esto en un try-catch para manejar errores de lectura del directorio. Si el directorio no existe, lanzamos este error.
let files
try {
    files = await readdir(dir)
} catch (error) {
    console.error(`Error: No se pudo leer el directorio ${dir}`)
    process.exit(1)
}

const entries = await Promise.all(files.map(async (name) => {
    const path = join(dir, name)
    const info = await stat(path)
    return {
        name,
        isDir: info.isDirectory(),
        size: info.size,
    }
}))

let filteredEntries = entries

if (onlyFiles) {
    filteredEntries = entries.filter(entry => !entry.isDir)
} else if (onlyFolders) {
    filteredEntries = entries.filter(entry => entry.isDir)
}

if (isAsc) {
    filteredEntries.sort((a, b) => a.name.localeCompare(b.name))
} else if (isDesc) {
    filteredEntries.sort((a, b) => b.name.localeCompare(a.name))
}
/* 
// Otra manera de hacerlo, para evitar tanto if/else if
const isOnlyFiles = onlyFiles && !onlyFolders;
const isOnlyFolders = onlyFolders && !onlyFiles;

filteredEntries = isOnlyFiles ? filteredEntries.filter((entry) => !entry.isDir) : filteredEntries;
filteredEntries = isOnlyFolders ? filteredEntries.filter((entry) => entry.isDir) : filteredEntries;

filteredEntries = isAsc ? filteredEntries.sort((a, b) => a.name.localeCompare(b.name)) : filteredEntries;
filteredEntries = isDesc ? filteredEntries.sort((a, b) => b.name.localeCompare(a.name)) : filteredEntries;
 */


for (const entry of filteredEntries) {
    const icon = entry.isDir ? "📁" : "📄"
    const sizeInfo = entry.isDir ? "" : ` (${formatSize(entry.size)})`

    console.log(`${icon} ${entry.name.padEnd(25)}  ${sizeInfo}`)
}

// Excelente trabajo! :)

