import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { API_BASE_URL3 } from '../config'; // Asegúrate de que la ruta sea correcta

// Acción asíncrona para obtener todos los proveedores
export const fetchProveedores = createAsyncThunk(
    'proveedores/fetchProveedores',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_BASE_URL3}/TodosProveedores`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Estado inicial
const initialState = {
    proveedorSlice: [],
    status: 'idle',
    error: null
};

// Slice de proveedores
const proveedoresSlice = createSlice({
    name: "proveedores",
    initialState,
    reducers: {
        // Aquí podrías definir acciones sincrónicas adicionales si las necesitas
        setProveedores: (state, action) => {
            state.proveedorSlice = action.payload;
            console.log("Proveedores cargados:", action.payload);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchProveedores.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProveedores.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.proveedorSlice = action.payload; // Asegúrate de que action.payload sea un array
            })
            .addCase(fetchProveedores.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

// Exportar acciones y reducer
export const { setProveedores } = proveedoresSlice.actions;
export default proveedoresSlice.reducer;
