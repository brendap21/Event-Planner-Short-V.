// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();

  // Si el usuario no está autenticado, redirige a la página de login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;
