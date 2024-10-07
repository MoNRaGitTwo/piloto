// src/componentes/ReservaBarberia.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReserva } from '../reducers/reservasSlice';

const horarios = [15, 16, 17, 18, 19, 20, 21, 22];

const ReservaBarberia = () => {
  const [estadoBarberos, setEstadoBarberos] = useState({
    Juan: {},
    Pedro: {}
  });

  const dispatch = useDispatch();

  // Función para crear una reserva en la base de datos
  const crearReservaEnDB = async (reservaData) => {
    try {
      const response = await fetch('http://localhost:5153/CrearReserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservaData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }

      const data = await response.json();
      console.log('Reserva creada:', data);
    } catch (error) {
      console.error('Error al enviar la reserva:', error);
    }
  };

  const handleReserva = (barbero, hora) => {
    const nombre = prompt("Ingresa tu nombre:");
    const telefono = prompt("Ingresa tu teléfono:");
    
    if (nombre && telefono) {
      const reservaData = {
        ClienteNombre: nombre,
        ClienteTelefono: telefono,
        FechaHora: new Date().toISOString(), // Aquí puedes modificar para la fecha real si es necesario
        Barbero: barbero,
        Estado: 'Pendiente',
      };

      // Guardar la reserva en el store global
      dispatch(addReserva({ barbero, hora, nombre, telefono }));

      // Enviar la reserva a la base de datos
      crearReservaEnDB(reservaData);

      // Cambiar el estado del barbero a ocupado
      setEstadoBarberos(prev => ({
        ...prev,
        [barbero]: {
          ...prev[barbero],
          [hora]: true
        }
      }));
    }
  };

  return (
    <div className="reserva-barberia">
      {horarios.map((hora) => (
        <div key={hora} className="hora-reserva">
          <h3>{hora}:00</h3>
          <div className="barberos">
            <div className="barbero">
              Juan{' '}
              <span
                className={`estado-barbero ${estadoBarberos.Juan[hora] ? 'ocupado' : 'libre'}`}
                onClick={() => !estadoBarberos.Juan[hora] && handleReserva('Juan', hora)}
              >
                {estadoBarberos.Juan[hora] ? '🔴' : '⚪'}
              </span>
            </div>
            <div className="barbero">
              Pedro{' '}
              <span
                className={`estado-barbero ${estadoBarberos.Pedro[hora] ? 'ocupado' : 'libre'}`}
                onClick={() => !estadoBarberos.Pedro[hora] && handleReserva('Pedro', hora)}
              >
                {estadoBarberos.Pedro[hora] ? '🔴' : '⚪'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservaBarberia;
