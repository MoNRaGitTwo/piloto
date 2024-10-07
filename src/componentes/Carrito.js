import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { guardarPedido } from '../reducers/pedidoDosSlice';
import { reducirStockAsync } from '../reducers/productosSlice';
import { clearCarrito, eliminarProducto } from '../reducers/carritoSlice';
import { actualizarDeudaAsync, updateUser } from '../reducers/userSlice';
import '../styles/styles.css';

const Carrito = () => {
  const dispatch = useDispatch();

  const carrito = useSelector((state) => state.storeCarrito.carritolice);
  const cantidad = useSelector((state) => state.storeCantidad);
  const usuariosGlobalesLogueado = useSelector((state) => state.storeUser.usuarios);
  const pedidosGlobales = useSelector((state) => state.pedidoDosStore.pedidos);

  const [mensajeExito, setMensajeExito] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const usuarioActual = usuariosGlobalesLogueado[0];
  const pedidosUsuarioActual = pedidosGlobales.filter((pedido) => pedido.UserId === usuarioActual.id);

  const handleEliminarProducto = (productoId) => {
    dispatch(eliminarProducto(productoId));
  };

  // Calcular el total del carrito
  const totalCarrito = carrito.reduce((total, producto) => {
    const cantidadComprada = cantidad[producto.Id] || 1;
    return total + producto.Price * cantidadComprada;
  }, 0);

  const handleComprar = async () => {
    if (isLoading) return;

    const metodoPago = window.confirm('¿La compra es a crédito? (Aceptar para crédito, Cancelar para efectivo)');
  
    const pedido = {
      UserId: usuarioActual.id,
      FechaPedido: new Date().toISOString(),
      Total: totalCarrito,
      Estado: 'Pendiente',
      DetallesPedidos: carrito.map((producto) => ({
        ProductoId: producto.Id,
        Precio: producto.Price,
        Nombre: producto.Name,
        Cantidad: cantidad[producto.Id] || 1,
      })),
    };

    try {
      setIsLoading(true);
      await dispatch(guardarPedido(pedido)).unwrap();

      for (const producto of carrito) {
        const cantidadComprada = cantidad[producto.Id] || 1;
        await dispatch(reducirStockAsync({ id: producto.Id, cantidadComprada }));
      }

      if (metodoPago) {
        const nuevaDeuda = usuarioActual.deuda + totalCarrito; // Sumar total del carrito a la deuda
        dispatch(updateUser({ id: usuarioActual.id, deuda: nuevaDeuda }));

        // Llamar a la acción asincrónica para actualizar la deuda en la base de datos
        await dispatch(actualizarDeudaAsync({ id: usuarioActual.id, nuevaDeuda }));
      }

      dispatch(clearCarrito());
      setMensajeExito('Pedido realizado con éxito');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoClase = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'btn btn-secondary';
      case 'En proceso':
        return 'btn btn-warning';
      case 'Listo':
        return 'btn btn-success';
      default:
        return 'btn btn-secondary';
    }
  };

  return (
    <div className='container'>
       <h1>Carrito</h1>
    {mensajeExito && <p className='alert alert-success'>{mensajeExito}</p>}
    <ul className='list-group'>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito</p>
      ) : (
        carrito.map((producto) => {
          const cantidadComprada = cantidad[producto.Id] || 1; // Obtén la cantidad desde el store o usa 1 por defecto
          const totalProducto = producto.Price * cantidadComprada; // Calcula el total por producto
          return (
            <li key={producto.Id} className='list-group-item'>
              <span>{producto.Name}</span> - 
              <span>$ {producto.Price}</span> - 
              <span>Cantidad: {cantidadComprada}</span> - 
              <span>Total: $ {totalProducto}</span>
              <button
                className='btn btn-danger ml-3'
                onClick={() => handleEliminarProducto(producto.Id)}
              >
                Eliminar
              </button>
            </li>
          );
        })
      )}
      
    </ul>
      {carrito.length > 0 && (
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <span>Total a pagar: $ {totalCarrito.toFixed(2)}</span>
          <button className='btn btn-primary' onClick={handleComprar}>
            Comprar
          </button>
        </div>
      )}

      {pedidosUsuarioActual.length > 0 && (
        <div>
          <h2>Mis Pedidos</h2>
          <table>
            <thead>
              <tr>
                <th>Cliente Nombre</th>
                <th>Detalles</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidosUsuarioActual.map((pedido) => (
                <tr key={pedido.Id}>
                  <td>{usuarioActual.nombre}</td>
                  <td>
                    <ul>
                      {(pedido.DetallesPedidos.$values && pedido.DetallesPedidos.$values.length > 0) ? (
                        pedido.DetallesPedidos.$values.map((detalle, index) => (
                          <li key={`${pedido.Id}-${detalle.ProductoId}-${index}`}>
                            <strong>Producto:</strong> {detalle.Nombre}, <strong>Precio:</strong> {detalle.Precio} MXN, <strong>Cantidad:</strong> {detalle.Cantidad}
                          </li>
                        ))
                      ) : (
                        <li>No hay detalles disponibles</li>
                      )}
                    </ul>
                  </td>
                  <td>
                    <button className={getEstadoClase(pedido.Estado)} disabled>
                      {pedido.Estado}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Carrito;
