document.addEventListener('DOMContentLoaded', () => {
    /*fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('productos');
            if (Array.isArray(data)) {
                data.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.nombre}" class="product-image">
                        <h3>${product.nombre}</h3>
                        <p>${product.descripcion}</p>
                        <p>Precio: $${product.precio}</p>
                        <button class="agregar-al-carrito-btn" data-id="${product.id}" data-nombre="${product.nombre}">Agregar al Carrito</button>
                    `;
                    container.appendChild(productCard);
                });
            }
        })
        .catch(error => console.error('Error al cargar productos:', error));
        */

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('agregar-al-carrito-btn')) {
            const id = event.target.dataset.id;
            const nombre = event.target.dataset.nombre;
            mostrarModal(id, nombre);  // Mostrar el modal para seleccionar la cantidad
        }
    });
});

// Mostrar el modal para seleccionar la cantidad
function mostrarModal(id, nombre) {
    const modal = document.getElementById('modal');
    const modalBackground = document.getElementById('modalBackground');
    const cantidadInput = document.getElementById('cantidad');

    modal.style.display = 'block';
    modalBackground.style.display = 'block';

    // Confirmar cantidad
    document.getElementById('confirmarCantidad').onclick = () => {
        const cantidad = cantidadInput.value;
        agregarProductoCarrito(id, cantidad); // Llamar a la función para agregar al carrito
        modal.style.display = 'none';
        modalBackground.style.display = 'none';
    };

    // Cancelar y cerrar el modal
    document.getElementById('cancelarModal').onclick = () => {
        modal.style.display = 'none';
        modalBackground.style.display = 'none';
    };
}

// Agregar el producto al carrito
function agregarProductoCarrito(id, cantidad) {
    fetch('/api/agregar-al-carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, cantidad }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);  // Mostrar mensaje de éxito
        // Preguntar si el usuario quiere ir al carrito o seguir comprando
        const redirigir = confirm("Producto agregado al carrito. ¿Quieres ver tu carrito?");
        if (redirigir) {
            window.location.href = "/carrito";  // Redirigir al carrito
        }
    })
    .catch(error => console.error('Error al agregar producto al carrito:', error));
}

