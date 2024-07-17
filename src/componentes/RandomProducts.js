// RandomProducts.js
import React from 'react';
import { useSelector } from 'react-redux';

const RandomProducts = () => {
  
  const productos = useSelector((state) => state.storeProducto.productoSlice);

  // Seleccionar 3 productos aleatorios
  const getRandomProducts = (array, num) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const selectedProducts = getRandomProducts(productos, 3);

  // Calcular precios
  const totalOriginal = selectedProducts.reduce((total, product) => total + product.Price, 0);
  const totalConDescuento = totalOriginal * 0.85;

  return (
    <div>
      <h2>Productos Seleccionados</h2>
      {selectedProducts.map((product) => (
        <div key={product.Id}>
          {product.Name} - ${product.Price}
        </div>
      ))}
      <h3>Total Original: ${totalOriginal.toFixed(2)}</h3>
      <h3>Precio con Descuento (15%): ${totalConDescuento.toFixed(2)}</h3>
    </div>
  );
};

export default RandomProducts;
