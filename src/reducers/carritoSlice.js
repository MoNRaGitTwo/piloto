import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  carritolice: [],
};

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    addProductoCarrito(state, action) {
      state.carritolice.push(action.payload);
    },
    clearCarrito(state) {
      state.carritolice = [];
    },
  },
});

export const { addProductoCarrito, clearCarrito } = carritoSlice.actions;

export default carritoSlice.reducer;
