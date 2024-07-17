import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeProductoSugerido, clearProductosSugeridos } from '../reducers/listaSugeridaSlice';
import '../styles/styles.css';

function ListaSugerida() {
  const dispatch = useDispatch();
  const productosSugeridos = useSelector((state) => state.storeListaSugerida.productosSugeridos);

  const handleRemove = (id) => {
    dispatch(removeProductoSugerido(id));
  };

  const handleClear = () => {
    dispatch(clearProductosSugeridos());
  };

  if (productosSugeridos.length === 0) {
    return <div>No hay productos sugeridos</div>;
  }

  // Filtrar productos inválidos
  const validProductosSugeridos = productosSugeridos.filter(producto => producto && producto.Id && producto.Name && producto.Price && producto.Stock !== undefined);

  return (
    <div className="container">
      <h1>Lista Sugerida</h1>
      <button className="btn btn-outline-danger mb-3" onClick={handleClear}>
        Limpiar lista sugerida
      </button>
      <ul className="list-group">
        {validProductosSugeridos.map((producto, index) => {
          return (
            <li key={producto.Id} className="list-group-item">
              {producto.ImageData ? (
                <img
                  src={`data:image/jpeg;base64,${producto.ImageData}`}
                  alt={producto.Name}
                  style={{ width: '50px', height: '50px' }}
                  className="me-3"
                />
              ) : (
                <div style={{ width: '50px', height: '50px' }} className="me-3 bg-secondary" />
              )}
              {producto.Name} - $ {producto.Price} - Stock: {producto.Stock}
              <br />
              Proveedor: {producto.Proveedor}
              <button className="btn btn-outline-danger btn-sm float-end" onClick={() => handleRemove(producto.Id)}>
                Eliminar
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListaSugerida;
