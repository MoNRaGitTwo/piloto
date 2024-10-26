import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Estado inicial
const initialState = {
    proveedorSlice: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

// Acción asíncrona para obtener proveedores por día
export const obtenerProveedoresPorDiaAsync = createAsyncThunk(
    'proveedores/obtenerProveedoresPorDia',
    async (dia) => {
        try {
            const response = await axios.get(`http://localhost:5153/ProveedoresPorDia/${dia}`); // Reemplaza con tu URL real
            console.log("soy el proveedor por dia" , response);
            
            return response.data.$values; // Ajusta si la estructura de la respuesta es diferente
        } catch (error) {
            throw new Error('Error al obtener los proveedores por día');
        }
    }
);

// Slice de proveedores
const proveedoresSlice = createSlice({
    name: "proveedores",
    initialState,
    reducers: {
        setProveedores: (state, action) => {
            state.proveedorSlice = action.payload;
            console.log("Proveedores cargados:", action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(obtenerProveedoresPorDiaAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(obtenerProveedoresPorDiaAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.proveedorSlice = action.payload;
            })
            .addCase(obtenerProveedoresPorDiaAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

// Exportar la acción y el reducer
export const { setProveedores } = proveedoresSlice.actions;
export default proveedoresSlice.reducer;
