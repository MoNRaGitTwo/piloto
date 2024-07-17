import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeProductoComprar, clearListaProductosComprar } from '../reducers/listaProductosComprarSlice';

const ProductosSeleccionados = () => {
  const dispatch = useDispatch();
  const productosComprar = useSelector(state => state.listaProductosComprar.productosComprar);

  const handleRemove = (id) => {
    dispatch(removeProductoComprar(id));
  };

  const handleClear = () => {
    dispatch(clearListaProductosComprar());
  };

  return (
    <div>
      <h2>Productos Seleccionados para Comprar</h2>
      <ul className="list-group">
        {productosComprar.map((producto) => (
          <li key={producto.Id} className="list-group-item">
            {producto.Name} - $ {producto.Price} - Stock: {producto.Stock}
            <button className="btn btn-danger btn-sm ms-2" onClick={() => handleRemove(producto.Id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <button className="btn btn-warning btn-sm mt-3" onClick={handleClear}>Limpiar Lista</button>
    </div>
  );
};

export default ProductosSeleccionados;
