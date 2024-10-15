import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authSlice';
import { setUser } from '../reducers/userSlice'; // Importa la acción setUser
import { setPedidosDos } from '../reducers/pedidoDosSlice'; // Importa la acción para establecer pedidos
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de tener axios importado
import { API_BASE_URL4, API_BASE_URL3 } from '../config'; // Asegúrate de importar tu URL

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

      // Obtener pedidos después del login
      const responsePedidos = await axios.get(`${API_BASE_URL3}/api/Pedidos`);
      const dataPedidos = responsePedidos.data.$values || [];
      dispatch(setPedidosDos(dataPedidos)); // Agrega los pedidos al store global

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
