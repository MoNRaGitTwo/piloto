import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientes } from '../reducers/clientesSlice';
import axios from 'axios';
import { API_BASE_URL2 } from '../config';

const CompraDetalle = () => {
  const [selectedCliente, setSelectedCliente] = useState('');
  const [compras, setCompras] = useState([]);
  const clientesGlobales = useSelector(state => state.storeClientes.clientesSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const handleClienteChange = async (event) => {
    const clienteId = event.target.value;
    setSelectedCliente(clienteId);

    if (clienteId) {
      try {
        const response = await axios.get(`${API_BASE_URL2}/ObtenerComprasCliente/${clienteId}`, {
            
          headers: {
            'ngrok-skip-browser-warning': 'true'  // Añade este parámetro
          }
        });

        const comprasData = Array.isArray(response.data) ? response.data : [response.data];
        setCompras(comprasData);
      } catch (error) {
        console.error('Error al obtener detalles de compra:', error);
      }
    } else {
      setCompras([]);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Detalles de Compras por Cliente</h2>
      <div className="form-group">
        <label htmlFor="clienteSelect">Seleccionar Cliente:</label>
        <select
          id="clienteSelect"
          className="form-control"
          value={selectedCliente}
          onChange={handleClienteChange}
        >
          <option value="">Seleccione un cliente</option>
          {clientesGlobales.map(cliente => (
            <option key={cliente.Id} value={cliente.Id}>{cliente.Nombre}</option>
          ))}
        </select>
      </div>

      {compras.length > 0 ? (
        <div>
          <h3>Detalle de Compras:</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Detalle</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra, index) => (
                <tr key={index}>
                  <td>{new Date(compra.Fecha).toLocaleDateString()}</td>
                  <td>{compra.Detalle}</td>
                  <td>{compra.Total ? `$${compra.Total.toFixed(2)}` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedCliente ? (
        <p>No hay compras registradas para este cliente.</p>
      ) : (
        <p>Seleccione un cliente para ver los detalles de sus compras.</p>
      )}
    </div>
  );
};

export default CompraDetalle;
