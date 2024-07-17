import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';
import jsQR from 'jsqr';
import { useSelector, useDispatch } from 'react-redux';
import { registrarCompra, actualizarDeudaCliente } from '../reducers/clientesSlice';
import { actualizarMontoCaja, actualizarCajaCredito } from '../reducers/cajaSlice';
import CajaManager from './CajaManager';

const QuErre = () => {
  const webcamRef = useRef(null);
  const quaggaRef = useRef(null);
  const [barcodeValue, setBarcodeValue] = useState('1234567890');
  const [scannedProducts, setScannedProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [deudaCliente, setDeudaCliente] = useState(0);

  const productos = useSelector(state => state.storeProducto.productoSlice);
  const clientesGlobales = useSelector(state => state.storeClientes.clientesSlice);
  const montoCaja = useSelector(state => state.storeCaja.cajaContado);
  const montoCajaCredito = useSelector(state => state.storeCaja.cajaCredito);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Productos cargados desde el store:', productos);
  }, [productos]);

  const handleCapture = () => {
    const captureImage = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
          console.log('Código QR detectado:', qrCode.data);
          alert('Código QR detectado: ' + qrCode.data);

          const producto = productos.find(prod => prod.CodigoQR === qrCode.data);
          if (producto) {
            console.log("Producto encontrado:", producto.Name);
            setScannedProducts(prevProducts => [...prevProducts, producto]);
            setTotalPrice(prevTotal => prevTotal + producto.Price); // Actualizar el total
          } else {
            console.log("Producto no encontrado");
            alert('Producto no encontrado');
          }
          return;
        }

        Quagga.decodeSingle({
          src: imageSrc,
          numOfWorkers: 0,
          locate: true,
          inputStream: {
            size: 800
          },
          decoder: {
            readers: ['ean_reader', 'upc_reader']
          },
        }, (result) => {
          if (result && result.codeResult) {
            console.log('Código de barras detectado:', result.codeResult.code);
            setBarcodeValue(result.codeResult.code);
            alert('Código de barras detectado: ' + result.codeResult.code);
          } else {
            console.log('No se detectó ningún código QR ni de barras.');

            const productoDefault = productos.find(prod => prod.CodigoQR === '4321');
            if (productoDefault) {
              console.log("Producto por defecto encontrado:", productoDefault.Name);
              setScannedProducts(prevProducts => [...prevProducts, productoDefault]);
              setTotalPrice(prevTotal => prevTotal + productoDefault.Price); // Actualizar el total
            } else {
              console.log("Producto por defecto no encontrado");
              alert('Producto por defecto no encontrado');
            }
          }
        });
      };
    };

    captureImage();
  };

  useEffect(() => {
    quaggaRef.current = Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: webcamRef.current.video,
        constraints: {
          width: { min: 640 },
          height: { min: 480 },
          facingMode: 'environment'
        }
      },
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      numOfWorkers: 0,
      decoder: {
        readers: ['ean_reader', 'upc_reader']
      },
      locate: true,
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
      }
    }, (err) => {
      if (err) {
        console.error('Error al iniciar Quagga:', err);
        return;
      }
      console.log('Quagga iniciado correctamente.');
    });

    return () => {
      if (quaggaRef.current) {
        quaggaRef.current.stop();
        console.log('Quagga detenido.');
      }
    };
  }, []);

  const resetState = () => {
    setBarcodeValue('1234567890');
    setScannedProducts([]);
    setTotalPrice(0);
    setSelectedCliente('');
    setDeudaCliente(0);
  };

  const handlePayment = () => {
    if (selectedCliente) {
      const cliente = clientesGlobales.find(c => c.Id === parseInt(selectedCliente, 10));
      if (cliente) {
        const nuevoMontoCaja = montoCaja + totalPrice;
        dispatch(actualizarMontoCaja(nuevoMontoCaja)); // Actualizar el monto en caja en el estado global
        alert(`Pago realizado con éxito para el cliente: ${cliente.Nombre}`);
        resetState();
      } else {
        alert("Cliente no válido");
      }
    } else {
      alert("Por favor, seleccione un cliente");
    }
  };

  const handleCredit = async () => {
    if (selectedCliente) {
      const cliente = clientesGlobales.find(c => c.Id === parseInt(selectedCliente, 10));
      if (cliente) {
        const nuevoMontoCajaCredito = montoCajaCredito + totalPrice;
        dispatch(actualizarCajaCredito(nuevoMontoCajaCredito)); // Actualizar el monto en caja crédito en el estado global
        alert(`Venta a crédito registrada para el cliente: ${cliente.Nombre}. Monto en crédito actualizado: ${nuevoMontoCajaCredito}`);

        // Detalles de la compra
        const detalleCompra = scannedProducts.map(product => `${product.Name} (${product.Price}$)`).join(", ");

        // Datos de la compra
        const compraData = {
          ClienteId: cliente.Id,
          Detalle: detalleCompra,
          Total: totalPrice
        };

        // Enviar datos de la compra al backend
        dispatch(registrarCompra(compraData));

        // Actualizar deuda del cliente
        const deudaActualizada = cliente.Deuda + totalPrice;
        setDeudaCliente(deudaActualizada);
        dispatch(actualizarDeudaCliente({ clienteId: cliente.Id, nuevaDeuda: deudaActualizada }));
        resetState();
      } else {
        alert("Cliente no válido");
      }
    } else {
      alert("Por favor, seleccione un cliente");
    }
  };

  return (
    <div className="container">
      <div className="text-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={640}
          height={480}
          videoConstraints={{ facingMode: 'environment' }}
        />
        <button className="btn btn-dark mt-3" onClick={handleCapture}>Capturar Imagen</button>
      </div>
      <h2 className="mt-4">Generador de Códigos de Barras</h2>
      <p>Valor del código de barras: {barcodeValue}</p>
      <h3 className="mt-4">Detalle de la Compra:</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Cantidad</th>
            <th>Precio por Unidad</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {scannedProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.Name}</td>
              <td>1</td>
              <td>${product.Price}</td>
              <td>${product.Price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total a pagar: ${totalPrice.toFixed(2)}</h3>
      <h3>Deuda del Cliente: ${deudaCliente.toFixed(2)}</h3>
      <div>
        <button className="btn btn-primary mr-2" onClick={handlePayment}>Pagar</button>
        <button className="btn btn-secondary" onClick={handleCredit}>Crédito</button>
        {clientesGlobales.length > 0 && (
          <select className="form-control mt-2" value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
            <option value="">Seleccione un cliente</option>
            {clientesGlobales.map(cliente => (
              <option key={cliente.Id} value={cliente.Id}>{cliente.Nombre}</option>
            ))}
          </select>
        )}
      </div>
      <CajaManager />
    </div>
  );
};

export default QuErre;
