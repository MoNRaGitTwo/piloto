import { configureStore } from "@reduxjs/toolkit";
import productoReducer from "../src/reducers/productosSlice";
import clientesReducer from '../src/reducers/clientesSlice'; // Este archivo lo crearemos más adelante
import ProveedoresReducer from '../src/reducers/proveedorSlice'; // Este archivo lo crearemos más adelante
import CajaReducer from '../src/reducers/cajaSlice'
import listaProductosComprarReducer from '../src/reducers/listaProductosComprarSlice';
import listaSugeridaReducer from '../src/reducers/listaSugeridaSlice';
import carritoReducer from '../src/reducers/carritoSlice';
import pedidosReducer from '../src/reducers/pedidosSlice';  
import authReducer from '../src/reducers/authSlice';
import cantidadReducer from '../src/reducers/cantidadSlice';
import userReducer from '../src/reducers/userSlice'; // Importa el userSlice
import pedidoEstadoReducer from './reducers/pedidoEstadoSlice';
import pedidoDosReducer from '../src/reducers/pedidoDosSlice'; 
import reservasReducer from './reducers/reservasSlice';

 const store =  configureStore({
  reducer:{

    storeProducto:productoReducer,
    storeClientes: clientesReducer,
    storeProveedor: ProveedoresReducer,
    storeCaja:CajaReducer,
    listaProductosComprar: listaProductosComprarReducer,
    storeListaSugerida:listaSugeridaReducer,
    storeCarrito: carritoReducer,
    storePedidos: pedidosReducer,
    storeAuth: authReducer,
    storeCantidad: cantidadReducer,
    storeUser: userReducer,
    pedidoEstado: pedidoEstadoReducer,
    pedidoDosStore:pedidoDosReducer,
    reservas: reservasReducer,

    
     
  }
});


export default store;