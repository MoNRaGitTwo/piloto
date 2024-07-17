import React, { useEffect, useState } from 'react';
import { API_BASE_URL3 } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'; // Importa axios si prefieres usarlo en lugar de fetch
import '../styles/styles.css'; // Importa tu archivo CSS aquí
import { setProveedores  } from '../reducers/proveedorSlice';

const Proveedores = () => {
  //const [proveedores, setProveedores] = useState([]);
  const proveedoresGlobal = useSelector(state => state.storeProveedor.proveedorSlice);
  //const clientesGlobales = useSelector(state => state.storeClientes.clientesSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch(`${API_BASE_URL3}/TodosProveedores`, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (!response.ok) {
          throw new Error(`Error al obtener proveedores: ${response.statusText}`);
        }
        const data = await response.json();
        //setProveedores(data);
        dispatch(setProveedores(data));
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };

    fetchProveedores();
  }, []); // El array vacío [] asegura que este efecto solo se ejecute una vez, cuando el componente se monta.

  const renderProveedores = () => (
    <table className="proveedores-table">
      <thead>
        <tr>
          <th>Nom Empresa</th>
          <th>Nombre</th>
          <th>Telefono</th>
        </tr>
      </thead>
      <tbody>
        {proveedoresGlobal.map(p => (
          <tr key={p.Id}>
            <td>{p.Empresa}</td>
            <td>{p.Nombre}</td>
            <td>{p.Telefono}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      {renderProveedores()}
    </div>
  );

};

export default Proveedores;
