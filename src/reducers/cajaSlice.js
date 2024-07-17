// src/reducers/cajaSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const cajaSlice = createSlice({
  name: 'caja',
  initialState: {
    cajaContado: 1000, // Valor inicial de la caja
    cajaCredito: 0,   // Valor inicial de la caja de crédito
  },
  reducers: {
    actualizarMontoCaja: (state, action) => {
      state.cajaContado = action.payload;
      //state.cajaCredito = action.payload.cajaCredito;
      console.log("toy en el slice guardando cajaSlice", action.payload );
    },
    actualizarCajaCredito: (state, action) => {
      state.cajaCredito = action.payload;
      console.log("toy en el slice guardando cajaCredito", action.payload );
    },
  },
});

export const { actualizarMontoCaja, actualizarCajaCredito } = cajaSlice.actions;

export default cajaSlice.reducer;
