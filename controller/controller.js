const fs = require('fs');
const path = require('path');

// Ruta de los archivos JSON
const productosPath = path.join(__dirname, '../data/productos.json');
const carritoPath = path.join(__dirname, '../data/carrito.json');

// Función para leer el archivo de productos
function getProductos(callback) {
    fs.readFile(productosPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo de productos', err);
            return callback([]);
        }
        const productos = JSON.parse(data);
        callback(productos);
    });
}

// Función para obtener el carrito y agregar el total por producto
function getCarrito(callback) {
    fs.readFile(path.join(__dirname, '..', 'data', 'carrito.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el carrito:', err);
            return callback([]);
        }

        const carrito = JSON.parse(data);

        // Agregar un campo `total` a cada item
        carrito.forEach(item => {
            item.total = item.precio * item.cantidad;
        });

        callback(carrito);
    });
}

// Función para agregar un producto al carrito
function agregarAlCarrito(id, cantidad, callback) {
    getProductos((productos) => {
        // Encontrar el producto que corresponde al ID
        const producto = productos.find(p => p.id === parseInt(id));

        if (!producto) {
            return callback('Producto no encontrado');
        }

        // Leer el carrito actual
        fs.readFile(carritoPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo del carrito', err);
                return callback('Error al acceder al carrito');
            }

            let carrito = JSON.parse(data);
            
            // Verificar si el producto ya está en el carrito
            const index = carrito.findIndex(item => item.id === producto.id);

            if (index !== -1) {
                // Si el producto ya está en el carrito, sumamos la cantidad
                carrito[index].cantidad += cantidad;
            } else {
                // Si el producto no está, lo agregamos al carrito con el nombre, precio y cantidad
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: cantidad,
                });
            }

            // Guardar el carrito actualizado
            fs.writeFile(carritoPath, JSON.stringify(carrito, null, 2), (err) => {
                if (err) {
                    console.error('Error al guardar el carrito', err);
                    return callback('Error al guardar el carrito');
                }
                callback('Producto agregado al carrito');
            });
        });
    });
}

// Exportar las funciones del controlador
module.exports = {
    getProductos,
    getCarrito,
    agregarAlCarrito
};
