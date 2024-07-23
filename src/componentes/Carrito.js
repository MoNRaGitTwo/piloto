import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProductoPedido } from '../reducers/pedidosSlice';
import '../styles/styles.css';

const Carrito = () => {
  const dispatch = useDispatch();
  
  const carrito = useSelector((state) => state.storeCarrito.carritolice);

  const handleComprar = () => {
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
