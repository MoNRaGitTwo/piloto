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

export const actualizarCajaAsync = createAsyncThunk(
  'caja/actualizarCajaAsync',
  async ({ montoEfectivo, montoCredito, gastos, extra }, { getState }) => {
    const { cajaContado, cajaCredito, gastosActuales, extraActual, Id } = getState().storeCaja;

    const cajaData = {
      Id: Id, // Asegúrate de enviar el Id correcto.
      MontoEfectivo: montoEfectivo,
      MontoCredito: montoCredito,
      Gastos: gastos,
      Extra: extra,
    };

    try {
      const response = await axios.put(`${API_BASE_URL3}/api/Caja/editarCaja`, cajaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la caja en la base de datos:', error);
      throw error;
    }
  }
);

export const obtenerCajaAsync = createAsyncThunk(
  'caja/obtenerCajaAsync',
  async () => {
    try {                                        
      const response = await axios.get(`${API_BASE_URL3}/api/Caja/mostrarCaja`);                                 
      return response.data;
    } catch (error) {
      console.error('Error al obtener la caja:', error);
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
      .addCase(obtenerCajaAsync.fulfilled, (state, action) => {
        state.cajaContado = action.payload.MontoEfectivo;
        state.cajaCredito = action.payload.MontoCredito;
        state.gastos = action.payload.Gastos;
        state.extra = action.payload.Extra;
      })
      .addCase(obtenerCajaAsync.rejected, (state, action) => {
        console.error('Error al obtener la caja:', action.error);
      })
      .addCase(actualizarCajaAsync.fulfilled, (state) => {
        console.log('Caja actualizada exitosamente en la base de datos.');
      })
      .addCase(actualizarCajaAsync.rejected, (state, action) => {
        console.error('Error al actualizar la caja:', action.error);
      })
      .addCase(guardarCajaAsync.rejected, (state, action) => {
        console.error('Error al guardar la caja:', action.error);
      });
  },
});

export const { actualizarMontoCaja, actualizarCajaCredito } = cajaSlice.actions;

export default cajaSlice.reducer;
