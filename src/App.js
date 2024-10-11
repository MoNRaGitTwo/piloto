// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Carrito from './componentes/Carrito';
import Pedidos from './componentes/Pedidos';
import PedidosDos from './componentes/PedidosDos';
import ReservaBarberia from './componentes/ReservaBarberia'; // <-- Nuevo componente
import AdminRoutes from './componentes/AdminRoutes';
import Login from './componentes/Login';
import LogoutButton from './componentes/LogoutButton';
import Register from './componentes/Register';
import ListaReservas from './componentes/ListaReservas';

const App = () => {
  const isLoggedIn = useSelector((state) => state.storeAuth.user !== null);
  const isAdmin = useSelector((state) => state.storeAuth.isAdmin);

  return (
    <Router>
      <div className="container">
        <h1 className="my-4">Bienvenido a PedidosDespues</h1>
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
          <div className="container-fluid">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-productos">Mostrar Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-Carrito">Carrito</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mostrar-Registro">Registro</Link>
              </li>

              {!isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}

              {isAdmin && (
                <>
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
                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/mostrar-PedidosDos">PedidosDos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/mostrar-ReservaBarberia">Reservas Barbería</Link> {/* <-- Nuevo enlace */}
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/lista-reservas">Lista Reserva</Link> {/* <-- Nuevo enlace */}
                  </li>
                </>
              )}

              {isLoggedIn && (
                <li className="nav-item">
                  <LogoutButton />
                </li>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/mostrar-productos" element={<Productos />} />
          <Route path="/mostrar-Carrito" element={<Carrito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mostrar-Registro" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/agregar-producto" element={<AdminRoutes><AddProductForm /></AdminRoutes>} />
          <Route path="/mostrar-clientes" element={<AdminRoutes><ClientesList /></AdminRoutes>} />
          <Route path="/mostrar-proveedores" element={<AdminRoutes><Proveedores /></AdminRoutes>} />
          <Route path="/mostrar-qr" element={<AdminRoutes><QuErre /></AdminRoutes>} />
          <Route path="/mostrar-detalle" element={<AdminRoutes><CompraDetalle /></AdminRoutes>} />
          <Route path="/mostrar-caja" element={<AdminRoutes><CajaManager /></AdminRoutes>} />
          <Route path="/mostrar-ProSeleccionados" element={<AdminRoutes><ProductosSeleccionados /></AdminRoutes>} />
          <Route path="/mostrar-ProdConProveedor" element={<AdminRoutes><ProveedoresConProductos /></AdminRoutes>} />
          <Route path="/mostrar-ListaSugerida" element={<AdminRoutes><ListaSugerida /></AdminRoutes>} />
          <Route path="/mostrar-Ofertas" element={<AdminRoutes><RandomProducts /></AdminRoutes>} />
          <Route path="/mostrar-Pedidos" element={<AdminRoutes><Pedidos /></AdminRoutes>} />
          <Route path="/mostrar-PedidosDos" element={<AdminRoutes><PedidosDos /></AdminRoutes>} />
          <Route path="/mostrar-ReservaBarberia" element={<AdminRoutes><ReservaBarberia /></AdminRoutes>} /> {/* <-- Nueva ruta */}
          <Route path="/lista-reservas" element={<AdminRoutes><ListaReservas /></AdminRoutes>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
