// reducers/pedidosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL3 } from '../config';
import axios from 'axios';

const initialState = {
  pedidosSlice: [],
  status: 'idle',
  error: null
};

// Acción asíncrona para guardar el pedido
export const guardarPedido = createAsyncThunk(
  'pedidos/guardarPedido',
  async (pedido, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://backpiloto-3.onrender.com/api/Pedidos/GuardarPedidos', pedido);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(guardarPedido.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(guardarPedido.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pedidosSlice.push(action.payload);
      })
      .addCase(guardarPedido.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addProductoPedido, clearPedidos } = pedidosSlice.actions;

export default pedidosSlice.reducer;
