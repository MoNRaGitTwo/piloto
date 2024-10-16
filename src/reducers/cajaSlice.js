import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL3 } from '../config';

// Acción asíncrona para guardar la caja en la base de datos

export const guardarCajaAsync = createAsyncThunk(
  'caja/guardarCajaAsync',
  async (_, { getState }) => {
    const { cajaContado, cajaCredito } = getState().storeCaja;
    const cajaData = {
      MontoEfectivo: cajaContado,
      MontoCredito: cajaCredito,
    };

    try {
      // Reemplaza la URL con la dirección correcta de tu API
      console.log('Datos que se envían a la API de la Caja:', cajaData);
      const response = await axios.post(`${API_BASE_URL3}/api/Caja/guardarCaja`, cajaData);
      return response.data;
    } catch (error) {
      console.error('Error al guardar la caja en la base de datos:', error);
      throw error;
    }
  }
);

export const cajaSlice = createSlice({
  name: 'caja',
  initialState: {
    cajaContado: 0,
    cajaCredito: 0,
  },
  reducers: {
    actualizarMontoCaja: (state, action) => {
      console.log("soy caja contado" , action.payload);
      
      const monto = action.payload.amount || 0;
      state.cajaContado += monto;
    },
    actualizarCajaCredito: (state, action) => {
      const credito = action.payload.amount || 0;
      state.cajaCredito += credito;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(guardarCajaAsync.fulfilled, (state) => {
        console.log('Caja guardada exitosamente en la base de datos.');
      })
      .addCase(guardarCajaAsync.rejected, (state, action) => {
        console.error('Error al guardar la caja:', action.error);
      });
  },
});

export const { actualizarMontoCaja, actualizarCajaCredito } = cajaSlice.actions;

export default cajaSlice.reducer;
