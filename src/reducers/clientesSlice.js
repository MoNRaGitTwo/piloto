import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { API_BASE_URL,API_BASE_URL2,API_BASE_URL3 } from '../config';

export const fetchClientes = createAsyncThunk(
    'clientes/fetchClientes',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/clientes/TodosClientes`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const registrarCompra = createAsyncThunk(
    'clientes/registrarCompra',
    async (compraData, thunkAPI) => {
        try {
            const response = await axios.post(`${API_BASE_URL2}/RegistrarCompra`, compraData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const actualizarDeudaCliente = createAsyncThunk(
    'clientes/actualizarDeudaCliente',
    async ({ clienteId, nuevaDeuda }, thunkAPI) => {
        try {
            const response = await axios.post(` ${API_BASE_URL3}Users/${clienteId}/actualizarDeuda`, { 
                ClienteId: clienteId, 
                NuevaDeuda: nuevaDeuda 
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    clientesSlice: [],
    comprasCliente: [],
    status: 'idle',
    error: null
};

const clientesSlice = createSlice({
    name: "clientes",
    initialState,
    reducers: {
        setClientes: (state, action) => {
            state.clientesSlice = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchClientes.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchClientes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.clientesList = action.payload;
            })
            .addCase(fetchClientes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(registrarCompra.fulfilled, (state, action) => {
                state.comprasCliente.push(action.payload);
            })
            .addCase(actualizarDeudaCliente.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { setClientes } = clientesSlice.actions;
export default clientesSlice.reducer;
