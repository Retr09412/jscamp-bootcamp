import { readdir, stat} from 'node:fs/promises'
import { join } from 'node:path'


if (process.permission.has("fs.read") === false) {
    console.error("Error: Esta accion requiere permisos de lectura en el sistema de archivos.")
}


else{
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


    const files = await readdir(dir)


    const entries = await Promise.all(files.map(async (name) => {
        const path = join(dir, name)
        const info = await stat(path)
        return { name, 
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
    


        for (const entry of filteredEntries) {
        const icon = entry.isDir ? "📁"  : "📄"
        const sizeInfo = entry.isDir ? "" : ` (${formatSize(entry.size)})`

        console.log(`${icon} ${entry.name.padEnd(25)}  ${sizeInfo}`)
    }


}

