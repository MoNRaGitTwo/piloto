import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authSlice';
import { setUser } from '../reducers/userSlice';  // Importa la acción setUser
import { useNavigate } from 'react-router-dom';
import {API_BASE_URL4}  from '../config';

const Login = () => {
  // Inicializa con los valores 'admin'
  const [nombre, setNombre] = useState('admin');
  const [password, setPassword] = useState('admin');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch(`${API_BASE_URL4}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombre, password: password }), // Envía los datos del login
    });

    const data = await response.json();
    if (response.ok) {
      const isAdmin = nombre === 'admin' && password === 'admin';
      
      // Despacha la acción setUser con los datos del usuario
      dispatch(setUser({
        id: data.id,
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        deuda: data.deuda,
      }));

      dispatch(login({ user: nombre, isAdmin }));
      navigate('/mostrar-productos');
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
