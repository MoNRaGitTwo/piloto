import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReserva } from '../reducers/reservasSlice';
import { API_BASE_URL3 } from '../config';

const horarios = [15, 16, 17, 18, 19, 20, 21, 22];

const ReservaBarberia = () => {
  const [estadoBarberos, setEstadoBarberos] = useState({
    Juan: {},
    Pedro: {}
  });

  const dispatch = useDispatch();

  const crearReservaEnDB = async (reservaData) => {
    try {
      const response = await fetch(`${API_BASE_URL3}/CrearReserva`, {
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
      dispatch(addReserva({ ...reservaData, ReservaId: data.ReservaId }));
    } catch (error) {
      console.error('Error al enviar la reserva:', error);
    }
  };

  const handleReserva = (barbero, hora) => {
    const nombre = prompt("Ingresa tu nombre:");
    const telefono = prompt("Ingresa tu teléfono:");

    if (nombre && telefono) {
      const fecha = new Date();
      fecha.setHours(hora - 3, 0, 0, 0);

      const reservaData = {
        ClienteNombre: nombre,
        ClienteTelefono: telefono,
        FechaHora: fecha.toISOString(),
        Barbero: barbero,
        Estado: 'Pendiente',
      };

      crearReservaEnDB(reservaData);

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
    <div className="reserva-barberia" style={styles.reservaBarberia}>
      {horarios.map((hora) => (
        <div key={hora} className="hora-reserva" style={styles.horaReserva}>
          <h3 style={styles.hora}>{hora}:00</h3>
          <div className="barberos" style={styles.barberos}>
            <div className="barbero" style={styles.barbero}>
              Juan{' '}
              <span
                className={`estado-barbero ${estadoBarberos.Juan[hora] ? 'ocupado' : 'libre'}`}
                style={estadoBarberos.Juan[hora] ? styles.ocupado : styles.libre}
                onClick={() => !estadoBarberos.Juan[hora] && handleReserva('Juan', hora)}
              >
                {estadoBarberos.Juan[hora] ? '🔴' : '⚪'}
              </span>
            </div>
            <div className="barbero" style={styles.barbero}>
              Pedro{' '}
              <span
                className={`estado-barbero ${estadoBarberos.Pedro[hora] ? 'ocupado' : 'libre'}`}
                style={estadoBarberos.Pedro[hora] ? styles.ocupado : styles.libre}
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

const styles = {
  reservaBarberia: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f7f7f7',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  horaReserva: {
    marginBottom: '20px',
  },
  hora: {
    fontSize: '1.5em',
    color: '#333',
    textAlign: 'center',
  },
  barberos: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  barbero: {
    fontSize: '1.2em',
    textAlign: 'center',
  },
  ocupado: {
    cursor: 'not-allowed',
    color: 'red',
    fontSize: '1.5em',
  },
  libre: {
    cursor: 'pointer',
    color: 'green',
    fontSize: '1.5em',
  },
};

export default ReservaBarberia;
