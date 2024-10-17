
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerCajaAsync } from '../reducers/cajaSlice';

const CajaManager = () => {
  const dispatch = useDispatch();
  
  // Selecciona los valores de la caja desde el store
  const cajaContado = useSelector((state) => state.storeCaja.cajaContado);
  const cajaCredito = useSelector((state) => state.storeCaja.cajaCredito);
  //const gastos = useSelector((state) => state.storeCaja.gastos);
  //const extra = useSelector((state) => state.storeCaja.extra);

  // Realiza una llamada para obtener la caja al montar el componente
  useEffect(() => {
    dispatch(obtenerCajaAsync());
  }, [dispatch]);

  // Muestra los valores de la caja
  return (
    <div className="caja-manager">
      <h2>Administración de Caja</h2>
      <p><strong>Montos en Efectivo:</strong> ${cajaContado}</p>
      <p><strong>Montos en Crédito:</strong> ${cajaCredito}</p>     
    </div>
  );
};

export default CajaManager;
