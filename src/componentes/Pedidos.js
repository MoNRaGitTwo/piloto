import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {  actualizarEstadoPedido, addProductoPedido } from '../reducers/pedidosSlice';
import { actualizarEstadoPedido as actualizarEstadoPedidoGlobal } from '../reducers/pedidoEstadoSlice';
import { API_BASE_URL3 } from '../config';

const PedidosList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const pedidos = useSelector((state) => state.storePedidos.pedidosSlice); // Obtén los pedidos desde el store global
    console.log("soy pedidos xxx-9 " , pedidos)
   // const usuario = useSelector((state) => state.storeUser.usuarios); // Obtén los usuarios desde el store
    const [todosUsuarios, setTodosUsuarios] = useState([]); // Estado para almacenar todos los usuarios

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const responsePedidos = await axios.get(`${API_BASE_URL3}/Pedidos`);
                const dataPedidos = responsePedidos.data.$values || [];


                const responseUsuarios = await axios.get(`${API_BASE_URL3}/Users`);
                const dataUsuarios = responseUsuarios.data.$values || [];
                setTodosUsuarios(dataUsuarios); // Guarda los usuarios en el estado

                //console.log("soy todos los usarios  ", dataUsuarios)
                //console.log("soy ele pedido  ", dataPedidos)

                //console.log("Pedidos recibidos:", dataPedidos);
                dataPedidos.forEach(pedido => {
                    const detalles = pedido.DetallesPedidos?.$values || []; // Usa el operador ?. para evitar errores si DetallesPedidos es undefined
                    //console.log("Detalles del pedido:", detalles);
                });

                setLoading(false);

                dataPedidos.forEach(pedido => {
                    dispatch(addProductoPedido(pedido));
                });

            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [dispatch]);



    // Función actualizada para obtener el nombre del usuario
    const getNombreUsuario = (userId) => {
        const user = todosUsuarios.find(u => u.Id === userId); // Usa todosUsuarios para encontrar el usuario
        return user ? user.Nombre : 'Desconocido'; // Devuelve el nombre si lo encuentra
    };

    const handleEstadoChange = (pedidoId) => {
        const pedidoActual = pedidos.find(pedido => pedido.Id === pedidoId);
        if (!pedidoActual) return;

        let nuevoEstado = pedidoActual.Estado;
        if (pedidoActual.Estado === 'Pendiente') {
            nuevoEstado = 'En proceso';
        } else if (pedidoActual.Estado === 'En proceso') {
            nuevoEstado = 'Listo';
        } else if (pedidoActual.Estado === 'Listo') {
            if (window.confirm("¿Deseas eliminar este pedido?")) {
               
                return;
            }
        }

        const pedidoActualizado = { ...pedidoActual, Estado: nuevoEstado };
        actualizarEstadoPedido(pedidoActualizado);
    };

  

    const actualizarEstadoPedido = async (pedido) => {
        try {
            await dispatch(actualizarEstadoPedidoGlobal(pedido));
            alert("Estado del pedido actualizado correctamente.");
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
            alert('Error al actualizar el estado del pedido.');
        }
    };

    const getButtonColor = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return 'darkred';
            case 'En proceso':
                return 'darkorange';
            case 'Listo':
                return 'darkgreen';
            default:
                return 'gray';
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Lista de Pedidos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Pedido ID</th>
                        <th>Cliente Nombre</th>
                        <th>Detalles</th>
                        <th>Cambiar Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={`pedido-${pedido.Id}`}>
                            <td>{pedido.Id}</td>
                            <td>{getNombreUsuario(pedido.UserId)}</td>
                            <td>
                                <ul>
                                    {(pedido.DetallesPedidos?.$values || []).map((detalle, index) => (
                                        <li key={`detalle-${pedido.Id}-${detalle.Id}-${index}`}>
                                            <strong>Producto:</strong> {detalle.Nombre}, <strong>Precio:</strong> {detalle.Precio} MXN, <strong>Cantidad:</strong> {detalle.Cantidad}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleEstadoChange(pedido.Id)}
                                    style={{
                                        backgroundColor: getButtonColor(pedido.Estado),
                                        color: 'white',
                                        padding: '10px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {pedido.Estado}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PedidosList;