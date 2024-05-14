import React, { useState } from 'react';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      name: productName,
      price: parseFloat(productPrice), // Convertir el precio a tipo flotante
    };

    fetch('http://localhost:5153/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })
    .then(response => {
      if (!response.ok) {
        console.log("fsd", newProduct)
        throw new Error('Error al agregarrrrrr el producto');
        
      }
      console.log('Producto agregado exitosamente');
      // Limpiar los campos del formulario después de agregar el producto
      setProductName('');
      setProductPrice('');
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre del Producto:
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </label>   
      <br />
      <label>
        Precio del Producto:
        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
      </label> 
      <br />
      <button type="buttom">Agregar Producto</button>
    </form>
  );
};

export default AddProductForm;
