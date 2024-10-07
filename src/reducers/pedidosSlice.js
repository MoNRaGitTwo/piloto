// reducers/pedidosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
      const response = await axios.post(`http://localhost:5153/api/Pedidos/GuardarPedidos`, pedido);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



// Acción asíncrona para actualizar el estado del pedido
export const actualizarEstadoPedido = createAsyncThunk(
  'pedidos/actualizarEstadoPedido',
  async (pedido, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5153/api/Pedidos/${pedido.Id}`, pedido);
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
      const nuevoPedido = action.payload;
      const existe = state.pedidosSlice.some(pedido => pedido.Id === nuevoPedido.Id);
      if (!existe) {
        state.pedidosSlice.push(nuevoPedido);
      }
    },
    clearPedidos(state) {
      state.pedidosSlice = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(guardarPedido.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(guardarPedido.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const nuevoPedido = action.payload;
        const existe = state.pedidosSlice.some(pedido => pedido.Id === nuevoPedido.Id);
        if (!existe) {
          state.pedidosSlice.push(nuevoPedido);
        }
      })
      .addCase(guardarPedido.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(actualizarEstadoPedido.fulfilled, (state, action) => {
        console.log('Payload recibido:', action.payload);
        const actualizado = action.payload;
        const index = state.pedidosSlice.findIndex(pedido => pedido.Id === actualizado.Id);
        if (index !== -1) {
          state.pedidosSlice[index] = actualizado;
        }
      })
      .addCase(actualizarEstadoPedido.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addProductoPedido, clearPedidos, actualizarPedido } = pedidosSlice.actions;

export default pedidosSlice.reducer;
