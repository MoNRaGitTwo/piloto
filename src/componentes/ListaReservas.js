import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { API_BASE_URL3 } from '../config';

const ListaReservas = () => {
  const [reservasBD, setReservasBD] = useState([]);
  
  // Obtener las reservas del store global (opcional)
  const reservasRedux = useSelector((state) => state.reservas);

  // Función para obtener las reservas desde la base de datos
  const obtenerReservas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL3}/TodaslasReservas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las reservas');
      }

      const data = await response.json();
      
      // Extraer las reservas del campo "$values"
      if (data.$values) {
        setReservasBD(data.$values);
      } else {
        console.error('Formato de respuesta inesperado', data);
      }
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    }
  };

  useEffect(() => {
    // Llamar a la función para obtener reservas cuando se cargue el componente
    obtenerReservas();
  }, []);

  const todasReservas = [...reservasBD, ...reservasRedux].filter((reserva, index, self) =>
    index === self.findIndex((r) => r.ReservaId === reserva.ReservaId) // Comparar por ReservaId
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lista de Reservas Barbero</h2>
      <ul style={styles.list}>
        {/* Mostrar todas las reservas sin duplicados */}
        {todasReservas.length > 0 ? (
          todasReservas.map((reserva) => (
            <li key={reserva.ReservaId} style={styles.listItem}> {/* Usar ReservaId como clave */}
              <span style={styles.reservaTime}>
                {new Date(reserva.FechaHora).getHours()}:00
              </span> 
              {' - '}
              <span style={styles.reservaBarbero}>{reserva.Barbero}</span>
              {' - '}
              <span style={styles.reservaCliente}>{reserva.ClienteNombre}</span> 
              {' ('}
              <span style={styles.reservaTelefono}>{reserva.ClienteTelefono}</span>
              {')'}
            </li>
          ))
        ) : (
          <li style={styles.noReservas}>No hay reservas disponibles.</li>
        )}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '20px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '1.8em',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservaTime: {
    fontWeight: 'bold',
    color: '#555',
  },
  reservaBarbero: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  reservaCliente: {
    fontStyle: 'italic',
    color: '#333',
  },
  reservaTelefono: {
    color: '#888',
  },
  noReservas: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
  },
};

export default ListaReservas;
