// src/components/CajaManager.js
import React from 'react';
import { useSelector } from 'react-redux';

const CajaManager = () => {
  const montoCaja = useSelector(state => state.storeCaja.cajaContado); // Accede correctamente al estado de Redux
  const montoCajaCredito = useSelector(state => state.storeCaja.cajaCredito); // Accede correctamente al estado de Redux

  // Verificar si montoCaja tiene un valor antes de usarlo
  const montoCajaFormateado = montoCaja 

  return (
    <div>
      <h3>Monto en caja: ${montoCajaFormateado}</h3>
      <h3>Monto en caja credito: ${montoCajaCredito}</h3>
    </div>
  );
};

export default CajaManager;
