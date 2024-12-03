const http = require('http');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const controller = require('./controller/controller'); // Importamos el controlador
const { serveStaticFiles } = require('./utils/staticHandler'); // Correcta importación de la función

const port = 3000;



const server = http.createServer((req, res) => {
    // Ruta para servir la página principal
    if (req.url === '/' && req.method === 'GET') {
        renderTemplate(res, 'index', {});  // Usamos Handlebars para renderizar la plantilla de inicio
    }
    // Ruta para el menú con los productos
    else if (req.url === '/menu' && req.method === 'GET') {
        controller.getProductos((productos) => {
            if (productos.length > 0) {
                renderTemplate(res, 'menu', { productos });  // Pasamos los productos a la plantilla
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('No productos disponibles');
            }
        });
    }
    // Ruta para obtener los productos desde la API
    else if (req.url === '/api/productos' && req.method === 'GET') {
        controller.getProductos((productos) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(productos));
        });
    }
    // Ruta para ver el carrito de compras
    else if (req.url === '/carrito' && req.method === 'GET') {
        controller.getCarrito((carrito) => {
            renderTemplate(res, 'carrito', { carrito });  // Renderizamos la vista del carrito
        });
    }
    // Ruta para agregar productos al carrito
    else if (req.url === '/api/agregar-al-carrito' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            const { id, cantidad } = JSON.parse(body);
            controller.agregarAlCarrito(id, cantidad, (message) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message }));
            });
        });
    }
    // Ruta para archivos estáticos como CSS, imágenes, etc.
    else if (req.url.startsWith('/asset/') && req.method === 'GET') {
        serveStaticFiles(req, res); // Usamos la función importada para servir archivos estáticos
    }
    // Si la ruta no es encontrada
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Función para renderizar plantillas con Handlebars
function renderTemplate(res, templateName, data) {
    const filePath = path.join(__dirname, 'vistas', `${templateName}.hbs`); // Asegúrate de que las plantillas están en 'vistas/'
    
    fs.readFile(filePath, 'utf8', (err, templateContent) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al leer la plantilla');
        } else {
            const template = handlebars.compile(templateContent);
            const output = template(data);  // Pasamos los datos a la plantilla

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(output);  // Respondemos con la plantilla renderizada
        }
    });
}

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
