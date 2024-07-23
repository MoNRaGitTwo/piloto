import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/styles.css';

const Pedidos = () => {
  const productosComprar = useSelector((state) => state.listaProductosComprar.productosComprar);

  if (productosComprar.length === 0) {
    return <div>No hay productos en pedidos</div>;
  }

  return (
    <div className='container'>
      <h1>Pedidos</h1>
      <ul className='list-group'>
        {productosComprar.map((producto) => (
          <li key={producto.Id} className='list-group-item'>
            <span>{producto.Name}</span> - <span>$ {producto.Price}</span> - <span>Stock: {producto.Stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pedidos;
