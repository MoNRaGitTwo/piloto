import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../config';

const ProveedoresConProductos = () => {
  const [selectedProveedorId, setSelectedProveedorId] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const proveedoresGlobal = useSelector(state => state.storeProveedor.proveedorSlice);

  useEffect(() => {
    if (selectedProveedorId) {
      const fetchProductos = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/ObtenerProductosPorProveedor/${selectedProveedorId}`,
            {
              headers: {
                'ngrok-skip-browser-warning': 'true'
              }
            }
          );
          console.log('Response:', response.data); // Log de la respuesta
          setProductos(response.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching products:', err); // Log de error
          setError(err.message);
          setLoading(false);
        }
      };

      fetchProductos();
    }
  }, [selectedProveedorId]);

  const handleProveedorChange = (e) => {
    setSelectedProveedorId(e.target.value);
  };

  return (
    <div>
      <h2>Seleccione un Proveedor</h2>
      <select onChange={handleProveedorChange} value={selectedProveedorId}>
        <option value="">Seleccione un proveedor</option>
        {proveedoresGlobal.map(proveedor => (
          <option key={proveedor.Id} value={proveedor.Id}>
            {proveedor.Nombre}
          </option>
        ))}
      </select>

      {loading && <div>Cargando productos...</div>}
      {error && <div>Error: {error}</div>}
      
      {productos.length > 0 && (
        <div>
          <h2>Productos del proveedor {selectedProveedorId}</h2>
          <ul>
            {productos.map(producto => (
              <li key={producto.Id}>{producto.Name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProveedoresConProductos;
