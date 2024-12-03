const fs = require('fs');
const path = require('path');

// Función para servir archivos estáticos
const serveStaticFiles = (req, res) => {
    // Ajustar la ruta para que empiece desde 'public'
    let filePath = path.join(__dirname, '..', 'public', req.url);

    // Verificar si el archivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Si el archivo no existe, responder con un error 404
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
        } else {
            // Obtener la extensión del archivo
            const ext = path.extname(filePath);
            
            // Definir el tipo de contenido basado en la extensión del archivo
            const contentTypeMap = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.ico': 'image/x-icon'
            };

            // Asignar el tipo de contenido, si no existe asignar 'application/octet-stream'
            const contentType = contentTypeMap[ext] || 'application/octet-stream';

            // Enviar la cabecera y el archivo al cliente
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(res);
        }
    });
};



module.exports = { serveStaticFiles };
