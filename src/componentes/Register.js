import React, { useState } from 'react';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [deuda, setDeuda] = useState(0);

  const handleRegister = async () => {
    const response = await fetch('http://localhost:5153/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nombre: nombre, Password: password, Direccion: direccion, Telefono: telefono, Deuda: deuda }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Usuario registrado exitosamente');
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Registrar Usuario</h2>
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
      <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      <input type="number" placeholder="Deuda" value={deuda} onChange={(e) => setDeuda(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
    </div>
  );
};

export default Register;
