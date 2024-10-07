import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asíncrona para actualizar la deuda en la base de datos
export const actualizarDeudaAsync = createAsyncThunk(
  'user/actualizarDeuda',
  async ({ id, nuevaDeuda }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5153/api/Users/${id}/actualizarDeuda`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaDeuda),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la deuda en la BDD');
      }

      const data = await response.json();
      return { id, deuda: data.deudaActualizada }; // Retornamos los datos que se actualizaron
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  usuarios: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      console.log("Usuario logueado: ", action.payload);
      state.usuarios.push(action.payload);
    },
    clearUser() {
      return initialState;
    },
    updateUser(state, action) {
      const index = state.usuarios.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.usuarios[index] = { ...state.usuarios[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(actualizarDeudaAsync.fulfilled, (state, action) => {
        const { id, deuda } = action.payload;
        const index = state.usuarios.findIndex(user => user.id === id);
        if (index !== -1) {
          state.usuarios[index].deuda = deuda; // Actualiza la deuda en el estado
        }
      })
      .addCase(actualizarDeudaAsync.rejected, (state, action) => {
        console.error("Error al actualizar la deuda:", action.payload);
      });
  }
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
