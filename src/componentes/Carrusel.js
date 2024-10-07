import React from 'react';
import { useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/styles.css';

const ProductCarousel = () => {
  const productos = useSelector((state) => state.storeProducto.productoSlice);

  // Filtra los productos para incluir solo aquellos cuyo nombre comience con "Of-"
  //const productosFiltrados = productos?.filter(producto => producto.Name.startsWith('Of-'));
  const productosFiltrados = productos?.filter(producto => producto.Name && producto.Name.startsWith('Of-'));


  // Si no hay productos filtrados, muestra un mensaje de carga o un componente vacío
  if (!productosFiltrados || productosFiltrados.length === 0) {
    return <div>No hay productos disponibles carrusel</div>;
  }

  return (
    <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      interval={3000}
    >
      {productosFiltrados.map((producto) => (
        <div key={producto.Id} className="carousel-item">
          <img
            src={producto.ImageData ? `data:image/jpeg;base64,${producto.ImageData}` : '/path/to/placeholder-image.jpg'}
            alt={producto.Name}
            className="carousel-image"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
