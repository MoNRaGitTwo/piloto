import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from '../config';
import axios from 'axios';

// Thunk para eliminar producto

//http://localhost:5153/Products/Eliminar/
//(`${API_BASE_URL}/Eliminar/${Id}`
export const deleteProductAsync = createAsyncThunk(
  'producto/deleteProductAsync',
  async (Id, thunkAPI) => {
    const response = await fetch(`http://localhost:5153/Products/Eliminar/${Id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }

    return Id;
  }
);

// Thunk para obtener productos desde el backend
export const fetchProductsAsync = createAsyncThunk(
  'productos/fetchProducts',
  async () => {
    const response = await axios.get(`${API_BASE_URL}/TodoProductos`); // Asegúrate de ajustar la URL según tu backend
    return response.data;
  }
);



// Thunk para editar producto
//http://localhost:5153/Products/Editar/
//`${API_BASE_URL}/Editar/${formData.get('Id')}`, formData,
export const editProductAsync = createAsyncThunk(
  'producto/editProductAsync',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.put(`http://localhost:5153/Products/Editar/${formData.get('Id')}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 200) {
        throw new Error('Error al editar el producto');
      }

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const reducirStockAsync = createAsyncThunk(
  'productos/reducirStockAsync',
  async ({ id, cantidadComprada }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5153/Products/ReducirStock/${id}?cantidadComprada=${cantidadComprada}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Error al reducir el stock');
      }

      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk para actualizar stock
export const updateStockAsync = createAsyncThunk(
  'producto/updateStockAsync',
  async ({ id, nuevoStock }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/ActualizarStock/${id}`, nuevoStock,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );     

      if (response.status !== 200) {
        throw new Error('Error al actualizar el stock');
      }
      thunkAPI.dispatch(updateProduct(response.data.Product));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Thunk para agregar producto
//${API_BASE_URL}/crear
 //http://localhost:5153/Products/crear
export const addProductAsync = createAsyncThunk(
  'productos/addProduct',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`http://localhost:5153/Products/crear`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  productoSlice: [],
  status: 'idle',
  error: null,
};

export const productoSlice = createSlice({
  name: "Producto",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.productoSlice.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.productoSlice = state.productoSlice.filter(product => product.Id !== action.payload);
    },
    updateProduct: (state, action) => {
      state.productoSlice = state.productoSlice.map(product =>
        product.Id === action.payload.Id ? action.payload : product
      );
    },
    setProductos: (state, action) => {
      state.productoSlice = action.payload;
      //console.log("soy productos en el sliuce" , action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProductAsync.fulfilled, (state, action) => {
        console.log("Producto agregado:", action.payload);
        state.productoSlice.push(action.payload);
      })
      .addCase(editProductAsync.fulfilled, (state, action) => {
        const editedProduct = action.payload;
        console.log("Producto editado en el servidor:", editedProduct);
        const index = state.productoSlice.findIndex(product => product.Id === editedProduct.Id);
        if (index !== -1) {
          state.productoSlice[index] = editedProduct;
        }
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        console.log("Producto eliminado con ID:", action.payload);
        state.productoSlice = state.productoSlice.filter(product => product.Id !== action.payload);
      })
      .addCase(updateStockAsync.fulfilled, (state, action) => {
        const index = state.productoSlice.findIndex(product => product.Id === action.payload.Id);
        if (index !== -1) {
          state.productoSlice[index].Stock = action.payload.Stock;
        }
      })
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productoSlice = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { addProduct, deleteProduct, updateProduct, setProductos } = productoSlice.actions;
export default productoSlice.reducer;
