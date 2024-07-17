import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productosComprar: []
};

export const listaProductosComprarSlice = createSlice({
  name: "listaProductosComprar",
  initialState,
  reducers: {
    addProductoComprar: (state, action) => {
      const existingProduct = state.productosComprar.find(product => product.Id === action.payload.Id);
      if (!existingProduct) {
        state.productosComprar.push(action.payload);
      }
    },
    removeProductoComprar: (state, action) => {
      state.productosComprar = state.productosComprar.filter(product => product.Id !== action.payload);
    },
    clearListaProductosComprar: (state) => {
      state.productosComprar = [];
    }
  }
});

export const { addProductoComprar, removeProductoComprar, clearListaProductosComprar } = listaProductosComprarSlice.actions;

export default listaProductosComprarSlice.reducer;
