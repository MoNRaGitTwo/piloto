import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProductAsync } from '../reducers/productosSlice';
import { API_BASE_URL } from '../config';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [codigoQR, setCodigoQR] = useState('');
  const [existingQRCodes, setExistingQRCodes] = useState([]);
  const dispatch = useDispatch();

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
        setExistingQRCodes(data.map(product => product.CodigoQR));
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProductos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log('Valores actuales:', productName, productPrice, productStock, productImage, imageFileName, codigoQR);
  
    if (!productName || !productPrice || !productStock || !imageFileName || !codigoQR) {
      console.error('Todos los campos son obligatorios');
      return;
    }
  
    if (existingQRCodes.includes(codigoQR)) {
      console.error('El código QR ya existe');
      return;
    }
  
    const formData = new FormData();
    formData.append('Name', productName);
    formData.append('Price', parseFloat(productPrice));
    formData.append('Stock', parseInt(productStock));
    formData.append('ImagenData', productImage); // Asegúrate de que productImage esté correctamente seteado aquí
    formData.append('ImageFileName', imageFileName);
    formData.append('CodigoQR', codigoQR);
  
    console.log("Intentando agregar producto:", formData);
    dispatch(addProductAsync(formData))
      .then(() => {
        setProductName('');
        setProductPrice('');
        setProductStock('');
        setProductImage('');
        setImageFileName('');
        setCodigoQR('');
      })
      .catch(error => {
        console.error('Error al agregar el producto:', error);
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
      <label>
        Stock del Producto:
        <input
          type="number"
          value={productStock}
          onChange={(e) => setProductStock(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Imagen del Producto:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            console.log('Archivo seleccionado:', file);
            if (file) {
              setProductImage(file);
              setImageFileName(file.name);
            }
          }}
          required
        />
      </label>
      <br />
      <label>
        Código QR
        <input type="text" value={codigoQR} onChange={(e) => setCodigoQR(e.target.value)} required />
      </label>
      <button type="submit">Agregar Producto</button>
    </form>
  );
};

export default AddProductForm;
