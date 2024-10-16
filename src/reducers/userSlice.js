import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL3 } from '../config';

// Acción asíncrona para actualizar la deuda en la base de datos
export const actualizarDeudaAsync = createAsyncThunk(
  'user/actualizarDeuda',
  async ({ id, nuevaDeuda }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL3}/api/Users/${id}/actualizarDeuda`, {
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
  todosUsuarios: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      //console.log("Usuario logueado slice: ", action.payload);
      state.usuarios.push(action.payload);
    },
    setTodosUser(state, action) {
      //console.log("todos los usarios en el slice: ", action.payload);
      state.todosUsuarios = action.payload;
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

export const { setUser, clearUser, updateUser,setTodosUser } = userSlice.actions;
export default userSlice.reducer;
