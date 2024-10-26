import React, { useState } from 'react';

const TestRegister = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px', maxWidth: '400px', margin: '20px auto' }}>
      <h2 style={{ fontSize: '24px', color: '#333' }}>Registrar Usuario (Test)</h2>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
        />
      </div>
      <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
        Registrar
      </button>
    </div>
  );
};

export default TestRegister;
