import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerCajaAsync } from '../reducers/cajaSlice';
import { obtenerProveedoresPorDiaAsync } from '../reducers/proveedorSlice';
import axios from 'axios';

const CajaManager = () => {
  const dispatch = useDispatch();
  const [productos, setProductos] = useState([]);
  const cajaContado = useSelector((state) => state.storeCaja.cajaContado);
  const cajaCredito = useSelector((state) => state.storeCaja.cajaCredito);
  const proveedores = useSelector((state) => state.storeProveedor.proveedorSlice);

  // Temporalmente fijamos el día como "jueves" para la prueba
  const diaActual = 'sabado'; // Cambia a 'sábado' u otro día según necesites

  const normalizarTexto = (texto) => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const diaActualNormalizado = normalizarTexto(diaActual);

  // Filtra los proveedores que pasan en el día actual normalizado
  const proveedoresHoy = proveedores.filter((proveedor) => 
    normalizarTexto(proveedor.Dia).includes(diaActualNormalizado)
  );

  useEffect(() => {
    dispatch(obtenerCajaAsync());
    dispatch(obtenerProveedoresPorDiaAsync(diaActual));
  }, [dispatch, diaActual]);

  // Obtener productos por proveedor si hay proveedores para hoy
  useEffect(() => {
    const obtenerProductos = async () => {
      if (proveedoresHoy.length > 0) {
        try {
          const proveedorId = proveedoresHoy[0].Id; // Tomamos el primer proveedor del día, ajustar si hay varios
          const response = await axios.get(`http://localhost:5153/Products/ObtenerProductosPorProveedor/${proveedorId}`);
          const productos = response.data.$values || [];
          setProductos(productos);
        } catch (error) {
          console.error("Error al obtener productos por proveedor:", error);
        }
      }
    };

    obtenerProductos();
  }, [proveedoresHoy]);

  return (
    <div className="caja-manager">
      <h2>Administración de Caja</h2>
      <p><strong>Montos en Efectivo:</strong> ${cajaContado}</p>
      <p><strong>Montos en Crédito:</strong> ${cajaCredito}</p> 

      <h3>Proveedores que pasan hoy ({diaActual}):</h3>
      {proveedoresHoy.length > 0 ? (
        <ul>
          {proveedoresHoy.map((proveedor) => (
            <li key={proveedor.Id}>
              {proveedor.Empresa} - {proveedor.Nombre} ({proveedor.Telefono})
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay proveedores para hoy.</p>
      )}

      <h3>Productos del proveedor:</h3>
      {productos.length > 0 ? (
        <ul>
          {productos.map((producto) => (
            <li 
              key={producto.Id} 
              style={{
                color: producto.Stock < 5 ? 'red' : 'black',
                fontWeight: producto.Stock < 5 ? 'bold' : 'normal',
                border: producto.Stock < 5 ? '2px solid red' : '1px solid #ccc',
                padding: '5px',
                borderRadius: '5px',
                marginBottom: '5px'
              }}
            >
              {producto.Name} - Stock: {producto.Stock}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productos disponibles para el proveedor de hoy.</p>
      )}
    </div>
  );
};

export default CajaManager;
