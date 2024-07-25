import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL3 } from '../config';

const PedidosList = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(  `${API_BASE_URL3}/api/Pedidos`);
                // Verifica y ajusta cómo accedes a los datos
                const data = response.data.$values || [];
                setPedidos(data); // Ajusta según la estructura real
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Lista de Pedidos</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente ID</th>
                        <th>Fecha Pedido</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.Id}>
                            <td>{pedido.Id}</td>
                            <td>{pedido.ClienteId}</td>
                            <td>{new Date(pedido.FechaPedido).toLocaleString()}</td>
                            <td>{pedido.Total}</td>
                            <td>{pedido.Estado}</td>
                            <td>
                                <ul>
                                    {pedido.DetallesPedidos.$values.map(detalle => (
                                        <li key={detalle.Id}>
                                            Producto ID: {detalle.ProductoId}, Cantidad: {detalle.Cantidad}, Precio: {detalle.Precio}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PedidosList;
