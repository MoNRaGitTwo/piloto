import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProductoComprar } from '../reducers/listaProductosComprarSlice';
import '../styles/styles.css';

const Carrito = () => {
  const dispatch = useDispatch();
  const productosSugeridos = useSelector((state) => state.storeListaSugerida.productosSugeridos);

  const handleComprar = () => {
    productosSugeridos.forEach((producto) => {
      dispatch(addProductoComprar(producto));
    });
  };

  if (productosSugeridos.length === 0) {
    return <div>No hay productos en el carrito</div>;
  }

  return (
    <div className='container'>
      <h1>Carrito</h1>
      <ul className='list-group'>
        {productosSugeridos.map((producto) => (
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
