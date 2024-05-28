import React, { useState, useEffect } from 'react';
import AddProductForm from './componentes/CrearProducto';

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // URL del backend expuesta a través de Ngrok
    const ngrokUrl = 'https://fb2b-2800-a4-119b-6900-bc2e-8694-c4a9-f967.ngrok-free.app/Products/TodoProductos';

    // Realizar la solicitud HTTP al endpoint del backend con el encabezado para omitir la advertencia de Ngrok
    fetch(ngrokUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true' // Agregar este encabezado
      }
    })
      .then(response => {
        console.log('Status:', response.status); // Imprimir el estado de la respuesta
        console.log('Headers:', response.headers); // Imprimir los encabezados de la respuesta

        if (!response.ok) {
          throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        return response.json(); // Obtener la respuesta como JSON
      })
      .then(data => {
        console.log('Response data:', data); // Imprimir la respuesta del servidor
        setProductos(data);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, []); // Se ejecutará solo una vez al cargar el componente

  return (
    <div>
      <h1>Productos</h1>
      <AddProductForm />
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
