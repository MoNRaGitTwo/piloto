import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL3 } from '../config';
import '../styles/styles.css';

const SusPedidos = () => {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [pedidos, setPedidos] = useState([]);
    const isAdmin = useSelector((state) => state.storeAuth.isAdmin);
    const loggedInUserId = useSelector((state) => state.storeUser.usuarios[0]?.id);

    useEffect(() => {
        if (!loggedInUserId) {
            navigate('/login');
        } else if (isAdmin) {
            axios.get(`${API_BASE_URL3}/api/Users`)
                .then((response) => {
                    setUsuarios(response.data.$values);
                    setSelectedUserId(response.data.$values[0]?.Id || '');
                })
                .catch((error) => console.error('Error al obtener los usuarios:', error));
        } else {
            setSelectedUserId(loggedInUserId);
        }
    }, [isAdmin, loggedInUserId, navigate]);

    useEffect(() => {
        if (selectedUserId) {
            axios.get(`${API_BASE_URL3}/api/Pedidos/user/${selectedUserId}`)
                .then((response) => {
                    setPedidos(response.data.$values);
                })
                .catch((error) => console.error('Error al obtener los pedidos:', error));
        }
    }, [selectedUserId]);

    const handleUserChange = (event) => {
        setSelectedUserId(event.target.value);
    };

    return (
        <div className="sus-pedidos-container">
            <h2>Pedidos</h2>
            {isAdmin && (
                <div className="user-select-container">
                    <label htmlFor="user-select">Seleccionar usuario: </label>
                    <select id="user-select" value={selectedUserId || ''} onChange={handleUserChange}>
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((user) => (
                            <option key={user.Id} value={user.Id}>
                                {user.Nombre} (ID: {user.Id})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="pedidos-list">
                <h3>Pedidos de {isAdmin ? 'usuario seleccionado' : 'tu cuenta'}</h3>
                {pedidos.length > 0 ? (
                    <ul>
                        {pedidos.map((pedido) => (
                            <li key={pedido.Id} className="pedido-item">
                                <div className="pedido-info">
                                    <span><strong>Pedido ID:</strong> {pedido.Id}</span>
                                    <span><strong>Fecha:</strong> {pedido.FechaPedido}</span>
                                    <span><strong>Total:</strong> ${pedido.Total}</span>
                                    <span
                                        className={`estado-pedido ${pedido.Estado.toLowerCase().replace(/\s+/g, '')}`}
                                        style={pedido.Estado.toLowerCase() === 'pendiente' ? { backgroundColor: '#8B0000', color: '#FFF' } : {}}
                                    >
                                        {pedido.Estado}
                                    </span>
                                </div>
                                <ul className="detalle-pedido">
                                    {pedido.DetallesPedidos.$values.map((detalle) => (
                                        <li key={detalle.Id} className="detalle-item">
                                            <strong>Producto:</strong> {detalle.Nombre} | <strong>Precio:</strong> ${detalle.Precio} | <strong>Cantidad:</strong> {detalle.Cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay pedidos para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default SusPedidos;
