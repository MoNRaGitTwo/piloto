import React, { useState } from 'react';

function EditProductForm({ product, onSubmit, onCancel }) {
  const [editedProduct, setEditedProduct] = useState({ ...product });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setEditedProduct({
      ...editedProduct,
      ImageFileName: file ? file.name : '' // Set the image file name
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto editado (antes de enviar):", editedProduct);
    const formData = new FormData();
    formData.append('Id', editedProduct.Id);
    formData.append('Name', editedProduct.Name);
    formData.append('Price', editedProduct.Price);
    formData.append('Stock', editedProduct.Stock);
    formData.append('CodigoQR', editedProduct.CodigoQR); // Añadir CodigoQR al formData
    if (image) {
      formData.append('ImagenData', image);
    }
    formData.append('ImageFileName', editedProduct.ImageFileName);
  
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input type="text" name="Name" value={editedProduct.Name} onChange={handleChange} />
      </label>
      <label>
        Precio:
        <input type="number" name="Price" value={editedProduct.Price} onChange={handleChange} />
      </label>
      <label>
        Stock:
        <input type="number" name="Stock" value={editedProduct.Stock} onChange={handleChange} />
      </label>
      <label>
        Codigo QR:
        <input type="text" name="CodigoQR" value={editedProduct.CodigoQR} onChange={handleChange} />
      </label>
      <label>
        Imagen:
        <input type="file" onChange={handleImageChange} />
      </label>
      <button type="submit">Guardar cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}

export default EditProductForm;
