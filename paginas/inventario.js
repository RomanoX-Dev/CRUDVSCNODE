// METODOS CRUD LOCAL

// Detecta automáticamente si estás en localhost o usando la IP de tu red local (192.168.1.158)
const API_URL = `http://${window.location.hostname}:3000`;

// CREATE
const botonGuardar = document.getElementById('btn-save');

document.getElementById('formularioProducto').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;
    const proveedor = document.getElementById('proveedor').value;
    const divalert = document.getElementById('alertas'); //prueba

    if (!nombre || !precio || !stock || !proveedor)  {
        divalert.textContent = "⚠️ Por favor, llena los campos, nombre, precio, stock y proveedor.";
        setTimeout(() => {
            divalert.textContent = "";
        }, 3500);
        return;
    }

    try {
        alert("Enviando...");
        
        // Corregido: Ahora usa la API_URL dinámica
        const respuesta = await fetch(`${API_URL}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio, stock, proveedor })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(`✅ ¡Producto guardado con exito! ${resultado.mensaje}. ID: ${resultado.id}`);
            document.getElementById('formularioProducto').reset(); 
        } else {
            alert(`❌ Error: ${resultado.error}`);
        }


    } catch (error) {
        console.error('Error en la conexión:', error);
           alert('❌ No se pudo conectar con el servidor de Node.js.');
    }
});

// READ 

const botonGet = document.getElementById('btn-get');

if (botonGet) {
    botonGet.addEventListener('click', async () => {
        const idInput = document.getElementById('id').value;
        const divOutput = document.getElementById('divs');

        if (!idInput) {
            alert("⚠️ Por favor, ingresa un ID para buscar.");
            return;
        }

        try {
            alert("Buscando producto...");

            // Corregido: Ahora usa la API_URL dinámica
            const respuesta = await fetch(`${API_URL}/productos/${idInput}`);
            const resultado = await respuesta.json();

            if (respuesta.ok) {
                // Si lo encuentra, rellenamos automáticamente los demás inputs del formulario
                document.getElementById('nombre').value = resultado.nombre;
                document.getElementById('precio').value = resultado.precio;
                document.getElementById('stock').value = resultado.stock;
                document.getElementById('proveedor').value = resultado.proveedor;
                alert(`✅ ¡Se encontro un producto! (Con un ID de: ${resultado.id})`);
            } else {

                alert(`❌ Error: ${resultado.error}`);
            }

        } catch (error) {
            console.error('Error en la conexión:', error);
            alert('❌ No se pudo conectar con el servidor.');
        }
    });
}


// ACTUALIZAR PRODUCTO

const botonUpdate = document.getElementById('btn-update');

if (botonUpdate) {
    botonUpdate.addEventListener('click', async () => {
        const id = document.getElementById('id').value;
        const nombre = document.getElementById('nombre').value;
        const precio = document.getElementById('precio').value;
        const stock = document.getElementById('stock').value;
        const proveedor = document.getElementById('proveedor').value;

        if (!id || !nombre || !precio || !stock || !proveedor) {
            alert("⚠️ Por favor, ingresa el ID, nombre, precio, stock, proveedor para actualizar.");
            return;
        }

        try {
            alert("Actualizando producto...");

            // Corregido: Ahora usa la API_URL dinámica
            const respuesta = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, precio, stock, proveedor})
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(`✅ ¡Éxito! ${resultado.mensaje}`);
            } else {
                alert(`❌ Error: ${resultado.error}`);
            }

        } catch (error) {
            console.error('Error en la conexión:', error);
            alert('❌ No se pudo conectar con el servidor.');
        }
    });
}

// ELIMINAR PRODUCTO (DELETE)

const botonDelete = document.getElementById('btn-delete');

if (botonDelete) {
    botonDelete.addEventListener('click', async () => {
        const id = document.getElementById('id').value;

        if (!id) {
            alert("⚠️ Por favor, ingresa el ID del producto para eliminar.");
            return;
        }

        
        if (!confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
            return;
        }

        try {
            alert("Eliminando producto...");

            // Corregido: Tenías una URL rota sin puerto ni la ruta '/productos'. Ahora usa API_URL
            const respuesta = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE'
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert(`✅ ¡Producto eliminado exitosamente! ${resultado.mensaje}`);
                document.getElementById('id').value = '';
                document.getElementById('nombre').value = '';
                document.getElementById('precio').value = '';
                document.getElementById('stock').value = '';
                document.getElementById('proveedor').value = '';
                
            } else {
                alert(`❌ Error: ${resultado.error}`);
            }

        } catch (error) {
            console.error('Error en la conexión:', error);
            alert('❌ No se pudo conectar con el servidor.');
        }
    });
}


//Crear tabla

 async function obtenerProductosDeBD() {
      try {

        const respuesta = await fetch(`${API_URL}/productos`);
        const listaProductos = await respuesta.json();
        const tbody = document.getElementById('tablaProductos');
        if (!tbody) return;

        tbody.innerHTML = ''; // Limpiar la tabla por si acaso

        if (listaProductos.length === 0) {
            const filaVacia = document.createElement('tr');
            
            // Usamos colspan="5" porque tienes 5 columnas (ID, Nombre, Precio, Stock, Proveedor)
            filaVacia.innerHTML = `
                <td colspan="5" class="tabla-vacia-mensaje">
                    <span>📦</span> No hay ningún producto registrado en el inventario.
                </td>
            `;
            
            tbody.appendChild(filaVacia);
            return; // Detiene la ejecución aquí para que no intente hacer el forEach
        }

        listaProductos.forEach(item => {
          const fila = document.createElement('tr');
          
           fila.innerHTML = `
          <td>${item.id}</td>
          <td>${item.nombre}</td>
          <td class="precio">$${parseFloat(item.precio).toFixed(2)} MXN</td>
          <td class="stock-celda">${item.stock} pzas</td>
          <td>${item.proveedor}</td>
         `;
          
          tbody.appendChild(fila);
        });

      } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
      }
    }
    
    document.addEventListener('DOMContentLoaded', obtenerProductosDeBD);
    setInterval(obtenerProductosDeBD, 4000);