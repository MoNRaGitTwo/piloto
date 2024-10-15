// src/componentes/PedidosDos.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPedidosDos, updateEstadoPedido, updatePedidoList, eliminarPedido } from '../reducers/pedidoDosSlice';
import { API_BASE_URL3 } from '../config';

const PedidosDos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Estado para guardar los usuarios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
 // const pedidosGlobales = useSelector((state) => state.pedidoDosStore.pedidos); // Obtén los pedidos globales

  useEffect(() => {
    const fetchPedidosYUsuarios = async () => {
      try {
        // Obtener pedidos
        const responsePedidos = await axios.get(`${API_BASE_URL3}/api/Pedidos`);
        const dataPedidos = responsePedidos.data.$values || [];
        setPedidos(dataPedidos);
        dispatch(setPedidosDos(dataPedidos)); // Agrega los pedidos al store global

        // Obtener usuarios
        const responseUsuarios = await axios.get(`${API_BASE_URL3}/api/Users`);
        const dataUsuarios = responseUsuarios.data.$values || [];
        setUsuarios(dataUsuarios); // Guarda los usuarios en el estado

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPedidosYUsuarios();
  }, [dispatch]);

  const getNombreUsuario = (userId) => {
    const user = usuarios.find(u => u.Id === userId); // Usa todosUsuarios para encontrar el usuario
    return user ? user.Nombre : 'Desconocido'; // Devuelve el nombre si lo encuentra
  };

  const handleEstadoChange = async (pedidoId) => {
    const pedidoActual = pedidos.find(pedido => pedido.Id === pedidoId);
    if (!pedidoActual) return;
  
    let nuevoEstado;
    switch (pedidoActual.Estado) {
      case 'Pendiente':
        nuevoEstado = 'En proceso';
        break;
      case 'En proceso':
        nuevoEstado = 'Listo';
        break;
      case 'Listo':
        // Confirm deletion
        if (window.confirm("¿Deseas eliminar este pedido?")) {
          await handleEliminarPedido(pedidoId); // Eliminar pedido
          return;  // **Retorna inmediatamente después de eliminar**
        }
        return; // No continuar si ya se ha eliminado el pedido
      default:
        nuevoEstado = 'Pendiente';
    }
  
    // Actualiza el estado localmente
    const updatedPedidos = pedidos.map(pedido =>
      pedido.Id === pedidoId ? { ...pedido, Estado: nuevoEstado } : pedido
    );
    setPedidos(updatedPedidos);
  
    // Actualiza el estado en el servidor
    try {
      await axios.put(`${API_BASE_URL3}/api/Pedidos/${pedidoId}`, {
        ...pedidoActual,
        Estado: nuevoEstado
      });
  
      // Dispatch action to update global state
      dispatch(updateEstadoPedido({ pedidoId, nuevoEstado }));
  
    } catch (error) {
      console.error('Error updating estado:', error);
    }
  };
  

  const handleEliminarPedido = async (pedidoId) => {
    try {
      // Eliminar el pedido del servidor (primera eliminación)
      await axios.delete(`${API_BASE_URL3}/api/Pedidos/${pedidoId}`);
  
      // Eliminar el pedido de la lista local
      const updatedPedidos = pedidos.filter(pedido => pedido.Id !== pedidoId);
      setPedidos(updatedPedidos);
  
      // Eliminar el pedido del store global (sin hacer otra llamada a la API)
      dispatch({
        type: 'pedidos/eliminarPedidoManual', // Acción manual
        payload: pedidoId
      });
  
      alert('Pedido eliminado correctamente.');
    } catch (error) {
      console.error('Error deleting pedido:', error);
      alert('Error al eliminar el pedido.');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Lista de Pedidos</h1>
      <table>
        <thead>
          <tr>
            <th>Pedido ID</th>
            <th>Usuario</th>
            <th>Detalles</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={`pedido-${pedido.Id}`}>
              <td>{pedido.Id}</td>
              <td>{getNombreUsuario(pedido.UserId)}</td>
              <td>
                <ul>
                  {(pedido.DetallesPedidos?.$values || []).map((detalle, index) => (
                    <li key={`detalle-${pedido.Id}-${detalle.Id}-${index}`}>
                      <strong>Producto:</strong> {detalle.Nombre}, <strong>Precio:</strong> {detalle.Precio} MXN, <strong>Cantidad:</strong> {detalle.Cantidad}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button
                  onClick={() => handleEstadoChange(pedido.Id)}
                  style={{
                    backgroundColor: getButtonColor(pedido.Estado),
                    color: 'white',
                    padding: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {pedido.Estado}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Function to get button color based on estado
const getButtonColor = (estado) => {
  switch (estado) {
    case 'Pendiente':
      return 'darkred';
    case 'En proceso':
      return 'darkorange';
    case 'Listo':
      return 'darkgreen';
    default:
      return 'gray';
  }
};

export default PedidosDos;
