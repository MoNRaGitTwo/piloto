import { createSlice } from '@reduxjs/toolkit';

const cantidadSlice = createSlice({
    name: 'cantidad',
    initialState: {},  // Un objeto vacío para almacenar productos por su ID
    reducers: {
        addProductoCarritoCantidad: (state, action) => {
            const { Id, cantidad } = action.payload;
            console.log("Producto con cantidad:", cantidad);
            // Guarda solo la cantidad directamente
            state[Id] = cantidad;
        },
        setCantidad: (state, action) => {
            const { id, cantidad } = action.payload;
            state[id] = cantidad;
        },
        incrementarCantidad: (state, action) => {
            const { id } = action.payload;
            state[id] = (state[id] || 1) + 1;
        },
        disminuirCantidad: (state, action) => {
            const { id } = action.payload;
            state[id] = Math.max((state[id] || 1) - 1, 1); // La cantidad mínima es 1
        },
    },
});

export const { setCantidad, incrementarCantidad, disminuirCantidad, addProductoCarritoCantidad } = cantidadSlice.actions;
export default cantidadSlice.reducer;
