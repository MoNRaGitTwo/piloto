import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CompraDetalle = () => {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  const todosLosUsuarios = useSelector((state) => state.storeUser.todosUsuarios);
  console.log("Soy todos los usuarios, busco ID", todosLosUsuarios);

  const fetchPedido = async (userId) => {
    console.log("Entrando a fetchPedido con userId:", userId); // Verifica si se ejecuta
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5153/api/Pedidos/user/${userId}`);
      console.log("Soy los pedidos con detalle en CompraDetalle", response.data);

      // Accedemos al primer elemento si hay datos
      if (response.data.$values && response.data.$values.length > 0) {
        setPedido(response.data.$values[0]);
      } else {
        setPedido(null);
      }
    } catch (error) {
      console.error("Error al cargar los detalles del pedido:", error);
      setError('Error al cargar los detalles del pedido.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value.trim(); // Elimina espacios adicionales
    console.log("Soy el userId", userId); // Verifica que solo se imprima el ID
    setSelectedUserId(userId);

    // Verifica si el userId es un número válido
    if (userId && !isNaN(userId)) {
      fetchPedido(userId);
    } else {
      setPedido(null);
      console.log("El userId no es válido:", userId); // Para depuración
    }
  };

  return (
    <div>
      <h2>Detalle de Compra</h2>

      <label htmlFor="user-select">Seleccione un usuario:</label>
      <select id="user-select" value={selectedUserId} onChange={handleUserChange}>
        <option value="">Seleccione un usuario</option>
        {todosLosUsuarios.map((usuario) => (
          <option key={usuario.Id} value={usuario.Id}>
            {usuario.Nombre} (ID: {usuario.Id}) {/* Asegúrate de usar el UserId correcto */}
          </option>
        ))}
      </select>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {pedido && (
        <div>
          <h3>Detalle del Pedido #{pedido.Id}</h3>
          <p>Usuario ID: {pedido.UserId}</p>
          <p>Fecha: {new Date(pedido.FechaPedido).toLocaleDateString()}</p>
          <p>Total: ${pedido.Total.toFixed(2)}</p>
          <p>Estado: {pedido.Estado}</p>

          <h4>Detalles del Pedido</h4>
          <ul>
            {pedido.DetallesPedidos.$values.map((detalle) => (
              <li key={detalle.Id}>
                <p>Producto: {detalle.Nombre}</p>
                <p>Cantidad: {detalle.Cantidad}</p>
                <p>Precio: ${detalle.Precio.toFixed(2)}</p>
                <p>Subtotal: ${(detalle.Cantidad * detalle.Precio).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompraDetalle;
