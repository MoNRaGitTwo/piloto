// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Productos from './componentes/MostrarProductos';
import AddProductForm from './componentes/CrearProducto';
import ClientesList from './componentes/ClientesList';
import Proveedores from './componentes/Proveedores';
import QuErre from './componentes/QuErre';
import 'bootstrap/dist/css/bootstrap.min.css';
import CompraDetalle from './componentes/CompraDetalles';
import CajaManager from './componentes/CajaManager';
import ProductosSeleccionados from './componentes/ProductosSeleccionados';
import ProveedoresConProductos from './componentes/ProveedoresConProductos';
import ListaSugerida from './componentes/ListaSugerida';
import RandomProducts from './componentes/RandomProducts';


const App = () => {
  return (
    <Router>
      <div className="container">
        <h1 className="my-4">Bienvenido a Piloto</h1>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-productos">Mostrar Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/agregar-producto">Agregar Producto</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-clientes">Mostrar Clientes</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-proveedores">Mostrar Proveedores</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-qr">Ventas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-detalle">Detalle De Compras</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-caja">Caja</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-ProSeleccionados">ListaCompras</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-ProdConProveedor">ProdConProveedor</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-ListaSugerida">Lista Sugerida</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-Ofertas">Ofertas</Link>
              </li>
              
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/mostrar-productos" element={<Productos />} />
          <Route path="/agregar-producto" element={<AddProductForm />} />
          <Route path="/mostrar-clientes" element={<ClientesList />} />
          <Route path="/mostrar-proveedores" element={<Proveedores />} />
          <Route path="/mostrar-qr" element={<QuErre />} />
          <Route path="/mostrar-detalle" element={<CompraDetalle />} />
          <Route path="/mostrar-caja" element={<CajaManager />} />
          <Route path="/mostrar-ProSeleccionados" element={<ProductosSeleccionados />} />
          <Route path="/mostrar-ProdConProveedor" element={<ProveedoresConProductos />} />
          <Route path="/mostrar-ListaSugerida" element={<ListaSugerida />} />
          <Route path="/mostrar-Ofertas" element={<RandomProducts />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
