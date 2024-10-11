import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_BASE_URL3} from '../config';
/*
const initialState = {
  pedidos: [],
  status: 'idle',
  error: null,
};*/

// Acción asíncrona para guardar el pedido
// local   --> http://localhost:5153/api
export const guardarPedido = createAsyncThunk(
  'pedidos/guardarPedido',
  async (pedido, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL3}/api/Pedidos/GuardarPedidos`, pedido);
      console.log("soy el pedido guardado despues del boton ", response.data);
      
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

export const eliminarPedido = createAsyncThunk(
  'pedidos/eliminarPedido',
  async (pedidoId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5153/api/Pedidos/${pedidoId}`);
      return pedidoId; // Devuelve el ID del pedido eliminado
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const pedidoDosSlice = createSlice({
  name: 'pedidos',
  initialState: {
    pedidos: []
  },
  reducers: { 
    setPedidosDos: (state, action) => {
      state.pedidos = action.payload;
      
      
    },
    clearPedidos(state) {
      state.pedidos = []; // Limpia los pedidos
    },    
    updateEstadoPedido: (state, action) => {
      const { pedidoId, nuevoEstado } = action.payload;
      const pedido = state.pedidos.find(p => p.Id === pedidoId);
      if (pedido) {
        pedido.Estado = nuevoEstado;
      }
    },
    eliminarPedidoManual: (state, action) => {
      // Elimina el pedido del store sin hacer una solicitud HTTP
      state.pedidos = state.pedidos.filter(p => p.Id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(guardarPedido.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(guardarPedido.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const nuevoPedido = action.payload;
        const existe = state.pedidos.some(pedido => pedido.Id === nuevoPedido.Id);
        if (!existe) {
          state.pedidos.push(nuevoPedido);
        }
      })
      .addCase(guardarPedido.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase('pedidos/eliminarPedido/fulfilled', (state, action) => {
        state.pedidos = state.pedidos.filter(p => p.Id !== action.payload);
      });
      
  }
});

export const { setPedidosDos, addPedido, updateEstadoPedido, updatePedidoList , clearPedidos} = pedidoDosSlice.actions;
export default pedidoDosSlice.reducer;
