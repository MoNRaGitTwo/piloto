import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProductoPedido, guardarPedido } from '../reducers/pedidosSlice';
import '../styles/styles.css';

const Carrito = () => {
  const dispatch = useDispatch();
  
  const carrito = useSelector((state) => state.storeCarrito.carritolice);

  const handleComprar = () => {
    const pedido = {
      ClienteId: 1,  // Asigna el ID del cliente correspondiente
      FechaPedido: new Date().toISOString(),
      Total: 10,
      Estado: 'Pendiente',
      DetallesPedidos: carrito.map(producto => ({
        ProductoId: producto.Id,
        Cantidad: producto.Stock,
        Precio: producto.Price,
        

      }))
    };
      console.log("Soy el pedido" , pedido)
    dispatch(guardarPedido(pedido));
    carrito.forEach((producto) => {
      dispatch(addProductoPedido(producto));
    });
  };

  if (carrito.length === 0) {
    return <div>No hay productos en el carrito</div>;
  }

  return (
    <div className='container'>
      <h1>Carrito</h1>
      <ul className='list-group'>
        {carrito.map((producto) => (
          <li key={producto.Id} className='list-group-item'>
            <span>{producto.Name}</span> - <span>$ {producto.Price}</span> - <span>Stock: {producto.Stock}</span>
          </li>
        ))}
      </ul>
      <button className='btn btn-primary mt-3' onClick={handleComprar}>
        Comprar
      </button>
    </div>
  );
};

export default Carrito;
