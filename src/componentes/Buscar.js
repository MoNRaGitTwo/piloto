// src/components/Buscador.js
import React, { useState } from 'react';

const Buscador = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default Buscador;
