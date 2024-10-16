// src/components/CajaManager.js
import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { guardarCajaAsync } from '../reducers/cajaSlice';

const CajaManager = () => {
  const montoCaja = useSelector(state => state.storeCaja.cajaContado); // Accede correctamente al estado de Redux
  const montoCajaCredito = useSelector(state => state.storeCaja.cajaCredito); // Accede correctamente al estado de Redux
  const dispatch = useDispatch();

  // Verificar si montoCaja tiene un valor antes de usarlo
  const montoCajaFormateado = montoCaja


  const handleGuardarCaja = () => {
    dispatch(guardarCajaAsync());
  };

  return (
    <div>
      <h3>Monto en caja: ${montoCajaFormateado}</h3>
      <h3>Monto en caja credito: ${montoCajaCredito}</h3>
      <button className='btn btn-secondary' onClick={handleGuardarCaja}>
        Guardar Caja
      </button>
    </div>
  );
};

export default CajaManager;
