import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pedidosSlice: [],
};

const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState,
  reducers: {
    addProductoPedido(state, action) {
      state.pedidosSlice.push(action.payload);
    },
    clearPedidos(state) {
      state.pedidosSlice = [];
    },
  },
});

export const { addProductoPedido, clearPedidos } = pedidosSlice.actions;

export default pedidosSlice.reducer;
