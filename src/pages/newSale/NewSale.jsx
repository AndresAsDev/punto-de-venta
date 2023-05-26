import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, runTransaction, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  TextField,
  Snackbar,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { db } from '../../firebase';
import './newVenta.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { getDocs } from 'firebase/firestore';


const NewSale = ({ title }) => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [cantidadProducto, setCantidadProducto] = useState(0);
  const [servicios, setServicios] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [cantidadServicio, setCantidadServicio] = useState(0);
  const [total, setTotal] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [ventaItems, setVentaItems] = useState([]);
  const [updatedStockItems, setUpdatedStockItems] = useState([]);

  useEffect(() => {
    // Cargar productos desde Firebase
    const loadProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    // Cargar servicios desde Firebase
    const loadServicios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const serviciosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicios(serviciosData);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      }
    };

    loadProductos();
    loadServicios();
  }, []);

  useEffect(() => {
    // Calcular el subtotal de productos
    const subtotalProductos = ventaItems.reduce((subtotal, item) => {
      if (item.producto) {
        return subtotal + item.subtotalProducto;
      }
      return subtotal;
    }, 0);

    // Calcular el subtotal de servicios
    const subtotalServicios = ventaItems.reduce((subtotal, item) => {
      if (item.servicio) {
        return subtotal + item.subtotalServicio;
      }
      return subtotal;
    }, 0);

    // Calcular el total
    const total = subtotalProductos + subtotalServicios;
    setTotal(total);
  }, [ventaItems]);

  const handleAgregarProducto = () => {
    if (selectedProducto && cantidadProducto > 0) {
      const productosAgregados = ventaItems.filter((item) => item.producto);
      const stockDisponible = selectedProducto.stock - productosAgregados.reduce((total, item) => total + item.cantidadProducto, 0);
      
      if (cantidadProducto <= stockDisponible) {
        const existingItem = ventaItems.find((item) => item.producto && item.producto.id === selectedProducto.id);
  
        if (existingItem) {
          const updatedItems = ventaItems.map((item) => {
            if (item.producto && item.producto.id === selectedProducto.id) {
              const updatedCantidad = item.cantidadProducto + cantidadProducto;
              const updatedSubtotal = selectedProducto.precio_venta * updatedCantidad;
              return {
                ...item,
                cantidadProducto: updatedCantidad,
                subtotalProducto: updatedSubtotal,
              };
            }
            return item;
          });
  
          setVentaItems(updatedItems);
        } else {
          const newItem = {
            producto: selectedProducto,
            cantidadProducto,
            subtotalProducto: selectedProducto.precio_venta * cantidadProducto,
            servicio: null,
            cantidadServicio: 0,
            subtotalServicio: 0,
          };
      
          setVentaItems((prevItems) => [...prevItems, newItem]);
        }
  
        setSelectedProducto(null);
        setCantidadProducto(0);
      } else {
        setOpenSnackbar(true);
      }
    } else {
      setOpenSnackbar(true);
    }
  };
  
  

  const handleAgregarServicio = () => {
    if (selectedServicio) {
      const existingItem = ventaItems.find((item) => item.servicio && item.servicio.id === selectedServicio.id);
  
      if (existingItem) {
        const updatedItems = ventaItems.map((item) => {
          if (item.servicio && item.servicio.id === selectedServicio.id) {
            const updatedCantidad = item.cantidadServicio + cantidadServicio;
            const updatedSubtotal = selectedServicio.precio_venta * updatedCantidad;
            return {
              ...item,
              cantidadServicio: updatedCantidad,
              subtotalServicio: updatedSubtotal,
            };
          }
          return item;
        });
  
        setVentaItems(updatedItems);
      } else {
        const newItem = {
          producto: null,
          cantidadProducto: 0,
          subtotalProducto: 0,
          servicio: selectedServicio,
          cantidadServicio,
          subtotalServicio: selectedServicio.precio_venta * cantidadServicio,
        };
  
        setVentaItems((prevItems) => [...prevItems, newItem]);
      }
  
      setSelectedServicio(null);
      setCantidadServicio(0);
    } else {
      setOpenSnackbar(true);
    }
  };
  
  

  

  const handleEliminarItem = (index) => {
    const deletedItem = ventaItems[index];
    setVentaItems((prevItems) => prevItems.filter((item, i) => i !== index));
    setTotal((prevTotal) => prevTotal - deletedItem.subtotalProducto - deletedItem.subtotalServicio);
  
    // Restaurar el stock del producto eliminado
    if (deletedItem.producto) {
      const updatedItem = { ...deletedItem, cantidadProducto: 0 }; // Establecer cantidadProducto en 0
      setUpdatedStockItems((prevItems) => [...prevItems, updatedItem]);
    }
  };

  const restoreStock = async () => {
    for (const item of updatedStockItems) {
      try {
        if (!isNaN(item.cantidadProducto) && item.cantidadProducto >= 0) { // Verificar si es un número válido y mayor o igual a 0
          const productRef = doc(db, 'products', item.producto.id);
          await runTransaction(db, async (transaction) => {
            const productSnapshot = await transaction.get(productRef);
            const updatedStock = productSnapshot.data().stock + item.cantidadProducto;
            transaction.update(productRef, { stock: updatedStock });
          });
        } else {
          console.error('Cantidad de producto no válida:', item.cantidadProducto);
        }
      } catch (error) {
        console.error('Error al restaurar el stock del producto:', error);
      }
    }
    setUpdatedStockItems([]);
  };
    

  useEffect(() => {
    const restoreStock = async () => {
      for (const item of updatedStockItems) {
        try {
          const productRef = doc(db, 'products', item.id);
          await runTransaction(db, async (transaction) => {
            const productSnapshot = await transaction.get(productRef);
            const updatedStock = productSnapshot.data().stock + item.cantidadProducto;
            transaction.update(productRef, { stock: updatedStock });
          });
        } catch (error) {
          console.error('Error al restaurar el stock del producto:', error);
        }
      }
      setUpdatedStockItems([]);
    };

    if (updatedStockItems.length > 0) {
      restoreStock();
    }
  }, [updatedStockItems]);

  const handleVenta = async () => {
    if (ventaItems.length === 0) {
      setOpenSnackbar(true);
      return;
    }

    try {
      for (const item of ventaItems) {
        if (item.producto) {
          const productRef = doc(db, 'products', item.producto.id);
          await runTransaction(db, async (transaction) => {
            const productSnapshot = await transaction.get(productRef);
            const updatedStock = productSnapshot.data().stock - item.cantidadProducto;
            if (updatedStock >= 0) {
              transaction.update(productRef, { stock: updatedStock });
            } else {
              throw new Error('No hay suficiente stock disponible.');
            }
          });
        }
      }

      const ventaData = {
        items: ventaItems,
        total,
        fecha: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'ventas'), ventaData);
      console.log('Venta guardada con éxito:', docRef.id);

      // Restablecer los campos del formulario
      setVentaItems([]);
      setTotal(0);
      setSuccessMessage('Venta guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la venta:', error);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar title={title} />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <h2>Productos</h2>
              <InputLabel id="demo-select-small-label"></InputLabel>

              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={selectedProducto ? selectedProducto.id : ''}
                onChange={(e) => {
                  const selectedProductId = e.target.value;
                  const selectedProduct = productos.find((producto) => producto.id === selectedProductId);
                  setSelectedProducto(selectedProduct);
                }}
              >
                {productos.map((producto) => (
                  <MenuItem key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(Number(e.target.value))}
                margin="dense"
              />
            </FormControl>

            <div className="actions">
              <button onClick={handleAgregarProducto}>Agregar Producto</button>
            </div>
          </div>
          <div className="right">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <h2>Servicio</h2>
              <Select
                value={selectedServicio ? selectedServicio.id : ''}
                onChange={(e) => {
                  const selectedServicioId = e.target.value;
                  const selectedServicio = servicios.find((servicio) => servicio.id === selectedServicioId);
                  setSelectedServicio(selectedServicio);
                }}
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <MenuItem key={servicio.id} value={servicio.id}>
                    {servicio.nombre}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidadServicio}
                onChange={(e) => setCantidadServicio(Number(e.target.value))}
                margin="dense"
              />
            </FormControl>

            <div className="actions">
              <button onClick={handleAgregarServicio}>Agregar Servicio</button>
            </div>
          </div>
        </div>
        <div className="items">
          <h2>Items</h2>
          {ventaItems.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ventaItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.producto ? item.producto.nombre : item.servicio.nombre}
                      </TableCell>
                      <TableCell>
                        {item.producto ? item.cantidadProducto : item.cantidadServicio}
                      </TableCell>
                      <TableCell>
                        {item.producto ? item.subtotalProducto : item.subtotalServicio}
                      </TableCell>
                      <TableCell>
                        <div
                          className="deletepresale"
                          onClick={() => handleEliminarItem(index)}
                        >
                          Delete
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No se han agregado items</p>
          )}
        </div>
        <div className="total">
          <h2>Total: {total}</h2>
        </div>
        <div className="bottomActions">
          <button onClick={handleVenta}>Guardar Venta</button>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Error al guardar la venta"
      />
    </div>
  );
};

export default NewSale;