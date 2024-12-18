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
import { addProductoSugerido } from '../reducers/listaSugeridaSlice';
import { addProductoCarrito } from '../reducers/carritoSlice';
import { API_BASE_URL5 } from '../config';
import EditProductForm from './EditProductoFrom';
import ProductCarousel from './Carrusel';
import { incrementarCantidad, disminuirCantidad, addProductoCarritoCantidad } from '../reducers/cantidadSlice';
import '../styles/styles.css';

function Productos() {
  const dispatch = useDispatch();
  const productos = useSelector((state) => state.storeProducto.productoSlice);
  const carrito = useSelector((state) => state.storeCarrito.carritolice);
  const productosComprar = useSelector((state) => state.listaProductosComprar.productosComprar);
  const productosSugeridos = useSelector((state) => state.storeListaSugerida.productosSugeridos);
  const isAdmin = useSelector((state) => state.storeAuth.isAdmin);
  const cantidad = useSelector((state) => state.storeCantidad);

  const [editedProduct, setEditedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuantity, setShowQuantity] = useState({}); // Control de visibilidad de botones de cantidad

  const productsPerPage = 10;

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL5}`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });
        if (!response.ok) {
          throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        const data = await response.json();
        dispatch(setProductos(data.$values));
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
    dispatch(addProductoSugerido(lowStockProductos));
  };

  const handleDelete = (Id) => {
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
      dispatch(updateStockAsync({ id: producto.Id, nuevoStock: updatedStock }));
    } else {
      alert('Cantidad inválida o insuficiente stock');
    }
  };

  const handleAddToCarrito = (producto) => {
    const cantidadSeleccionada = cantidad[producto.Id] || 1;
    dispatch(addProductoCarritoCantidad({ Id: producto.Id, cantidad: cantidadSeleccionada }));

    if (!carrito.some((p) => p.Id === producto.Id)) {
      dispatch(addProductoCarrito({
        ...producto,
        cantidad: cantidadSeleccionada,
      }));
    }
    setShowQuantity((prevState) => ({
      ...prevState,
      [producto.Id]: true,
    }));
  };

  const filteredProductos = productos.filter((producto) => {
    if (!producto.Name) {
      return false;
    }
    return producto.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProductos.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!productos || productos.length === 0) {
    return <div>No hay productos disponibles</div>;
  }

  const renderProductList = (productos) => (
    <div className="product-grid">
      {productos.map((producto) => {
        let stockClass = "";
        if (producto.Stock < 3) {
          stockClass = "low-stock-red";
        } else if (producto.Stock < 5) {
          stockClass = "low-stock-yellow";
        }
  
        return (
          <div key={producto.Id} className={`product-item ${stockClass}`}>
            <img
              src={`data:image/jpeg;base64,${producto.ImageData}`}
              alt={producto.Name}
              className="product-image"
            />
            <div className="product-info">
              <span className="product-name">{producto.Name}</span>
              <span className="product-price">$ {producto.Price}</span>
              <span className="product-stock">Stock: {producto.Stock}</span>
            </div>
            <div className="btn-group">
              {showQuantity[producto.Id] ? (
                <div className="quantity-control">
                  <button
                    className="quantity-button"
                    onClick={() => dispatch(incrementarCantidad({ id: producto.Id }))}
                  >
                    +
                  </button>
                  <span className="quantity-value">
                    {cantidad[producto.Id] || 1}
                  </span>
                  <button
                    className="quantity-button"
                    onClick={() => dispatch(disminuirCantidad({ id: producto.Id }))}
                  >
                    -
                  </button>
                </div>
              ) : (
                <button
                  className="btn carrito-button"
                  onClick={() => handleAddToCarrito(producto)}
                >
                 Agregar a Carrito
                </button>
              )}
              {isAdmin && (
                <>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(producto)}>
                    Editar
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleSell(producto)}>
                    Vender
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDelete(producto.Id)}>
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
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
      <ProductCarousel />
      {editedProduct && <EditProductForm product={editedProduct} onSubmit={handleEditSubmit} onCancel={() => setEditedProduct(null)} />}
      {renderProductList(currentProducts)}

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
