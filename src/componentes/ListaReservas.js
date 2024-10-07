// src/componentes/ListaReservas.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ListaReservas = () => {
  const [reservasBD, setReservasBD] = useState([]);
  
  // Obtener las reservas del store global (opcional)
  const reservasRedux = useSelector((state) => state.reservas);

  // Función para obtener las reservas desde la base de datos
  const obtenerReservas = async () => {
    try {
      const response = await fetch('http://localhost:5153/TodaslasReservas', {
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

  return (
    <div>
      <h2>Lista de Reservas</h2>
      <ul>
        {/* Mostrar las reservas obtenidas desde la base de datos */}
        {reservasBD.map((reserva, index) => (
          <li key={index}>
            {new Date(reserva.FechaHora).getHours()}:00 - {reserva.Barbero} - {reserva.ClienteNombre} ({reserva.ClienteTelefono})
          </li>
        ))}

        {/* Opcional: Mostrar las reservas locales desde Redux (si se quiere conservar esta funcionalidad) */}
        {reservasRedux.map((reserva, index) => (
          <li key={index}>
            {reserva.hora}:00 - {reserva.barbero} - {reserva.nombre} ({reserva.telefono})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaReservas;
