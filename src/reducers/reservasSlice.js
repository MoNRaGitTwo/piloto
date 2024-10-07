// src/redux/reservasSlice.js
import { createSlice } from '@reduxjs/toolkit';

const reservasSlice = createSlice({
  name: 'reservas',
  initialState: [],
  reducers: {
    addReserva: (state, action) => {
      state.push(action.payload); // Guardamos cada nueva reserva
    }
  }
});

export const { addReserva } = reservasSlice.actions;

export default reservasSlice.reducer;
