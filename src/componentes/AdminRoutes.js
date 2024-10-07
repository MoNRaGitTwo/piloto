import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoutes = ({ children }) => {
  const isAdmin = useSelector((state) => state.storeAuth.isAdmin);

  return isAdmin ? children : <Navigate to="/mostrar-productos" />;
};

export default AdminRoutes;
