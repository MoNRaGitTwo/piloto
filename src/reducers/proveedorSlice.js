import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

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
        setProveedores: (state, action) => {
            state.proveedorSlice = action.payload;
            console.log("Proveedores cargados:", action.payload);
        }
    }
});

export const { setProveedores } = proveedoresSlice.actions;
export default proveedoresSlice.reducer;
