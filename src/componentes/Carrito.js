import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { guardarPedido } from '../reducers/pedidoDosSlice';
import { reducirStockAsync } from '../reducers/productosSlice';
import { clearCarrito, eliminarProducto } from '../reducers/carritoSlice';
import { actualizarDeudaAsync, updateUser } from '../reducers/userSlice';
import { actualizarCajaAsync, obtenerCajaAsync } from '../reducers/cajaSlice'; // Importa las acciones de caja
import '../styles/styles.css';

const Carrito = () => {
  const dispatch = useDispatch();
  const carrito = useSelector((state) => state.storeCarrito.carritolice);
  const cantidad = useSelector((state) => state.storeCantidad);
  const usuarioActual = useSelector((state) => state.storeUser.usuarios);
  const pedidosGlobales = useSelector((state) => state.pedidoDosStore.pedidos);
  const [mensajeExito, setMensajeExito] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState(null); // Nuevo estado para método de pago
  const [mostrarTarjeta, setMostrarTarjeta] = useState(false); // Estado para mostrar la tarjeta

  const idUsuarioActual = usuarioActual[0]?.id;
  const nombreUsuarioActual = usuarioActual[0]?.nombre;


  const pedidosUsuarioActual = pedidosGlobales.filter((pedido) => {
    const userIdPedido = Number(pedido.UserId);
    const userIdActual = Number(idUsuarioActual);
    //console.log("soy pedidos actuales " , pedidosUsuarioActual);
    
    return userIdPedido === userIdActual;
  });

  const handleEliminarProducto = (productoId) => {
    dispatch(eliminarProducto(productoId));
  };

  const totalCarrito = carrito.reduce((total, producto) => {
    const cantidadComprada = cantidad[producto.Id] || 1;
    return total + producto.Price * cantidadComprada;
  }, 0);

  const handleSeleccionMetodo = (metodo) => {
    setMetodoPago(metodo);
  };

  const handleComprar = () => {
    if (carrito.length > 0) {
      setMostrarTarjeta(true); // Mostrar la tarjeta de métodos de pago después de hacer clic en comprar
    }
  };

  const handleConfirmarCompra = async () => {
    if (isLoading || !metodoPago) return;

    const pedido = {
      UserId: idUsuarioActual,
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

      // Define montos solo según el método de pago seleccionado
      let montoEfectivo = 0;
      let montoCredito = 0;
      if (metodoPago === 'efectivo') {
        montoEfectivo = totalCarrito;
      } else if (metodoPago === 'credito') {
        montoCredito = totalCarrito;
      }

      // Llama a la acción para actualizar la caja
      await dispatch(actualizarCajaAsync({ montoEfectivo, montoCredito }));

      if (metodoPago === 'credito') {
        const nuevaDeuda = usuarioActual[0].deuda + totalCarrito;
        dispatch(updateUser({ id: idUsuarioActual, deuda: nuevaDeuda }));
        await dispatch(actualizarDeudaAsync({ id: idUsuarioActual, nuevaDeuda }));
      }

      dispatch(obtenerCajaAsync());

      dispatch(clearCarrito());
      setMensajeExito('Pedido realizado con éxito');
      setMetodoPago(null);
      setMostrarTarjeta(false); // Ocultar la tarjeta después de confirmar el pedido
      console.log('Método de pago seleccionado:', metodoPago);
      console.log('Monto efectivo enviado:', montoEfectivo);
      console.log('Monto crédito enviado:', montoCredito);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
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
            const cantidadComprada = cantidad[producto.Id] || 1;
            const totalProducto = producto.Price * cantidadComprada;
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

      {mostrarTarjeta && (
        <div className='tarjeta-pago'>
          <h3>Métodos de Pago</h3>
          <button
            className={`btn btn-primary ${metodoPago === 'credito' ? 'active' : ''}`}
            onClick={() => handleSeleccionMetodo('credito')}
          >
            Crédito
          </button>
          <button
            className={`btn btn-primary ${metodoPago === 'efectivo' ? 'active' : ''} ml-2`}
            onClick={() => handleSeleccionMetodo('efectivo')}
          >
            Efectivo
          </button>
          <button className='btn btn-success mt-3' onClick={handleConfirmarCompra}>
            Confirmar Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrito;
