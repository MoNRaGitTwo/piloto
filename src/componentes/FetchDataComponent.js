import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FetchDataComponent = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://angry-doodles-cough.loca.lt/Products/TodoProductos', {
                    headers: {
                        'bypass-tunnel-reminder': 'true', // Puedes usar cualquier valor aquí
                        'X-Password': '186.50.86.116' // Reemplaza con la contraseña correcta obtenida
                    }
                });
                setData(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {error && <p>Error fetching data: {error.message}</p>}
            {data && (
                <div>
                    <h2>Lista de Productos</h2>
                    <ul>
                        {data.map(product => (
                            <li key={product.id}>{product.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FetchDataComponent;
