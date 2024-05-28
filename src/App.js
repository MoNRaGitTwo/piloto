import React, { useState, useEffect } from 'react';
import AddProductForm from './componentes/CrearProducto'


function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Realizar la solicitud HTTP al endpoint del backend
    fetch('https://e690-2800-a4-1114-9400-bc2e-8694-c4a9-f967.ngrok-free.app/TodoProductos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error');
        }
        return response.json();
      })
      .then(data => {
        // Procesar la respuesta y establecer los productos en el estado
        setProductos(data);
      })
      .catch(error => {
        console.error('Error al obtener pdroductos:', error);
      });
  }, []); // Se ejecutará solo una vez al cargar el componente

  return (
    <div>
      <h1>Productos</h1>
      <AddProductForm></AddProductForm>
      <ul>
        {productos.map(producto => (
          <li key={producto.Id}>
            {producto.Name} - {producto.Price}
          </li>
        ))}
      </ul>
    </div>

      
  );
}

export default Productos;