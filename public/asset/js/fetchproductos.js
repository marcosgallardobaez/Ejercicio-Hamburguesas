document.addEventListener('DOMContentLoaded', () =>{

    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON de productos');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('productos');
            if (!container) {
                console.error('No se encontró el contenedor para los productos');
                return;
            }

            data.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.nombre}">
                    <h3>${product.nombre}</h3>
                    <p>${product.descripcion}</p>
                    <p>Precio: $${product.precio}</p>
                    <button>Agregar al Carrito</button>
                `;
                container.appendChild(productCard);
            });
        })
        .catch(error => console.error('Error al cargar productos:', error))
});

