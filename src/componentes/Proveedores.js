import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/styles.css'; // Importa tu archivo CSS aquí

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]); // Estado local

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:5153/TodosProveedores', {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (response.status === 200) {
          const data = response.data.$values; // Acceder a $values
          setProveedores(data);
        } else {
          throw new Error('Error al obtener proveedores');
        }
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };

    fetchProveedores();
  }, []); // El array vacío asegura que este efecto solo se ejecute una vez, cuando el componente se monta.

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
        {proveedores.map(p => (
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
