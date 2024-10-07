import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setClientes } from '../reducers/clientesSlice';
import { actualizarDeudaAsync } from '../reducers/userSlice'; // Importar la acción asíncrona

const ClientesList = () => {
  const dispatch = useDispatch();
  
  const [clientesLocal, setClientesLocal] = useState([]); // Estado local para almacenar los clientes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [montosPago, setMontosPago] = useState({}); // Estado para almacenar el monto a pagar por cliente

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`http://localhost:5153/api/Users`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        console.log("Respuesta de la API:", response.data); // Ver la respuesta en la consola
        setClientesLocal(response.data.$values); // Acceder a los clientes dentro de $values
        dispatch(setClientes(response.data.$values)); // Actualizar el estado global si es necesario
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClientes();
  }, [dispatch]);

  const handlePagarDeuda = async (clienteId, deudaActual) => {
    const montoPago = montosPago[clienteId] || 0;

    if (montoPago <= 0 || montoPago > deudaActual) {
      alert('Ingrese un monto válido menor o igual a la deuda actual.');
      return;
    }

    const nuevaDeuda = deudaActual - montoPago;
    try {
      await dispatch(actualizarDeudaAsync({ id: clienteId, nuevaDeuda })); // Llamada a la acción asíncrona
      alert(`Deuda actualizada exitosamente para el cliente con ID ${clienteId}`);

      // Actualizar la deuda del cliente en el estado local
      const clientesActualizados = clientesLocal.map(cliente =>
        cliente.Id === clienteId
          ? { ...cliente, Deuda: nuevaDeuda } // Actualizar la deuda del cliente
          : cliente
      );
      setClientesLocal(clientesActualizados);

      // Opcional: limpiar el campo de pago después de realizar el pago
      setMontosPago({ ...montosPago, [clienteId]: 0 });
    } catch (error) {
      alert(`Error al actualizar la deuda del cliente: ${error.message}`);
    }
  };

  const handleMontoChange = (clienteId, value) => {
    // Asegurarse de que el valor sea un número o 0 si está vacío
    const monto = value ? parseInt(value) : 0;
    setMontosPago({ ...montosPago, [clienteId]: monto });
  };

  const renderClientes = () => (
    <ul>
      {clientesLocal.map(cliente => ( // Mapea los clientes del estado local
        <li key={cliente.Id}>
          {cliente.Nombre} - Deuda: ${cliente.Deuda.toFixed(2)}
          <div>
            <input
              type="number"
              value={montosPago[cliente.Id] || 0} // Mostrar el valor correspondiente a cada cliente
              onChange={(e) => handleMontoChange(cliente.Id, e.target.value)}
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
