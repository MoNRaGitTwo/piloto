import { createSlice } from '@reduxjs/toolkit';

export const listaSugeridaSlice = createSlice({
  name: 'listaSugerida',
  initialState: {
    productosSugeridos: [],
  },
  reducers: {
    addProductoSugerido: (state, action) => {
      state.productosSugeridos.push(action.payload);
     // console.log("soy producto sugerido SLICE" ,action.payload);
    },
    removeProductoSugerido: (state, action) => {
      state.productosSugeridos = state.productosSugeridos.filter(p => p.Id !== action.payload);
    },
    clearProductosSugeridos: (state) => {
      state.productosSugeridos = [];
    },
  },
});

export const { addProductoSugerido, removeProductoSugerido, clearProductosSugeridos } = listaSugeridaSlice.actions;

export default listaSugeridaSlice.reducer;
