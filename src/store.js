import { configureStore } from "@reduxjs/toolkit";
import productoReducer from "../src/reducers/productosSlice";
import clientesReducer from '../src/reducers/clientesSlice'; // Este archivo lo crearemos más adelante
import ProveedoresReducer from '../src/reducers/proveedorSlice'; // Este archivo lo crearemos más adelante
import CajaReducer from '../src/reducers/cajaSlice'
import listaProductosComprarReducer from '../src/reducers/listaProductosComprarSlice';
import listaSugeridaReducer from '../src/reducers/listaSugeridaSlice';

 const store =  configureStore({
  reducer:{

    storeProducto:productoReducer,
    storeClientes: clientesReducer,
    storeProveedor: ProveedoresReducer,
    storeCaja:CajaReducer,
    listaProductosComprar: listaProductosComprarReducer,
    storeListaSugerida:listaSugeridaReducer

    
     
  }
});


export default store;