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
     // console.log("Aca Ramon , soy el producto en el carrito , busco el estado" , action.payload)
    },
    eliminarProducto(state, action) {
      state.carritolice = state.carritolice.filter(
        (producto) => producto.Id !== action.payload
      );
    },
    clearCarrito(state) {
      state.carritolice = [];
    },
  },
});

export const { addProductoCarrito, clearCarrito,eliminarProducto } = carritoSlice.actions;

export default carritoSlice.reducer;
