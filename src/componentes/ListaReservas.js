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
    <div>
      <h2>Lista de Reservas Barbero</h2>
      <ul>
        {/* Mostrar todas las reservas sin duplicados */}
        {todasReservas.length > 0 ? (
          todasReservas.map((reserva) => (
            <li key={reserva.ReservaId}> {/* Usar ReservaId como clave */}
              {new Date(reserva.FechaHora).getHours()}:00 - {reserva.Barbero} - {reserva.ClienteNombre} ({reserva.ClienteTelefono})
            </li>
          ))
        ) : (
          <li>No hay reservas disponibles.</li>
        )}
      </ul>
    </div>
  );
};

export default ListaReservas;
