import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL2 } from '../config';
import {  setClientes, actualizarDeudaCliente } from '../reducers/clientesSlice';

const ClientesList = () => {
  const dispatch = useDispatch();
  const clientesGlobales = useSelector(state => state.storeClientes.clientesSlice);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [montoPago, setMontoPago] = useState(0); // Estado para almacenar el monto a pagar

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL2}/TodosClientes`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        dispatch(setClientes(response.data));
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClientes();
  }, [dispatch]);

  const handlePagarDeuda = async (clienteId, deudaActual) => {
    if (montoPago <= 0 || montoPago > deudaActual) {
      alert('Ingrese un monto válido menor o igual a la deuda actual.');
      return;
    }

    const nuevaDeuda = deudaActual - montoPago;
    try {
      await dispatch(actualizarDeudaCliente({ clienteId, nuevaDeuda }));
      alert(`Deuda actualizada exitosamente para el cliente con ID ${clienteId}`);
    } catch (error) {
      alert(`Error al actualizar la deuda del cliente: ${error.message}`);
    }
  };

  const renderClientes = () => (
    <ul>
      {clientesGlobales.map(cliente => (
        <li key={cliente.Id}>
          {cliente.Nombre} - Deuda: ${cliente.Deuda.toFixed(2)}
          <div>
            <input
              type="number"
              value={montoPago}
              onChange={(e) => setMontoPago(parseInt(e.target.value))}
              placeholder="Ingrese monto"
            />
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={() => handlePagarDeuda(cliente.Id, cliente.Deuda)}
            >
              Pagar Deuda
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Listado de Clientes</h2>
      {renderClientes()}
    </div>
  );
};

export default ClientesList;


/*
// components/ClientesList.js

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Importa axios si prefieres usarlo en lugar de fetch
import { API_BASE_URL2 } from '../config';
import { setClientes  } from '../reducers/clientesSlice';

const ClientesList = () => {
  const dispatch = useDispatch();
  const clientesGlobales = useSelector(state => state.storeClientes.clientesSlice);
  const [clientes, seetClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL2}/TodosClientes`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });        
        seetClientes(response.data);
        dispatch(setClientes(response.data));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Listado de Clientes</h2>
      <ul>
        {clientesGlobales.map(cliente => (
          <li key={cliente.Id}>
            {cliente.Nombre} - Deuda: {cliente.Deuda}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesList;


*/
