import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteProductAsync,
  setProductos,
  editProductAsync,
  updateProduct,
  updateStockAsync,
} from '../reducers/productosSlice';
import { addProductoComprar } from '../reducers/listaProductosComprarSlice';
import { addProductoSugerido  } from '../reducers/listaSugeridaSlice';
import { addProductoCarrito  } from '../reducers/carritoSlice';
import { API_BASE_URL } from '../config';
import EditProductForm from './EditProductoFrom';
import '../styles/styles.css';

function Productos() {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.storeProducto.productoSlice);
  const carrito = useSelector((state) => state.storeCarrito.carritolice);
  const productosComprar = useSelector((state) => state.listaProductosComprar.productosComprar);
  const productosSugeridos = useSelector((state) => state.storeListaSugerida.productosSugeridos);
  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProductos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/TodoProductos`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            if (!response.ok) {
                throw new Error(`Error al obtener productos: ${response.statusText}`);
            }
            const data = await response.json();
            dispatch(setProductos(data));
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    fetchProductos();
  }, [dispatch]);

  useEffect(() => {
    productos.forEach((producto) => {
      if (producto.Stock <= 5 && !productosSugeridos.some((p) => p.Id === producto.Id)) {
        dispatch(addProductoSugerido({
          ...producto,
          Proveedor: producto.Proveedores && producto.Proveedores.length > 0 ? producto.Proveedores[0].Nombre : 'Desconocido'
        }));
      }
    });
  }, [productos, productosSugeridos, dispatch]);

  const handleGenerateList = () => {
    const lowStockProductos = productos.filter((producto) => producto.Stock <= 5);
    console.log("soy lista sugerida" , lowStockProductos);
    dispatch(addProductoSugerido(lowStockProductos));
  };

  const handleDelete = (Id) => {
    console.log('Intentando eliminar producto con ID:', Id);
    dispatch(deleteProductAsync(Id));
  };

  const handleEdit = (producto) => {
    setEditedProduct(producto);
  };

  const handleEditSubmit = async (editedProduct) => {
    try {
      const response = await dispatch(editProductAsync(editedProduct));
      if (response.payload && response.payload.Message === 'Producto editado exitosamente' && response.payload.Product) {
        dispatch(updateProduct(response.payload.Product));
        setEditedProduct(null);
      } else {
        console.error('Error al editar el producto:', response.payload);
      }
    } catch (error) {
      console.error('Error al editar el producto:', error);
    }
  };

  const handleSell = (producto) => {
    const quantity = parseInt(prompt('Ingrese la cantidad a vender:'), 10);
    if (!isNaN(quantity) && quantity > 0 && quantity <= producto.Stock) {
      const updatedStock = producto.Stock - quantity;
      console.log('Datos de venta:', { id: producto.Id, nuevoStock: updatedStock });
      dispatch(updateStockAsync({ id: producto.Id, nuevoStock: updatedStock }));
    } else {
      alert('Cantidad inválida o insuficiente stock');
    }
  };

  const handleAddToComprar = (producto) => {
    if (!productosComprar.some((p) => p.Id === producto.Id)) {
      dispatch(addProductoComprar(producto));
    }
  };

  const handleAddToSugeridos = (producto) => {
    if (!productosSugeridos.some((p) => p.Id === producto.Id)) {
      dispatch(addProductoSugerido(producto));
    }
  };
  const handleAddToCarrito = (producto) => {
    if (!carrito.some((p) => p.Id === producto.Id)) {
      dispatch(addProductoCarrito(producto));
    }
  };

  const filteredProductos = productos.filter((producto) => {
    if (!producto.Name) {
      return false;
    }
    return producto.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getImageUrl = (base64Data) => {
    return `data:image/jpeg;base64,${base64Data}`;
  };

  // Calcular índices para la paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProductos.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (!productos || productos.length === 0) {
    return <div>No hay productos disponibles</div>;
  }

  const renderProductList = (productos) => (
    <ul className='list-group'>
      {productos.map((producto) => {
        const isLowStock = producto.Stock <= 5;
        return (
          <li
            key={producto.Id}
            className={`list-group-item ${
              producto.Stock <= 1 ? 'list-group-item-danger' : producto.Stock <= 0 ? 'list-group-item-warning' : ''
            }`}
          >
            <img
              src={getImageUrl(producto.ImageData)}
              alt={producto.Name}
              style={{ width: '50px', height: '50px' }}
              className='me-3'
            />
            <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>{producto.Name}</span> -{' '}
            <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>$ {producto.Price} - Stock: {producto.Stock} </span>
            <div className='btn-group float-end'>
              <button className='btn btn-outline-secondary btn-sm ms-2' onClick={() => handleEdit(producto)}>
                Editar
              </button>
              <button className='btn btn-outline-secondary btn-sm ms-2' onClick={() => handleSell(producto)}>
                Vender
              </button>
              <button className='btn btn-outline-secondary btn-sm ms-2' onClick={() => handleDelete(producto.Id)}>
                Eliminar
              </button>
              <button
                className='btn btn-outline-secondary btn-sm ms-2'
                onClick={() => handleAddToComprar(producto)}
                disabled={productosComprar.some((p) => p.Id === producto.Id)}
              >
                Agregar a comprar
              </button>
              <button
                className='btn btn-outline-secondary btn-sm ms-2'
                onClick={() => handleAddToCarrito(producto)}
                disabled={carrito.some((p) => p.Id === producto.Id)}
              >
                Carrito
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className='container'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h1>Productos</h1>
        <button className='btn btn-primary' onClick={handleGenerateList}>
          Generar Lista
        </button>
      </div>
      <input
        type='text'
        className='form-control mb-3'
        placeholder='Buscar producto'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {editedProduct && <EditProductForm product={editedProduct} onSubmit={handleEditSubmit} onCancel={() => setEditedProduct(null)} />}
      {renderProductList(currentProducts)}
      
      {/* Paginación */}
      {filteredProductos.length > productsPerPage && (
        <nav>
          <ul className="pagination">
            {Array(Math.ceil(filteredProductos.length / productsPerPage)).fill().map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(index + 1)} className="page-link">{index + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Productos;
