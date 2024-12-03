const fs = require('fs');
const path = require('path');

//función para generar la estructura de carpetas y archivos
function listFiles(dirPath, fileList = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        // Omitir carpetas "node_modules" y carpetas ocultas (que comienzan con ".")
        if (file === 'node_modules' || file.startsWith('.')) {
            return; // Si es node_modules o una carpeta oculta, omitir
        }

        if (stat.isDirectory()) {
            //si es un carpeta se añade a la lista y sigue recursivamente
            fileList.push(`${fullPath}/`);
            listFiles(fullPath, fileList);
        } else {
            //si es archivo se añade a la lista
            fileList.push(fullPath);
        }
    });

    return fileList;
}

//llamar a la funcion para obtener la estructura del proyecto
const dirPath = path.join(__dirname);
const files = listFiles(dirPath);

//exportar la lista de archivos y carpetas a un .txt
fs.writeFileSync('estructura_proyecto.txt', files.join('\n'), 'utf-8');
console.log('Estructura del proyecto exportada a estructura_proyecto.txt');


//en la terminal posicionarse en la carpeta donde está este archivo
// ejecutar este comando: node listFiles.js