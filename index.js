const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        serveFile(res, './public/index.html', 'text/html');
    }
    else if (req.url === '/menu' && req.method === 'GET') {
        serveFile(res, 'public/menu.html', 'text/html');
    }
    else if (req.url === '/promociones' && req.method === 'GET') {
        serveFile(res, './public/promociones.html', 'text/html');
    }
    else if (req.url === '/carrito' && req.method === 'GET') {
        serveFile(res, './public/carrito.html', 'text/html');
    }

    else if (req.url === '/asset/css/app.css' && req.method === 'GET') {
        serveFile(res, './public/asset/css/app.css', 'text/css');
    }
    else if (req.url === '/api/productos' && req.method === 'GET') {
        fs.readFile('./data/productos.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error en el servidor');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    }

    else if ((req.url.startsWith('/asset/js/') || req.url.startsWith('/asset/img/')) && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/plain';

        switch (extname) {
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;

        }
        serveFile(res, filePath, contentType);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error en el servidor');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
};

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});