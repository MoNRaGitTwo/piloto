import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/authSlice';
import { clearUser } from '../reducers/userSlice';
import { clearPedidos } from '../reducers/pedidoDosSlice';

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUser());
    dispatch(clearPedidos());
    navigate('/login');
  };

  return (
    <button className="nav-link btn btn-link" onClick={handleLogout}>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
