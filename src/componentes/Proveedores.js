import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
    const [productoId, setProductoId] = useState('');
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Obtener todos los proveedores desde la API
        const fetchProveedores = async () => {
            try {
                const response = await axios.get('http://localhost:5153/TodosProveedores');
                // Extraer la lista de proveedores desde la respuesta de la API
                const proveedoresData = response.data.$values || [];
                setProveedores(proveedoresData);
            } catch (error) {
                console.error('Error al obtener los proveedores:', error);
            }
        };

        fetchProveedores();
    }, []);

    const handleProveedorChange = async (event) => {
        const proveedorId = event.target.value;
        setProveedorSeleccionado(proveedorId);

        if (proveedorId) {
            try {
                // Obtener productos asociados al proveedor seleccionado
                const response = await axios.get(`http://localhost:5153/Products/ObtenerProductosPorProveedor/${proveedorId}`);
                console.log("soy los productos con los porveedores", response.data.$values);

                setProductos(response.data.$values);
            } catch (error) {
                console.error('Error al obtener productos por proveedor:', error);
            }
        } else {
            setProductos([]);
        }
    };

    const asociarProducto = async () => {
        if (proveedorSeleccionado && productoId) {
            try {
                // Construcción de la URL con template literals usando los valores dinámicos
                await axios.post(`http://localhost:5153/Products/AsociarProductoAProveedor?proveedorId=${proveedorSeleccionado}&productoId=${parseInt(productoId, 10)}`, {
                    proveedorId: proveedorSeleccionado,
                    productoId: parseInt(productoId, 10)
                });
                alert('Producto asociado exitosamente.');
                // Recargar la lista de productos del proveedor después de asociar uno nuevo
                handleProveedorChange({ target: { value: proveedorSeleccionado } });
            } catch (error) {
                console.error('Error al asociar producto al proveedor:', error);
                alert('Error al asociar el producto. Intente nuevamente.');
            }
        } else {
            alert('Seleccione un proveedor y un ID de producto válido.');
        }
    };

    return (
        <div style={{ backgroundColor: '#1c1c1c', padding: '20px', borderRadius: '10px', color: 'white' }}>
            <h2>Asociar Producto a Proveedor</h2>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="proveedorSelect">Seleccione un Proveedor: </label>
                <select
                    id="proveedorSelect"
                    value={proveedorSeleccionado}
                    onChange={handleProveedorChange}
                    style={{ padding: '5px', margin: '10px' }}
                >
                    <option value="">-- Selecciona un Proveedor --</option>
                    {proveedores.map((proveedor) => (
                        <option key={proveedor.Id} value={proveedor.Id}>
                            {proveedor.Nombre} - {proveedor.Empresa}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="productoId">ID del Producto: </label>
                <input
                    type="number"
                    id="productoId"
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                    style={{ padding: '5px', margin: '10px' }}
                />
            </div>

            <button onClick={asociarProducto} style={{ backgroundColor: '#a00', padding: '10px', borderRadius: '5px', color: 'white' }}>
                Guardar
            </button>

            {productos.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Productos Asociados:</h3>
                    <ul>
                        {productos.map((producto) => (
                            <li key={producto.Id}>
                                {producto.Name} (ID: {producto.Id})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Proveedores;
