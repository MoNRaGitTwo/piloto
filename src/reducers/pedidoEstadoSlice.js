import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const pedidoEstadoSlice = createSlice({
  name: 'pedidoEstado',
  initialState,
  reducers: {
    actualizarEstadoPedido(state, action) {
      const { Id, Estado } = action.payload; // Asegúrate de que estos nombres coinciden con los datos que estás enviando
      state[Id] = Estado;
      console.log("Estado actualizado:", action.payload);
    },
    eliminarEstadoPedido(state, action) {
      delete state[action.payload];
    }
  }
});

export const { actualizarEstadoPedido, eliminarEstadoPedido } = pedidoEstadoSlice.actions;

export default pedidoEstadoSlice.reducer;
